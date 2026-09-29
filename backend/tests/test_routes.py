from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_sources():
    response = client.get("/api/sources")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_get_source_not_found():
    response = client.get("/api/sources/NON_EXISTENT_ID")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
    assert data["error_code"] == "RESOURCE_NOT_FOUND"

def test_get_entities():
    response = client.get("/api/entities")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True

def test_get_conflicts():
    response = client.get("/api/conflicts")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True

def test_get_evidence():
    response = client.get("/api/evidence")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True

def test_get_recommendations():
    response = client.get("/api/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True

def test_get_verification():
    response = client.get("/api/verification")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True

def test_get_audit():
    response = client.get("/api/audit")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
