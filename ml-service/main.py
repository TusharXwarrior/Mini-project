import os
from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

APP_DIR = Path(__file__).resolve().parent
MODEL_PATH = Path(os.getenv("MODEL_PATH", APP_DIR / "artifacts" / "dropout_model.joblib"))
METADATA_PATH = MODEL_PATH.with_name("model_metadata.json")

app = FastAPI(title="EduRisk AI ML Service", version="1.0.0", description="Student retention risk inference API")
_model = None
_metadata: dict[str, Any] = {}

class StudentFeatures(BaseModel):
    age: float = Field(ge=15, le=100)
    cgpa: float = Field(ge=0, le=10)
    previousCgpa: float = Field(ge=0, le=10)
    backlogs: int = Field(ge=0)
    internalMarks: float = Field(ge=0, le=50)
    attendance: float = Field(ge=0, le=100)
    assignmentCompletion: float = Field(ge=0, le=100)
    classesMissed: int = Field(ge=0)
    scholarship: str = Field(pattern="^(Yes|No)$")
    feeStatus: str = Field(pattern="^(Paid|Pending)$")

def load_model():
    global _model, _metadata
    if MODEL_PATH.exists():
        _model = joblib.load(MODEL_PATH)
        if METADATA_PATH.exists():
            import json
            _metadata = json.loads(METADATA_PATH.read_text(encoding="utf-8"))
    else:
        _model = None

@app.on_event("startup")
def startup():
    load_model()

@app.get("/health")
def health():
    return {"status": "ok", "service": "edurisk-ml", "model_loaded": _model is not None,
            "model_version": _metadata.get("model_version")}

@app.get("/model-info")
def model_info():
    return {"trained": _model is not None, "metadata": _metadata if _model is not None else None,
            "message": None if _model is not None else "No trained model artifact. Train with a real labelled dataset."}

@app.post("/reload")
def reload_model():
    load_model()
    if _model is None:
        raise HTTPException(status_code=503, detail="Model artifact not found. Train the model first.")
    return {"success": True, "model_version": _metadata.get("model_version")}

@app.post("/predict")
def predict(features: StudentFeatures):
    if _model is None:
        raise HTTPException(status_code=503, detail="ML model is not trained/deployed yet. Add a real labelled dataset and run train_model.py.")
    row = pd.DataFrame([features.model_dump()])
    probability = float(_model.predict_proba(row)[0][1])
    risk = "High" if probability >= 0.70 else "Medium" if probability >= 0.40 else "Low"
    return {
        "success": True,
        "riskLevel": risk,
        "dropoutRiskProbability": round(probability * 100, 2),
        "modelVersion": _metadata.get("model_version", "unknown"),
        "modelMetrics": _metadata.get("metrics"),
        "disclaimer": "A screening estimate for human review, not a definitive prediction or basis for high-impact decisions."
    }
