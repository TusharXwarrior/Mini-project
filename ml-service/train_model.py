"""Train EduRisk's dropout classifier using institution-approved historical records.

Expected CSV columns:
age,cgpa,previousCgpa,backlogs,internalMarks,attendance,assignmentCompletion,
classesMissed,scholarship,feeStatus,dropout

dropout must be 1 for a student who subsequently dropped out and 0 otherwise.
Only use features that were available at the time the intervention would have been made.
Do not include names, IDs, gender, caste, religion, disability or other sensitive identifiers.
"""
import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, classification_report, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

NUMERIC = ["age", "cgpa", "previousCgpa", "backlogs", "internalMarks", "attendance", "assignmentCompletion", "classesMissed"]
CATEGORICAL = ["scholarship", "feeStatus"]
TARGET = "dropout"
REQUIRED = NUMERIC + CATEGORICAL + [TARGET]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data/training_data.csv")
    parser.add_argument("--output", default="artifacts/dropout_model.joblib")
    parser.add_argument("--test-size", type=float, default=0.2)
    args = parser.parse_args()

    source = Path(args.data)
    if not source.exists():
        raise SystemExit(f"Training CSV not found: {source}. Copy data/training_template.csv and populate it with approved, real historical labels.")
    df = pd.read_csv(source)
    missing = sorted(set(REQUIRED) - set(df.columns))
    if missing:
        raise SystemExit(f"Missing required columns: {', '.join(missing)}")
    df = df[REQUIRED].copy().dropna(subset=[TARGET])
    df[TARGET] = pd.to_numeric(df[TARGET], errors="coerce")
    df = df.dropna(subset=[TARGET])
    if not set(df[TARGET].unique()).issubset({0, 1}):
        raise SystemExit("dropout target must contain only 0 (retained) and 1 (dropped out).")
    if df[TARGET].nunique() != 2:
        raise SystemExit("Training requires examples from both classes: retained (0) and dropout (1).")
    if len(df) < 50:
        raise SystemExit(f"Only {len(df)} labelled rows found. At least 50 are required for a demo training run; 500+ representative records are recommended before any serious evaluation.")
    y = df[TARGET].astype(int)
    X = df[NUMERIC + CATEGORICAL]
    counts = y.value_counts()
    if counts.min() < 5:
        raise SystemExit("At least 5 examples of each outcome are required for a stratified train/test split.")

    preprocessor = ColumnTransformer([
        ("numeric", SimpleImputer(strategy="median"), NUMERIC),
        ("categorical", Pipeline([("imputer", SimpleImputer(strategy="most_frequent")), ("onehot", OneHotEncoder(handle_unknown="ignore"))]), CATEGORICAL),
    ])
    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(n_estimators=400, min_samples_leaf=2, class_weight="balanced", random_state=42, n_jobs=-1)),
    ])
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=args.test_size, random_state=42, stratify=y)
    pipeline.fit(X_train, y_train)
    probabilities = pipeline.predict_proba(X_test)[:, 1]
    predictions = (probabilities >= 0.5).astype(int)
    metrics = {
        "testRows": int(len(y_test)),
        "accuracy": round(float(accuracy_score(y_test, predictions)), 4),
        "precision": round(float(precision_score(y_test, predictions, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, predictions, zero_division=0)), 4),
        "f1": round(float(f1_score(y_test, predictions, zero_division=0)), 4),
        "rocAuc": round(float(roc_auc_score(y_test, probabilities)), 4),
        "classDistribution": {str(k): int(v) for k, v in counts.items()},
        "classificationReport": classification_report(y_test, predictions, output_dict=True, zero_division=0),
    }
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, output)
    metadata = {
        "model_version": datetime.now(timezone.utc).strftime("edurisk-%Y%m%d-%H%M%S"),
        "algorithm": "RandomForestClassifier",
        "trainingRows": int(len(df)),
        "featureColumns": NUMERIC + CATEGORICAL,
        "targetDefinition": "dropout=1 means subsequently dropped out; 0 means retained",
        "metrics": metrics,
        "trainedAt": datetime.now(timezone.utc).isoformat(),
        "warning": "Evaluate on representative, institution-approved data. Test metrics are not proof of generalisation or fairness.",
    }
    output.with_name("model_metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print(json.dumps(metadata, indent=2))
    print(f"Saved model to {output}")

if __name__ == "__main__":
    main()
