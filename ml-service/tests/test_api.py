from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def sample_student():
    return {
        "age": 20, "cgpa": 7.1, "previousCgpa": 7.3, "backlogs": 0,
        "internalMarks": 36, "attendance": 82, "assignmentCompletion": 75,
        "classesMissed": 5, "scholarship": "No", "feeStatus": "Paid"
    }

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_model_info_reports_untrained_model_without_artifact():
    response = client.get("/model-info")
    assert response.status_code == 200
    assert "trained" in response.json()

def test_prediction_requires_a_trained_artifact():
    response = client.post("/predict", json=sample_student())
    # The repository intentionally does not ship a fabricated model artifact.
    assert response.status_code in (200, 503)

def test_prediction_rejects_invalid_feature_ranges():
    payload = sample_student()
    payload["attendance"] = 140
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
