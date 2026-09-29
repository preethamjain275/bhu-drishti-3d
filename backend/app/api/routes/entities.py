from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.api.dependencies import get_entity_service
from app.services.entity_service import EntityService
from app.schemas.entity import CanonicalEntitySchema, EntityObservationSchema
from app.schemas.response import StandardResponse, ListResponse
from app.core.errors import ResourceNotFoundException

router = APIRouter(prefix="/entities", tags=["Entities"])

@router.get("", response_model=ListResponse[CanonicalEntitySchema])
def get_entities(
    query: Optional[str] = Query(None, description="Search query"),
    service: EntityService = Depends(get_entity_service),
):
    entities = service.get_entities(query=query)
    return ListResponse(
        success=True,
        data=entities,
        total=len(entities),
        message="Canonical entities retrieved successfully",
    )

@router.get("/observations", response_model=ListResponse[EntityObservationSchema])
def get_observations(
    service: EntityService = Depends(get_entity_service),
):
    obs = service.get_observations()
    return ListResponse(success=True, data=obs, total=len(obs), message="Entity observations retrieved")

@router.get("/{entity_id}", response_model=StandardResponse[CanonicalEntitySchema])
def get_entity_by_id(
    entity_id: str,
    service: EntityService = Depends(get_entity_service),
):
    entity = service.get_entity_by_id(entity_id)
    if not entity:
        raise ResourceNotFoundException(f"Canonical entity '{entity_id}' not found")
    return StandardResponse(success=True, data=entity, message="Canonical entity retrieved")
