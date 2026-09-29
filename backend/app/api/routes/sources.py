from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.api.dependencies import get_source_service
from app.services.source_service import SourceService
from app.schemas.source import DataSourceSchema
from app.schemas.response import StandardResponse, ListResponse
from app.core.errors import ResourceNotFoundException

router = APIRouter(prefix="/sources", tags=["Sources"])

@router.get("", response_model=ListResponse[DataSourceSchema])
def get_sources(
    type: Optional[str] = Query(None, description="Source category filter"),
    query: Optional[str] = Query(None, description="Search query"),
    service: SourceService = Depends(get_source_service),
):
    sources = service.get_sources(source_type=type, query=query)
    return ListResponse(
        success=True,
        data=sources,
        total=len(sources),
        message="Sources retrieved successfully",
    )

@router.get("/{source_id}", response_model=StandardResponse[DataSourceSchema])
def get_source_by_id(
    source_id: str,
    service: SourceService = Depends(get_source_service),
):
    source = service.get_source_by_id(source_id)
    if not source:
        raise ResourceNotFoundException(f"DataSource with ID '{source_id}' was not found")
    return StandardResponse(
        success=True,
        data=source,
        message="DataSource retrieved successfully",
    )
