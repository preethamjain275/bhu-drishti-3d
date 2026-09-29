"""
BHOO-MITRA AI — Synthetic Demo Data Seed Script

Seeds the PostgreSQL database with the same synthetic urban demo dataset
currently used by the mock repository.

ALL RECORDS ARE CLEARLY MARKED:
  is_synthetic_demo = True

These records represent a fictitious Delhi Ward 18 / Sub-Registrar IX area
and must NOT be presented as real government land records.

Usage:
  cd backend
  python -m app.db.seed

Or from alembic upgrade followed by:
  python -m app.db.seed
"""

from __future__ import annotations

import logging
import sys
from datetime import datetime, timezone

logger = logging.getLogger(__name__)


# ─── Synthetic WKT Polygons ───────────────────────────────────────────────────
# Approximate bounding boxes around the demo Delhi Ward 18 area (EPSG:4326)
# These are SYNTHETIC geometry values — not surveyed boundaries.

PARCEL_014_WKT = (
    "POLYGON((77.2018 28.6006, 77.2031 28.6006, 77.2031 28.6019, "
    "77.2018 28.6019, 77.2018 28.6006))"
)

PARCEL_018_WKT = (
    "POLYGON((77.2028 28.6018, 77.2042 28.6018, 77.2042 28.6032, "
    "77.2028 28.6032, 77.2028 28.6018))"
)


