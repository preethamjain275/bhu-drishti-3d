import re
from typing import List, Dict, Any
from app.schemas.spatial_query import (
    SpatialQueryRequest,
    SpatialQueryResponse,
    ParsedQueryPlan,
    QueryResultSection,
)

class SpatialQueryService:
    @staticmethod
    def parse_and_execute(req: SpatialQueryRequest) -> SpatialQueryResponse:
        q = req.query.strip().lower()

        # Extract Entity Identifiers
        parcel_match = re.search(r"parcel-demo-\d{3}", q)
        building_match = re.search(r"bldg-\d{3}-[a-z]", q)
        conflict_match = re.search(r"cnf-3d-\d{3}|conflict-\d{4}", q)

        entity_id = (
            parcel_match.group(0).upper() if parcel_match
            else building_match.group(0).upper() if building_match
            else conflict_match.group(0).upper() if conflict_match
            else req.active_entity_id or "PARCEL-DEMO-014"
        )

        # Detect Intent
        if "compare" in q or "source" in q:
            intent = "SOURCE_COMPARISON"
        elif "building" in q or "taller" in q:
            intent = "BUILDING_LOOKUP"
        elif "conflict" in q or "geometry" in q or "overlap" in q:
            intent = "CONFLICT_LOOKUP"
        elif "evidence" in q or "proof" in q:
            intent = "EVIDENCE_LOOKUP"
        elif "verification" in q or "pending" in q:
            intent = "VERIFICATION_LOOKUP"
        elif "matching" in q or "unresolved" in q:
            intent = "MATCH_LOOKUP"
        else:
            intent = "PARCEL_LOOKUP"

        plan = ParsedQueryPlan(
            intent=intent,
            target_entity_id=entity_id,
            extracted_entities=[entity_id],
            filters={"entityId": entity_id},
            spatial_relationship="CONTAINS" if "inside" in q or "building" in q else "INTERSECTS",
        )

        # Build Deterministic Data & Calculations based on Intent
        if intent == "SOURCE_COMPARISON":
            data_records = [
                {"sourceName": "Municipal Cadastral GIS 2024", "areaSqM": 2450.0, "confidence": 0.96},
                {"sourceName": "Survey of India Drones 2023", "areaSqM": 2576.0, "confidence": 0.98},
            ]
            calculations = {
                "areaDifferenceSqM": 126.0,
                "centroidShiftMeters": 3.8,
                "iouScore": 0.87,
                "overlapRatioPercent": 91.4,
            }
            explanation = (
                f"Source comparison for {entity_id}: Municipal GIS reports an area of 2,450.0 m² (96% confidence), "
                f"whereas Survey of India Drones reports 2,576.0 m² (98% confidence). "
                f"Spatial calculations confirm a 126.0 m² area discrepancy and a 3.8m centroid displacement with an IoU score of 0.87."
            )
            evidence_refs = ["EVD-001", "EVD-002", "EVD-003"]
            follow_ups = [
                f"Show supporting evidence for {entity_id}",
                f"Open 3D Conflict Investigation for {entity_id}",
                f"Generate Parcel Intelligence Report for {entity_id}",
            ]

        elif intent == "BUILDING_LOOKUP":
            data_records = [
                {"buildingId": "BLDG-014-A", "heightM": 24.0, "floorCount": 8, "usage": "Commercial"},
                {"buildingId": "BLDG-014-B", "heightM": 12.0, "floorCount": 4, "usage": "Commercial"},
            ]
            calculations = {
                "totalBuildingsCount": 2,
                "totalBuiltUpAreaSqM": 730.0,
                "coverageRatioPercent": 29.8,
            }
            explanation = (
                f"Parcel {entity_id} contains 2 associated extruded building structures in the current synthetic dataset. "
                f"BLDG-014-A is 24m tall (8 floors, Commercial), and BLDG-014-B is 12m tall (4 floors, Commercial). "
                f"Total built-up footprint is 730 m², representing a 29.8% coverage ratio."
            )
            evidence_refs = ["EVD-001", "EVD-004"]
            follow_ups = [
                f"Focus BLDG-014-A in 3D Scene",
                f"Compare building heights for {entity_id}",
                f"Show verification status for {entity_id}",
            ]

        elif intent == "CONFLICT_LOOKUP":
            data_records = [
                {"conflictId": "CNF-3D-001", "type": "GEOMETRY", "severity": "HIGH", "status": "OPEN"},
                {"conflictId": "CNF-3D-004", "type": "TOPOLOGY", "severity": "HIGH", "status": "NEEDS_EVIDENCE"},
            ]
            calculations = {
                "totalActiveConflicts": 2,
                "criticalOrHighCount": 2,
                "primaryConflictType": "GEOMETRY",
            }
            explanation = (
                f"Parcel {entity_id} has 2 active spatial conflicts in the dataset: "
                f"CNF-3D-001 (Geometry Boundary Discrepancy, High Severity, Open) and CNF-3D-004 (Adjoining Parcel Boundary Overlap, High Severity, Needs Evidence)."
            )
            evidence_refs = ["EVD-001", "EVD-002", "EVD-005"]
            follow_ups = [
                f"Open CNF-3D-001 in 3D Conflict Investigator",
                f"Show evidence for CNF-3D-001",
                f"Generate Conflict Report for CNF-3D-001",
            ]

        else:
            data_records = [
                {"entityId": entity_id, "landUse": "Commercial", "propertyStatus": "Under Review", "confidence": 0.94},
            ]
            calculations = {
                "parcelAreaSqM": 2450.0,
                "perimeterMeters": 198.0,
                "buildingCount": 2,
            }
            explanation = (
                f"Retrieved synthetic intelligence record for {entity_id}: "
                f"Land Use: Commercial, Property Status: Under Review, Confidence: 94%. "
                f"Parcel area is 2,450 m² with 2 associated building observations."
            )
            evidence_refs = ["EVD-001", "EVD-002"]
            follow_ups = [
                f"Which buildings are inside {entity_id}?",
                f"Compare source observations for {entity_id}?",
                f"Generate report for {entity_id}?",
            ]

        result = QueryResultSection(
            data_records=data_records,
            calculations=calculations,
            explanation=explanation,
            evidence_references=evidence_refs,
        )

        return SpatialQueryResponse(
            query=req.query,
            intent=intent,
            plan=plan,
            result=result,
            suggested_follow_ups=follow_ups,
            status="SUCCESS",
        )
