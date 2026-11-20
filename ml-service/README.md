# EduRisk AI — ML training and inference

This service trains a Random Forest classifier from real, institution-approved historical records and exposes inference over HTTP.

## 1. Prepare labelled data
Copy `data/training_template.csv` to `data/training_data.csv`. Each row must represent a student at a historical observation point, with the outcome known later:
- `dropout=1`: student subsequently dropped out.
- `dropout=0`: student remained enrolled / completed the relevant observation period.

Required columns are in the template. Use only features known at prediction time. Do not include names, student IDs, gender, caste, religion, disability, or other sensitive attributes. Obtain institutional approval and protect the dataset.

At least 50 rows and both target classes are required for a demo training run; 500+ representative records are recommended. A larger, time-based and institution-held-out evaluation is preferable. A tiny or imbalanced dataset may produce misleading metrics.

## 2. Train locally
```bash
cd ml-service
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python train_model.py --data data/training_data.csv
```
The model and metadata are written to `artifacts/` (ignored by Git). Review precision, recall, F1 and ROC-AUC before using the model. Never train on the demo student profiles; they have no verified outcome labels.

## 3. Run inference API
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```
- `GET /health`
- `GET /model-info`
- `POST /reload` reloads an updated artifact
- `POST /predict` accepts the feature fields and returns a risk band and probability

Set backend `ML_SERVICE_URL=http://localhost:8000`. The Node API exposes `GET /api/predictions/model-status`, `GET /api/predictions/summary`, and `GET /api/predictions/:studentMongoIdOrStudentId`.

## 4. Important limitations
The risk percentage is a model estimate, not a fact, diagnosis, or validated causal measure. Thresholds (Low <40%, Medium 40–69.99%, High >=70%) are display bands, not institution-approved intervention cutoffs. Evaluate calibration, false negatives/positives, subgroup fairness, data drift and performance on a later cohort before operational use. Human review and supportive interventions are required; do not use this output alone for discipline, admission, scholarship, grading or other high-impact decisions.
