from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from app.schemas.reports import (
    ReportCreateRequest,
    GeneratedReportResponse,
    ReportTemplateResponse,
)
from app.services.report_service import ReportService
from app.api.routes.auth import get_current_user

router = APIRouter()

@router.get("/templates", response_model=List[ReportTemplateResponse])
def get_report_templates():
    return ReportService.get_templates()

@router.post("/preview", response_model=GeneratedReportResponse)
def preview_report(req: ReportCreateRequest, current_user=Depends(get_current_user)):
    user_name = getattr(current_user, "name", "GIS Analyst")
    return ReportService.create_report(req, user_name=user_name)

@router.post("", response_model=GeneratedReportResponse)
def create_report(req: ReportCreateRequest, current_user=Depends(get_current_user)):
    user_name = getattr(current_user, "name", "GIS Analyst")
    return ReportService.create_report(req, user_name=user_name)

@router.get("/{report_id}", response_model=GeneratedReportResponse)
def get_report(report_id: str, current_user=Depends(get_current_user)):
    user_name = getattr(current_user, "name", "GIS Analyst")
    req = ReportCreateRequest(report_type="PARCEL_INTELLIGENCE", target_id="PARCEL-DEMO-014")
    res = ReportService.create_report(req, user_name=user_name)
    res.report_id = report_id
    return res

@router.get("/{report_id}/export")
def export_report(report_id: str, format: str = Query("json", regex="^(pdf|json|csv)$"), current_user=Depends(get_current_user)):
    user_name = getattr(current_user, "name", "GIS Analyst")
    req = ReportCreateRequest(report_type="PARCEL_INTELLIGENCE", target_id="PARCEL-DEMO-014")
    report = ReportService.create_report(req, user_name=user_name)
    report.report_id = report_id
    return {
        "report_id": report_id,
        "format": format,
        "filename": f"bhoom_mitra_report_{report_id}.{format}",
        "export_payload": report.dict(),
    }
