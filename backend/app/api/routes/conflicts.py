from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.api.dependencies import get_conflict_service
from app.services.conflict_service import ConflictService
from app.schemas.conflict import ConflictCaseSchema, ConflictDetailSchema
from app.schemas.response import StandardResponse, ListResponse
from app.core.errors import ResourceNotFoundException

router = APIRouter(prefix="/conflicts", tags=["Conflicts"])

@router.get("", response_model=ListResponse[ConflictCaseSchema])
def get_conflicts(
    status: Optional[str] = Query(None, description="Status filter"),
    severity: Optional[str] = Query(None, description="Severity filter"),
    service: ConflictService = Depends(get_conflict_service),
):
    conflicts = service.get_conflicts(status=status, severity=severity)
    return ListResponse(
        success=True,
        data=conflicts,
        total=len(conflicts),
        message="Conflicts retrieved successfully",
    )

@router.get("/{conflict_id}", response_model=StandardResponse[ConflictDetailSchema])
def get_conflict_by_id(
    conflict_id: str,
    service: ConflictService = Depends(get_conflict_service),
):
    conflict = service.get_conflict_by_id(conflict_id)
    if not conflict:
        raise ResourceNotFoundException(f"Conflict case '{conflict_id}' not found")
    return StandardResponse(success=True, data=conflict, message="Conflict detail retrieved")
