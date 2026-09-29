from fastapi import APIRouter
from app.api.routes import (
    sources,
    ingestion,
    entities,
    conflicts,
    evidence,
    recommendations,
    verification,
    audit,
    geospatial,
    auth,
    reports,
    spatial_query,
)

api_router = APIRouter(prefix="/api")

api_router.include_router(auth.router)
api_router.include_router(sources.router)
api_router.include_router(ingestion.router)
api_router.include_router(entities.router)
api_router.include_router(conflicts.router)
api_router.include_router(evidence.router)
api_router.include_router(recommendations.router)
api_router.include_router(verification.router)
api_router.include_router(audit.router)
api_router.include_router(geospatial.router)
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(spatial_query.router, prefix="/spatial-query", tags=["Spatial Query"])