def seed(session) -> None:
    """Run the full synthetic demo seed against the provided SQLAlchemy session."""
    from geoalchemy2 import WKTElement
    from app.models.source import DataSource, SourceAsset
    from app.models.entity import CanonicalEntity, EntityObservation, DEMO_SRID
    from app.models.conflict import ConflictCase
    from app.models.evidence import Evidence
    from app.models.recommendation import Recommendation
    from app.models.verification import VerificationRecord
    from app.models.audit import AuditEvent
    from app.models.quality import QualitySignal

    now = datetime.now(timezone.utc)

    # ── Check for existing demo data ──────────────────────────────────────────
    from sqlalchemy import select, func
    existing_count = session.execute(
        select(func.count()).select_from(DataSource).where(DataSource.is_synthetic_demo == True)
    ).scalar()
    if existing_count and existing_count > 0:
        logger.info("Synthetic demo data already present (%d sources) — skipping seed.", existing_count)
        return

    logger.info("Seeding synthetic demo data...")

    # ── 1. Data Sources ───────────────────────────────────────────────────────
    src_muni = DataSource(
        id="MUNI-GIS-WARD18",
        name="Municipal GIS Ward 18",
        type="Government GIS",
        format="GeoJSON",
        description="Official municipal spatial parcel register digitized from Ward 18 cadastral map sheets. [SYNTHETIC DEMO DATA]",
        organization="Delhi Municipal Corporation (DMC) GIS Cell",
        contact_email="gis-cell@dmc.gov.in",
        crs="EPSG:4326",
        authority_level="Municipal",
        reliability_score=92.0,
        status="CONNECTED",
        entity_count=18240,
        asset_count=3,
        spatial_metadata={
            "crs": "EPSG:4326",
            "crsName": "WGS 84 / World Geodetic System 1984",
            "targetCrs": "EPSG:4326",
            "transformationName": "Identity / WGS84 Direct Mapping",
            "geometryType": "Polygon",
            "bbox": [77.201, 28.599, 77.205, 28.604],
            "coveragePercentage": 98.5,
            "spatialExtentDescription": "Delhi Ward 18 Commercial & Mixed Sector",
            "accuracyMeters": 0.25,
        },
        temporal_metadata={
            "observationDate": "2024-04-12",
            "lastUpdated": "2026-09-24T16:20:00Z",
            "dataVintage": "FY 2024-25 Revision",
            "updateFrequency": "Monthly",
        },
        quality_metadata={
            "completeness": 94,
            "geometryValidity": 97,
            "attributeCompleteness": 91,
            "crsValidity": 100,
            "duplicateRate": 2,
            "overallQualityScore": 94.2,
            "weights": {"geometry": 0.3, "attributes": 0.25, "completeness": 0.2, "crs": 0.15, "duplicates": 0.1},
        },
        is_synthetic_demo=True,
        created_at=now,
        updated_at=now,
    )

    src_registry = DataSource(
        id="REGISTRY-PROP-014",
        name="Property Registry Register",
        type="Land Registry",
        format="GeoJSON / Tabular",
        description="Legal title deeds, conveyance records, and boundary descriptions. [SYNTHETIC DEMO DATA]",
        organization="Department of Revenue & Land Records (Sub-Registrar IX)",
        contact_email="subregistrar-ix@delhi.gov.in",
        crs="EPSG:4326",
        authority_level="State",
        reliability_score=95.0,
        status="READY",
        entity_count=14500,
        asset_count=2,
        spatial_metadata={
            "crs": "EPSG:4326",
            "crsName": "WGS 84 / World Geodetic System 1984",
            "targetCrs": "EPSG:4326",
            "transformationName": "Identity Direct Mapping",
            "geometryType": "Polygon",
            "bbox": [77.201, 28.599, 77.205, 28.604],
            "coveragePercentage": 94.0,
            "spatialExtentDescription": "Sub-Registrar District IX Title Records",
            "accuracyMeters": 0.5,
        },
        temporal_metadata={
            "observationDate": "2025-11-04",
            "lastUpdated": "2026-09-25T12:15:00Z",
            "dataVintage": "Current Deed Records",
            "updateFrequency": "Real-time",
        },
        quality_metadata={
            "completeness": 91,
            "geometryValidity": 89,
            "attributeCompleteness": 98,
            "crsValidity": 100,
            "duplicateRate": 1,
            "overallQualityScore": 91.8,
            "weights": {"geometry": 0.3, "attributes": 0.25, "completeness": 0.2, "crs": 0.15, "duplicates": 0.1},
        },
        is_synthetic_demo=True,
        created_at=now,
        updated_at=now,
    )

    src_survey = DataSource(
        id="SURVEY-2025-SP2291",
        name="GNSS Field Survey SP-2291",
        type="Survey Dataset",
        format="GeoJSON",
        description="Differential GNSS field survey with sub-centimeter accuracy. [SYNTHETIC DEMO DATA]",
        organization="Survey of India — Urban Cadastral Division",
        contact_email="cadastral@soi.gov.in",
        crs="EPSG:4326",
        authority_level="National",
        reliability_score=99.0,
        status="READY",
        entity_count=450,
        asset_count=1,
        spatial_metadata={
            "crs": "EPSG:4326",
            "crsName": "WGS 84",
            "targetCrs": "EPSG:4326",
            "transformationName": "Direct GNSS",
            "geometryType": "Polygon",
            "bbox": [77.201, 28.599, 77.205, 28.604],
            "coveragePercentage": 12.0,
            "spatialExtentDescription": "GNSS Control Survey SP-2291 Area",
            "accuracyMeters": 0.02,
        },
        temporal_metadata={
            "observationDate": "2025-11-12",
            "lastUpdated": "2025-11-12T08:00:00Z",
            "dataVintage": "Field Survey 2025",
            "updateFrequency": "One-time",
        },
        quality_metadata={
            "completeness": 100,
            "geometryValidity": 100,
            "attributeCompleteness": 95,
            "crsValidity": 100,
            "duplicateRate": 0,
            "overallQualityScore": 99.2,
            "weights": {"geometry": 0.3, "attributes": 0.25, "completeness": 0.2, "crs": 0.15, "duplicates": 0.1},
        },
        is_synthetic_demo=True,
        created_at=now,
        updated_at=now,
    )

    src_planning = DataSource(
        id="PLANNING-DDA-2041",
        name="DDA Master Plan 2041",
        type="Planning Authority",
        format="GeoJSON",
        description="Delhi Development Authority Master Plan 2041 zoning layers. [SYNTHETIC DEMO DATA]",
        organization="Delhi Development Authority (DDA)",
        contact_email="masterplan@dda.gov.in",
        crs="EPSG:4326",
        authority_level="Metropolitan",
        reliability_score=88.0,
        status="READY",
        entity_count=92000,
        asset_count=4,
        spatial_metadata={
            "crs": "EPSG:4326",
            "crsName": "WGS 84",
            "targetCrs": "EPSG:4326",
            "transformationName": "Identity",
            "geometryType": "Polygon",
            "bbox": [76.8, 28.4, 77.4, 28.9],
            "coveragePercentage": 100.0,
            "spatialExtentDescription": "Delhi NCT Master Plan Zoning",
            "accuracyMeters": 2.0,
        },
        temporal_metadata={
            "observationDate": "2021-06-01",
            "lastUpdated": "2024-03-15T00:00:00Z",
            "dataVintage": "Master Plan 2041",
            "updateFrequency": "Decennial",
        },
        quality_metadata={
            "completeness": 87,
            "geometryValidity": 92,
            "attributeCompleteness": 84,
            "crsValidity": 100,
            "duplicateRate": 3,
            "overallQualityScore": 88.5,
            "weights": {"geometry": 0.3, "attributes": 0.25, "completeness": 0.2, "crs": 0.15, "duplicates": 0.1},
        },
        is_synthetic_demo=True,
        created_at=now,
        updated_at=now,
    )

    session.add_all([src_muni, src_registry, src_survey, src_planning])
    session.flush()
    logger.info("  ✓ 4 data sources seeded")

    # ── 2. Source Assets ──────────────────────────────────────────────────────
    assets = [
        SourceAsset(id="AST-MUNI-01", source_id="MUNI-GIS-WARD18", name="municipal_parcels.geojson",
                    file_type="parcels", format="GeoJSON", size_mb=14.8, record_count=18240,
                    crs="EPSG:4326", geometry_type="Polygon", status="READY",
                    is_synthetic_demo=True, created_at=now, updated_at=now),
        SourceAsset(id="AST-MUNI-02", source_id="MUNI-GIS-WARD18", name="municipal_buildings.geojson",
                    file_type="buildings", format="GeoJSON", size_mb=32.4, record_count=24100,
                    crs="EPSG:4326", geometry_type="Polygon", status="READY",
                    is_synthetic_demo=True, created_at=now, updated_at=now),
        SourceAsset(id="AST-REG-01", source_id="REGISTRY-PROP-014", name="registry_parcels.geojson",
                    file_type="parcels", format="GeoJSON", size_mb=18.4, record_count=14500,
                    crs="EPSG:4326", geometry_type="Polygon", status="READY",
                    is_synthetic_demo=True, created_at=now, updated_at=now),
        SourceAsset(id="AST-SURV-01", source_id="SURVEY-2025-SP2291", name="gnss_survey_sp2291.geojson",
                    file_type="survey", format="GeoJSON", size_mb=2.1, record_count=450,
                    crs="EPSG:4326", geometry_type="Polygon", status="READY",
                    is_synthetic_demo=True, created_at=now, updated_at=now),
    ]
    session.add_all(assets)
    session.flush()
    logger.info("  ✓ 4 source assets seeded")

    # ── 3. Canonical Entities ─────────────────────────────────────────────────
    entity_014 = CanonicalEntity(
        id="CANONICAL-014",
        canonical_entity_id="CANONICAL-014",
        parcel_id="PARCEL-DEMO-014",
        land_use="Residential - Mixed",
        property_status="Active",
        owner_category="Private Individual",
        area=2465.0,
        perimeter=200.5,
        building_count=1,
        centroid=[77.2024, 28.6012],
        bbox=[77.2018, 28.6006, 77.2031, 28.6019],
        geometry=WKTElement(PARCEL_014_WKT, srid=DEMO_SRID),
        observation_date="2024-04-12",
        quality_score=94.2,
        observation_ids=["OBS-MUN-014", "OBS-REG-014", "OBS-SUR-014"],
        is_synthetic_demo=True,
        created_at=now,
        updated_at=now,
    )

    entity_018 = CanonicalEntity(
        id="CANONICAL-018",
        canonical_entity_id="CANONICAL-018",
        parcel_id="PARCEL-DEMO-018",
        land_use="Commercial",
        property_status="Active",
        owner_category="Commercial Entity",
        area=1840.0,
        perimeter=175.2,
        building_count=2,
        centroid=[77.2035, 28.6025],
        bbox=[77.2028, 28.6018, 77.2042, 28.6032],
        geometry=WKTElement(PARCEL_018_WKT, srid=DEMO_SRID),
        observation_date="2026-09-18",
        quality_score=88.0,
        observation_ids=["OBS-MUN-018"],
        is_synthetic_demo=True,
        created_at=now,
        updated_at=now,
    )

    session.add_all([entity_014, entity_018])
    session.flush()
    logger.info("  ✓ 2 canonical entities seeded (with PostGIS geometry)")

    # ── 4. Entity Observations ────────────────────────────────────────────────
    observations = [
        EntityObservation(
            id="OBS-MUN-014",
            source_id="MUNI-GIS-WARD18",
            source_asset_id="AST-MUNI-01",
            entity_id="CANONICAL-014",
            source_record_id="PARCEL-014",
            source_name="Municipal GIS",
            observation_date="2024-04-12",
            geometry=WKTElement(PARCEL_014_WKT, srid=DEMO_SRID),
            geometry_type="Polygon",
            area_sqm=2430.0,
            bbox=[77.2018, 28.6006, 77.2031, 28.6019],
            attributes={"land_use": "Residential", "tax_status": "Paid", "ward": "Ward 18"},
            confidence=94.0,
            status="MATCHED",
            location_label="Sector 9 Commercial Block A",
            candidate_canonical_id="CANONICAL-014",
            is_synthetic_demo=True,
            created_at=now,
        ),
        EntityObservation(
            id="OBS-REG-014",
            source_id="REGISTRY-PROP-014",
            source_asset_id="AST-REG-01",
            entity_id="CANONICAL-014",
            source_record_id="REG-98102",
            source_name="Property Registry",
            observation_date="2025-11-04",
            geometry=WKTElement(PARCEL_014_WKT, srid=DEMO_SRID),
            geometry_type="Polygon",
            area_sqm=2510.0,
            bbox=[77.2017, 28.6005, 77.2032, 28.6020],
            attributes={"deed_no": "REG-98102", "owner_category": "Private Individual", "deed_area": 2510},
            confidence=92.0,
            status="PROBABLE MATCH",
            location_label="Sub-Registrar IX Title Deed Boundary",
            candidate_canonical_id="CANONICAL-014",
            is_synthetic_demo=True,
            created_at=now,
        ),
        EntityObservation(
            id="OBS-SUR-014",
            source_id="SURVEY-2025-SP2291",
            source_asset_id="AST-SURV-01",
            entity_id="CANONICAL-014",
            source_record_id="SP2291-P014",
            source_name="GNSS Survey",
            observation_date="2025-11-12",
            geometry=WKTElement(PARCEL_014_WKT, srid=DEMO_SRID),
            geometry_type="Polygon",
            area_sqm=2465.0,
            bbox=[77.2018, 28.6006, 77.2031, 28.6019],
            attributes={"accuracy": "0.02m", "measured_area": 2465.0, "control_point": "SP-2291"},
            confidence=98.4,
            status="MATCHED",
            location_label="GNSS Ground Truth Boundary",
            candidate_canonical_id="CANONICAL-014",
            is_synthetic_demo=True,
            created_at=now,
        ),
        EntityObservation(
            id="OBS-MUN-018",
            source_id="MUNI-GIS-WARD18",
            source_asset_id="AST-MUNI-01",
            entity_id="CANONICAL-018",
            source_record_id="PARCEL-018",
            source_name="Municipal GIS",
            observation_date="2026-09-18",
            geometry=WKTElement(PARCEL_018_WKT, srid=DEMO_SRID),
            geometry_type="Polygon",
            area_sqm=1840.0,
            bbox=[77.2028, 28.6018, 77.2042, 28.6032],
            attributes={"land_use": "Commercial C-2", "ward": "Ward 18"},
            confidence=88.0,
            status="MATCHED",
            location_label="Sector 9 Commercial C-2 Zone",
            candidate_canonical_id="CANONICAL-018",
            is_synthetic_demo=True,
            created_at=now,
        ),
    ]
    session.add_all(observations)
    session.flush()
    logger.info("  ✓ 4 entity observations seeded (with PostGIS geometry)")

    # ── 5. Conflicts ──────────────────────────────────────────────────────────
    from datetime import datetime as dt
    conflicts = [
        ConflictCase(
            id="CF-1042",
            entity_id="CANONICAL-014",
            parcel_id="PARCEL-DEMO-014",
            conflict_type="Boundary Discrepancy & Area Discrepancy",
            severity="HIGH",
            status="OPEN",
            title="Area Boundary Discrepancy — PARCEL-DEMO-014",
            description="Municipal GIS records area as 2,430 m² while Title Deed records 2,510 m² (80 m² boundary offset). [SYNTHETIC DEMO DATA]",
            priority_score=87.0,
            area_discrepancy_sqm=80.0,
            sources_involved=["Municipal GIS", "Property Registry", "Survey Dataset"],
            evidence_ids=["EVID-GEOM-014", "EVID-DEED-98102"],
            suggested_resolution="Adopt high-precision GNSS Field Survey SP-2291 boundary vector (2,465 m²).",
            detected_at=dt(2026, 9, 20, 10, 30, 0, tzinfo=timezone.utc),
            is_synthetic_demo=True,
            created_at=now,
            updated_at=now,
        ),
        ConflictCase(
            id="CF-1043",
            entity_id="CANONICAL-018",
            parcel_id="PARCEL-DEMO-018",
            conflict_type="Zoning & Land Use Conflict",
            severity="MEDIUM",
            status="REVIEW",
            title="Zoning Classification Conflict — PARCEL-DEMO-018",
            description="Municipal zoning classified as Commercial C-2 while Revenue Record lists Residential R-1. [SYNTHETIC DEMO DATA]",
            priority_score=62.0,
            area_discrepancy_sqm=0.0,
            sources_involved=["Municipal GIS", "Planning Dataset"],
            evidence_ids=["EVID-PLAN-ZONE41"],
            suggested_resolution="Confirm Master Plan 2041 commercial gazette notification.",
            detected_at=dt(2026, 9, 18, 14, 15, 0, tzinfo=timezone.utc),
            is_synthetic_demo=True,
            created_at=now,
            updated_at=now,
        ),
    ]
    session.add_all(conflicts)
    session.flush()
    logger.info("  ✓ 2 conflict cases seeded")

    # ── 6. Evidence ───────────────────────────────────────────────────────────
    evidence_items = [
        Evidence(
            id="EVID-GEOM-014",
            entity_id="CANONICAL-014",
            conflict_id="CF-1042",
            source_id="MUNI-GIS-WARD18",
            observation_id="OBS-MUN-014",
            evidence_type="Geometry Observation",
            title="Ward 18 Municipal Cadastral Polygon Vector",
            source_name="Municipal GIS",
            confidence=94.0,
            reliability=92.0,
            timestamp=dt(2024, 4, 12, tzinfo=timezone.utc),
            evidence_metadata={"area_sqm": 2430.0, "crs": "EPSG:4326"},
            is_synthetic_demo=True,
            created_at=now,
        ),
        Evidence(
            id="EVID-DEED-98102",
            entity_id="CANONICAL-014",
            conflict_id="CF-1042",
            source_id="REGISTRY-PROP-014",
            observation_id="OBS-REG-014",
            evidence_type="Conveyance Deed Record",
            title="Registered Sub-Registrar Title Deed Index #98102",
            source_name="Property Registry",
            confidence=92.0,
            reliability=95.0,
            timestamp=dt(2025, 11, 4, tzinfo=timezone.utc),
            evidence_metadata={"deed_area_sqm": 2510.0, "owner": "Devi Sharan & Sons"},
            is_synthetic_demo=True,
            created_at=now,
        ),
        Evidence(
            id="EVID-SURV-SP2291",
            entity_id="CANONICAL-014",
            source_id="SURVEY-2025-SP2291",
            observation_id="OBS-SUR-014",
            evidence_type="Field GNSS Control Survey",
            title="Field Differential GNSS Survey Control SP-2291",
            source_name="Survey Dataset",
            confidence=98.4,
            reliability=99.0,
            timestamp=dt(2025, 11, 12, tzinfo=timezone.utc),
            evidence_metadata={"accuracy": "0.02m", "measured_area": 2465.0},
            is_synthetic_demo=True,
            created_at=now,
        ),
        Evidence(
            id="EVID-PLAN-ZONE41",
            entity_id="CANONICAL-018",
            conflict_id="CF-1043",
            source_id="PLANNING-DDA-2041",
            evidence_type="Gazette Notification",
            title="DDA Master Plan 2041 — Commercial C-2 Gazette Schedule",
            source_name="Planning Dataset",
            confidence=88.0,
            reliability=88.0,
            timestamp=dt(2021, 6, 1, tzinfo=timezone.utc),
            evidence_metadata={"zone": "C-2 Commercial", "gazette_ref": "MP2041-C2-41"},
            is_synthetic_demo=True,
            created_at=now,
        ),
    ]
    session.add_all(evidence_items)
    session.flush()
    logger.info("  ✓ 4 evidence items seeded")

    # ── 7. Recommendations ────────────────────────────────────────────────────
    recommendations = [
        Recommendation(
            id="REC-014",
            entity_id="CANONICAL-014",
            parcel_id="PARCEL-DEMO-014",
            conflict_id="CF-1042",
            candidate_representation={
                "boundary_source": "SURVEY-2025-SP2291",
                "land_use": "Residential - Mixed",
                "area_sqm": 2465.0,
                "owner": "Devi Sharan & Sons",
            },
            confidence=98.4,
            status="PENDING_VERIFICATION",
            supporting_evidence_ids=["EVID-SURV-SP2291", "EVID-GEOM-014", "EVID-DEED-98102"],
            unresolved_items=["Tax arrear reconciliation (2023-24)"],
            reasoning="Adopt GNSS Survey SP-2291 boundary vector (2,465 m²) as primary spatial geometry due to sub-centimeter accuracy (±0.02m). Retain legal deed owner Devi Sharan & Sons from Sub-Registrar IX index. [SYNTHETIC DEMO DATA]",
            proposed_boundary_source="SURVEY-2025-SP2291",
            proposed_land_use="Residential - Mixed",
            is_synthetic_demo=True,
            created_at=now,
            updated_at=now,
        ),
        Recommendation(
            id="REC-018",
            entity_id="CANONICAL-018",
            parcel_id="PARCEL-DEMO-018",
            conflict_id="CF-1043",
            candidate_representation={
                "boundary_source": "MUNI-GIS-WARD18",
                "land_use": "Commercial C-2",
                "area_sqm": 1840.0,
            },
            confidence=88.0,
            status="PENDING_VERIFICATION",
            supporting_evidence_ids=["EVID-PLAN-ZONE41"],
            unresolved_items=["Front setback verification against Master Plan 2041"],
            reasoning="Commercial C-2 zoning gazette notification confirmed by DDA Master Plan 2041 schedule. [SYNTHETIC DEMO DATA]",
            proposed_boundary_source="MUNI-GIS-WARD18",
            proposed_land_use="Commercial C-2",
            is_synthetic_demo=True,
            created_at=now,
            updated_at=now,
        ),
    ]
    session.add_all(recommendations)
    session.flush()
    logger.info("  ✓ 2 recommendations seeded")

    # ── 8. Verification Records ───────────────────────────────────────────────
    verifications = [
        VerificationRecord(
            id="VER-101",
            entity_id="CANONICAL-014",
            parcel_id="PARCEL-DEMO-014",
            recommendation_id="REC-014",
            reviewer_id="USR-OFFICER-01",
            reviewer_name="Rajesh Kumar",
            reviewer_role="Senior Revenue Officer",
            decision="CONFIRMED",
            reason="Verified GNSS ground survey boundary against Sub-Registrar deed index #98102. Concurred with 2,465 m² harmonized area. [SYNTHETIC DEMO DATA]",
            status="APPROVED",
            is_synthetic_demo=True,
            created_at=dt(2026, 9, 25, 14, 30, 0, tzinfo=timezone.utc),
            updated_at=now,
        ),
    ]
    session.add_all(verifications)
    session.flush()
    logger.info("  ✓ 1 verification record seeded")

    # ── 9. Audit Events ───────────────────────────────────────────────────────
    audit_events = [
        AuditEvent(
            id="AUD-001",
            timestamp=dt(2026, 9, 25, 14, 30, 0, tzinfo=timezone.utc),
            actor_id="USR-OFFICER-01",
            actor_name="Rajesh Kumar",
            actor_role="Senior Revenue Officer",
            action="RECOMMENDATION_APPROVED",
            module="Verification",
            entity_id="CANONICAL-014",
            parcel_id="PARCEL-DEMO-014",
            recommendation_id="REC-014",
            verification_id="VER-101",
            reason="Officer verified GNSS ground survey boundary vector (2,465 m²) for parcel PARCEL-DEMO-014. [SYNTHETIC DEMO DATA]",
            audit_metadata={"reviewer": "Rajesh Kumar", "confidence": 98.4},
            is_synthetic_demo=True,
        ),
        AuditEvent(
            id="AUD-002",
            timestamp=dt(2026, 9, 24, 16, 20, 0, tzinfo=timezone.utc),
            actor_id="USR-OFFICER-01",
            actor_name="Rajesh Kumar",
            actor_role="Senior Revenue Officer",
            action="SOURCE_IMPORTED",
            module="Sources",
            source_id="MUNI-GIS-WARD18",
            reason="Ingested municipal cadastral vector dataset municipal_parcels.geojson. [SYNTHETIC DEMO DATA]",
            audit_metadata={"crs": "EPSG:4326", "featureCount": 18240},
            is_synthetic_demo=True,
        ),
        AuditEvent(
            id="AUD-003",
            timestamp=dt(2026, 9, 20, 10, 30, 0, tzinfo=timezone.utc),
            actor_id="SYS-CONFLICT-ENGINE",
            actor_name="BHOO-MITRA Conflict Engine",
            actor_role="System",
            action="CONFLICT_DETECTED",
            module="Conflicts",
            entity_id="CANONICAL-014",
            parcel_id="PARCEL-DEMO-014",
            conflict_id="CF-1042",
            reason="Automated boundary discrepancy detected: 80 m² area mismatch between Municipal GIS and Title Deed. [SYNTHETIC DEMO DATA]",
            audit_metadata={"severity": "HIGH", "area_discrepancy_sqm": 80.0},
            is_synthetic_demo=True,
        ),
    ]
    session.add_all(audit_events)
    session.flush()
    logger.info("  ✓ 3 audit events seeded")

    # ── 10. Quality Signals ───────────────────────────────────────────────────
    quality_signals = [
        QualitySignal(id="QS-001", entity_id="CANONICAL-014", source_id="MUNI-GIS-WARD18",
                      signal_type="Geometry Quality", value=97.0, severity="INFO",
                      description="Polygon topology valid; no self-intersections. [SYNTHETIC DEMO DATA]",
                      is_synthetic_demo=True, created_at=now),
        QualitySignal(id="QS-002", entity_id="CANONICAL-014", source_id="MUNI-GIS-WARD18",
                      signal_type="Attribute Completeness", value=91.0, severity="LOW",
                      description="Tax status field contains 6% null attributes. [SYNTHETIC DEMO DATA]",
                      is_synthetic_demo=True, created_at=now),
        QualitySignal(id="QS-003", entity_id="CANONICAL-014", source_id="REGISTRY-PROP-014",
                      signal_type="CRS Validity", value=100.0, severity="INFO",
                      description="CRS EPSG:4326 declared and validated. [SYNTHETIC DEMO DATA]",
                      is_synthetic_demo=True, created_at=now),
        QualitySignal(id="QS-004", entity_id="CANONICAL-014", source_id="SURVEY-2025-SP2291",
                      signal_type="Temporal Freshness", value=98.0, severity="INFO",
                      description="GNSS survey completed November 2025 — highly current. [SYNTHETIC DEMO DATA]",
                      is_synthetic_demo=True, created_at=now),
        QualitySignal(id="QS-005", entity_id="CANONICAL-018", source_id="PLANNING-DDA-2041",
                      signal_type="Source Reliability", value=88.0, severity="LOW",
                      description="Planning dataset accuracy is 2m — lower than cadastral surveys. [SYNTHETIC DEMO DATA]",
                      is_synthetic_demo=True, created_at=now),
        QualitySignal(id="QS-006", entity_id="CANONICAL-018", source_id="MUNI-GIS-WARD18",
                      signal_type="Topology Quality", value=94.0, severity="INFO",
                      description="No overlap or gap detected with adjacent parcels. [SYNTHETIC DEMO DATA]",
                      is_synthetic_demo=True, created_at=now),
    ]
    session.add_all(quality_signals)
    session.flush()
    logger.info("  ✓ 6 quality signals seeded")

    session.commit()
    logger.info("✓ Synthetic demo data seed complete.")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s — %(message)s")

    # Add backend/ to sys.path
    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

    from app.db.database import get_session_factory, is_database_available

    if not is_database_available():
        logger.error(
            "PostgreSQL is not available. Start the database with:\n"
            "  docker-compose up -d\n"
            "Then retry: python -m app.db.seed"
        )
        sys.exit(1)

    factory = get_session_factory()
    with factory() as session:
        seed(session)
