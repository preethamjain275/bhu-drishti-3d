from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.spatial_query import SpatialQueryRequest, SpatialQueryResponse
from app.services.spatial_query_service import SpatialQueryService
from app.api.routes.auth import get_current_user

router = APIRouter()

@router.post("/execute", response_model=SpatialQueryResponse)
def execute_spatial_query(req: SpatialQueryRequest, current_user=Depends(get_current_user)):
    if not req.query or not req.query.strip():
        raise HTTPException(status_code=400, detail="Query string cannot be empty.")
    return SpatialQueryService.parse_and_execute(req)

@router.get("/suggestions")
def get_spatial_suggestions(current_user=Depends(get_current_user)):
    return [
        "Show parcels with geometry conflicts.",
        "Which buildings are inside PARCEL-DEMO-014?",
        "Compare Municipal GIS and Survey Dataset for PARCEL-DEMO-014.",
        "Which parcels have low-confidence entity matches?",
        "How many parcels are pending verification?",
        "Show high-severity conflicts.",
    ]
