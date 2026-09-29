SYNTHETIC_EVIDENCE_NODES = [
    {
        "id": "EVID-GEOM-014",
        "entityId": "CANONICAL-014",
        "sourceId": "MUNI-GIS-WARD18",
        "sourceName": "Municipal GIS",
        "evidenceType": "Geometry Observation",
        "title": "Ward 18 Municipal Cadastral Polygon Vector",
        "timestamp": "2024-04-12T00:00:00Z",
        "confidence": 94.0,
        "metadata": {"area_sqm": 2430.0, "crs": "EPSG:4326"},
    },
    {
        "id": "EVID-DEED-98102",
        "entityId": "CANONICAL-014",
        "sourceId": "REGISTRY-PROP-014",
        "sourceName": "Property Registry",
        "evidenceType": "Conveyance Deed Record",
        "title": "Registered Sub-Registrar Title Deed Index #98102",
        "timestamp": "2025-11-04T00:00:00Z",
        "confidence": 92.0,
        "metadata": {"deed_area_sqm": 2510.0, "owner": "Devi Sharan & Sons"},
    },
    {
        "id": "EVID-SURV-SP2291",
        "entityId": "CANONICAL-014",
        "sourceId": "SURVEY-2025-SP2291",
        "sourceName": "Survey Dataset",
        "evidenceType": "Field GNSS Control Survey",
        "title": "Field Differential GNSS Survey Control SP-2291",
        "timestamp": "2025-11-12T00:00:00Z",
        "confidence": 98.4,
        "metadata": {"accuracy": "0.02m", "measured_area": 2465.0},
    },
]

SYNTHETIC_EVIDENCE_RELATIONSHIPS = [
    {"from": "MUNI-GIS-WARD18", "to": "EVID-GEOM-014"},
    {"from": "REGISTRY-PROP-014", "to": "EVID-DEED-98102"},
    {"from": "SURVEY-2025-SP2291", "to": "EVID-SURV-SP2291"},
    {"from": "EVID-GEOM-014", "to": "CANONICAL-014"},
    {"from": "EVID-DEED-98102", "to": "CANONICAL-014"},
    {"from": "EVID-SURV-SP2291", "to": "CANONICAL-014"},
]
