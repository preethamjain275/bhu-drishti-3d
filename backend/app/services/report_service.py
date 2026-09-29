import datetime
from typing import List, Dict, Any
from app.schemas.reports import (
    ReportCreateRequest,
    GeneratedReportResponse,
    ReportProvenance,
    ReportTemplateResponse,
)

class ReportService:
    @staticmethod
    def get_templates() -> List[ReportTemplateResponse]:
        return [
            ReportTemplateResponse(
                type_id="PARCEL_INTELLIGENCE",
                name="Parcel Intelligence Report",
                description="Comprehensive spatial, building, source, conflict, and evidence dossier for a single land parcel.",
                default_sections=["Executive Summary", "Parcel Info", "Source Comparison", "Geometry Metrics", "Buildings", "Conflicts", "Evidence", "AI Recommendation", "Human Verification", "Audit Trail"],
            ),
            ReportTemplateResponse(
                type_id="CONFLICT_INVESTIGATION",
                name="3D Conflict Investigation Report",
                description="Detailed spatial difference, attribute discrepancy, temporal analysis, and evidence audit for a conflict case.",
                default_sections=["Executive Summary", "Conflict Details", "Source Comparison", "Geometry Difference", "Evidence Chain", "Recommendation", "Verification Status"],
            ),
            ReportTemplateResponse(
                type_id="HARMONIZATION",
                name="Harmonization Pipeline Report",
                description="Complete provenance report tracking data ingestion, CRS standardization, schema mapping, and entity matching.",
                default_sections=["Executive Summary", "Input Sources", "CRS & Schema Readiness", "Entity Matching", "Unresolved Items"],
            ),
            ReportTemplateResponse(
                type_id="VERIFICATION_SUMMARY",
                name="Human Verification Summary Report",
                description="Executive queue report summarizing pending, approved, modified, rejected, and deferred verification decisions.",
                default_sections=["Executive Summary", "Queue Status", "Reviewer Decisions", "Timestamp Audit"],
            ),
            ReportTemplateResponse(
                type_id="DATA_QUALITY",
                name="Data Quality & Reliability Report",
                description="System-wide data quality scorecards, geometry validity metrics, schema completeness, and reliability signals.",
                default_sections=["Executive Summary", "Source Reliability", "Completeness Score", "Quality Signals"],
            ),
            ReportTemplateResponse(
                type_id="EXECUTIVE_ANALYTICS",
                name="Executive Analytics Summary Report",
                description="High-level executive dashboard summary combining spatial, conflict, source, and matching statistics.",
                default_sections=["Executive KPIs", "Spatial Trends", "Conflict Distribution", "Verification Queue"],
            ),
        ]

    @staticmethod
    def create_report(req: ReportCreateRequest, user_name: str = "GIS Analyst") -> GeneratedReportResponse:
        report_id = f"RPT-2026-{datetime.datetime.now().strftime('%m%d%H%M%S')}"
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

        provenance = ReportProvenance(
            snapshot_timestamp=now_iso,
            source_ids=["SRC-BBMP-01", "SRC-REGISTRY-02", "SRC-SURVEY-03"],
            entity_id=req.target_id,
            conflict_ids=["CNF-3D-001", "CNF-3D-004"],
            evidence_ids=["EVD-001", "EVD-002", "EVD-003", "EVD-004", "EVD-005"],
            audit_events_count=14,
        )

        summary_text = (
            f"Target entity '{req.target_id}' has 3 associated building observations across 3 source representations. "
            f"2 spatial conflicts are recorded with 5 supporting evidence records. Human verification status is Pending Review."
        )

        report_data: Dict[str, Any] = {
            "parcel_id": req.target_id,
            "area_sq_m": 2450.0,
            "perimeter_m": 198.0,
            "land_use": "Commercial",
            "property_status": "Under Review",
            "buildings_count": 2,
            "coverage_ratio": 0.298,
            "sources": [
                {"name": "Municipal Cadastral GIS 2024", "confidence": 0.96, "area": 2450.0},
                {"name": "State Property Registration Dept", "confidence": 0.91, "area": 2410.0},
                {"name": "Survey of India Drones 2023", "confidence": 0.98, "area": 2458.0},
            ],
            "geometry_difference": {
                "area_diff": 126.0,
                "centroid_shift_m": 3.8,
                "iou": 0.87,
                "overlap_ratio": 0.914,
            },
            "evidence_records": [
                {"id": "EVD-001", "type": "Drone Survey", "reliability": 0.98},
                {"id": "EVD-002", "type": "Municipal Registry", "reliability": 0.94},
                {"id": "EVD-003", "type": "Centroid Signal", "reliability": 0.91},
            ],
            "recommendation": {
                "id": "REC-3D-901",
                "action": "Harmonize boundary according to Survey of India drone dataset",
                "confidence": 0.91,
            },
            "verification": {
                "status": "Pending Review",
                "assigned_role": "Senior GIS Officer",
            },
            "governance_disclaimer": "DECISION SUPPORT ONLY — AI recommendations require authorized human verification.",
        }

        return GeneratedReportResponse(
            report_id=report_id,
            report_type=req.report_type,
            target_id=req.target_id,
            title=req.title or f"{req.report_type.replace('_', ' ').title()} - {req.target_id}",
            status="READY",
            created_at=now_iso,
            created_by=user_name,
            provenance=provenance,
            summary_text=summary_text,
            data=report_data,
        )
