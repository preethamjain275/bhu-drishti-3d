from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.api.dependencies import get_evidence_service
from app.services.evidence_service import EvidenceService
from app.schemas.evidence import EvidenceNodeSchema, EvidenceGraphSchema
from app.schemas.response import StandardResponse, ListResponse
from app.core.errors import ResourceNotFoundException

router = APIRouter(prefix="/evidence", tags=["Evidence"])

@router.get("", response_model=ListResponse[EvidenceNodeSchema])
def get_evidence_nodes(
    entity_id: Optional[str] = Query(None, description="Filter by canonical entity ID"),
    service: EvidenceService = Depends(get_evidence_service),
):
    nodes = service.get_evidence_nodes(entity_id=entity_id)
    return ListResponse(success=True, data=nodes, total=len(nodes), message="Evidence nodes retrieved")

@router.get("/graph", response_model=StandardResponse[EvidenceGraphSchema])
def get_evidence_graph(
    service: EvidenceService = Depends(get_evidence_service),
):
    graph = service.get_evidence_graph()
    return StandardResponse(success=True, data=graph, message="Evidence graph retrieved")

@router.get("/{evidence_id}", response_model=StandardResponse[EvidenceNodeSchema])
def get_evidence_by_id(
    evidence_id: str,
    service: EvidenceService = Depends(get_evidence_service),
):
    evidence = service.get_evidence_by_id(evidence_id)
    if not evidence:
        raise ResourceNotFoundException(f"Evidence node '{evidence_id}' not found")
    return StandardResponse(success=True, data=evidence, message="Evidence node retrieved")
