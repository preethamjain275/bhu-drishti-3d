from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ReportSectionConfig(BaseModel):
    executive_summary: bool = True
    parcel_info: bool = True
    source_comparison: bool = True
    geometry_metrics: bool = True
    buildings: bool = True
    conflicts: bool = True
    evidence: bool = True
    recommendation: bool = True
    verification: bool = True
    audit_trail: bool = True

class ReportCreateRequest(BaseModel):
    report_type: str = Field(..., description="PARCEL_INTELLIGENCE | CONFLICT_INVESTIGATION | HARMONIZATION | VERIFICATION_SUMMARY | DATA_QUALITY | EXECUTIVE_ANALYTICS")
    target_id: str = Field(..., description="Parcel ID, Conflict ID, or Target Entity ID")
    title: Optional[str] = None
    sections: Optional[ReportSectionConfig] = None
    notes: Optional[str] = None

class ReportTemplateResponse(BaseModel):
    type_id: str
    name: str
    description: str
    default_sections: List[str]

class ReportProvenance(BaseModel):
    snapshot_timestamp: str
    source_ids: List[str]
    entity_id: str
    conflict_ids: List[str]
    evidence_ids: List[str]
    audit_events_count: int

class GeneratedReportResponse(BaseModel):
    report_id: str
    report_type: str
    target_id: str
    title: str
    status: str
    created_at: str
    created_by: str
    provenance: ReportProvenance
    summary_text: str
    data: Dict[str, Any]
