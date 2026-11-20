# EduRisk AI — Student Dropout Risk Screening & Retention Support

EduRisk AI is a student-support prototype with a React frontend, Node/Express API, MongoDB student records and a separate Python machine-learning service.

## Project parts
- **Part 1 — Frontend/data collection:** student intake form, validation and profile views.
- **Part 2 — Backend/database:** student CRUD APIs and persistent MongoDB records.
- **Part 3 — ML risk screening:** supervised Random Forest training from labelled historical data, inference API, individual risk view, cohort summary and transparent supportive next-step prompts.
- **Conversation/progress module:** use the Conversations & Progress page when that feature is present in your checked-out branch; it stores counsellor/student messages and progress checkpoints.

## Architecture
- Frontend: React, Vite, React Router, Tailwind CSS, Axios.
- Main API: Node.js 22+, Express, Mongoose.
- Database: MongoDB / MongoDB Atlas.
- ML service: Python 3.11, FastAPI, pandas, scikit-learn, joblib.

## Run locally

### 1. MongoDB
Start local MongoDB or create an Atlas database. Set the connection string in `backend/.env`.

### 2. Python ML service
Use an institution-approved labelled dataset; do not use the example/demo student records as labelled training data.

```bash
cd ml-service
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

Copy `data/training_template.csv` to `data/training_data.csv`, then fill the rows with historical examples whose eventual outcome is known:
- `dropout=1`: student subsequently dropped out.
- `dropout=0`: student remained enrolled/completed the defined observation period.

Train and inspect the metrics:
```bash
python train_model.py --data data/training_data.csv
```
The trainer requires at least 50 rows, both classes and at least 5 examples per class. This is only a minimum demo guardrail; 500+ representative records and a time-based, cohort-held-out evaluation are recommended. The generated `artifacts/` directory is intentionally git-ignored. Keep the model artifact available to the ML service at runtime (deploy it through a private artifact store or a controlled build process).

Start the ML API:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```
Check `http://localhost:8000/health` and `/model-info`.

### 3. Node backend
```bash
cd backend
npm install
cp .env.example .env
```
Set:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/student_dropout_db
CLIENT_ORIGIN=http://localhost:5173
ML_SERVICE_URL=http://127.0.0.1:8000
```
Then run `npm run dev` (or `npm start`).

### 4. React frontend
From the repository root:
```bash
npm install
cp .env.example .env
npm run dev
```
Set `VITE_API_BASE_URL=http://localhost:5000/api`. Open the Vite URL.

## Part 3 workflow
1. Register a student using the intake form. The existing form collects all model input features.
2. Ensure the ML service has a trained artifact and is running.
3. Open a student's profile. The AI Dropout Risk Assessment panel calls the backend prediction API.
4. Open **Risk Analysis** in the navigation for a cohort-wide summary.
5. Review the suggested supportive prompts and contact the student to understand the underlying situation. A model score must never replace a human conversation.

## API endpoints
Main Node API:
- `GET /api/health`
- Existing student CRUD: `/api/students`
- `GET /api/predictions/model-status`
- `GET /api/predictions/summary`
- `GET /api/predictions/:id` — MongoDB ObjectId or studentId

Python ML API:
- `GET /health`
- `GET /model-info`
- `POST /reload`
- `POST /predict`

## Model and evaluation notes
- Model: scikit-learn Pipeline with median/mode imputation, one-hot encoding and class-weighted Random Forest.
- The training script prints accuracy, precision, recall, F1 and ROC-AUC on a stratified hold-out split.
- Probability bands are illustrative defaults: Low <40%, Medium 40–69.99%, High >=70%. They are not calibrated or validated intervention thresholds.
- The supportive prompts are transparent rules based on attendance, CGPA trend, assignment completion, backlogs and fee status. They are not feature attribution or an explanation of why the model predicted a given score.
- Missing prediction results are shown as unavailable, never silently classified as low risk.

## Deployment (Render)
The root `render.yaml` defines three services: Node API, Python ML API and static frontend. Before deploying:
1. Create MongoDB Atlas and configure the backend `MONGODB_URI`.
2. Set backend `CLIENT_ORIGIN` to the exact deployed frontend origin.
3. Set backend `ML_SERVICE_URL` to the deployed Python ML service URL.
4. Set frontend `VITE_API_BASE_URL` to the deployed Node API URL plus `/api`.
5. Ensure the trained model artifact is placed at `ml-service/artifacts/dropout_model.joblib` and its metadata JSON alongside it. Do not commit private student data or secrets.
6. Verify all three health checks and run one end-to-end prediction with a test record before presenting the system.

The ML artifact is not included in Git because no labelled dataset was supplied. Therefore the ML service correctly reports "model not loaded" until you train and deploy a real model. A working build/deployment cannot honestly be claimed until this data-dependent step and live environment checks are completed.

## Privacy, security and responsible use
This is a prototype and the existing repository does not yet enforce authenticated student/counsellor/admin identities. A view selector is not access control. Do not expose real student records publicly. Before production, implement server-side authentication, role-based authorization, student ownership checks, rate limits, audit trails, consent/privacy notices, retention rules, HTTPS and restricted database/network access.

Dropout labels and model scores can be biased by institutional conditions and incomplete data. Exclude sensitive/protected attributes, check data quality and subgroup performance, evaluate calibration and false-negative rates on later cohorts, and keep a qualified human in the loop. Never use the score alone for admission, grading, scholarship, discipline or other high-impact decisions.
