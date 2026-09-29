from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.api.dependencies import get_audit_service
from app.services.audit_service import AuditService
from app.schemas.audit import AuditEventSchema, CreateAuditEventRequest
from app.schemas.response import StandardResponse, ListResponse
from app.core.errors import ResourceNotFoundException

router = APIRouter(prefix="/audit", tags=["Audit"])

@router.get("", response_model=ListResponse[AuditEventSchema])
def get_audit_events(
    module: Optional[str] = Query(None, description="Filter by module"),
    entity_id: Optional[str] = Query(None, description="Filter by entity ID"),
    service: AuditService = Depends(get_audit_service),
):
    events = service.get_events(module=module, entity_id=entity_id)
    return ListResponse(success=True, data=events, total=len(events), message="Audit events retrieved")

@router.get("/{event_id}", response_model=StandardResponse[AuditEventSchema])
def get_audit_event_by_id(
    event_id: str,
    service: AuditService = Depends(get_audit_service),
):
    event = service.get_event_by_id(event_id)
    if not event:
        raise ResourceNotFoundException(f"Audit event '{event_id}' not found")
    return StandardResponse(success=True, data=event, message="Audit event retrieved")

@router.post("/events", response_model=StandardResponse[AuditEventSchema])
def create_audit_event(
    req: CreateAuditEventRequest,
    service: AuditService = Depends(get_audit_service),
):
    event = service.create_event(req)
    return StandardResponse(success=True, data=event, message="Audit event recorded successfully")
