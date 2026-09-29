from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.errors import APIException, api_exception_handler, generic_exception_handler
from app.api.router import api_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    description="BHOO-MITRA AI — Urban Land Intelligence & Geospatial Harmonization REST API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
app.add_exception_handler(APIException, api_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)


# ─── Health & Status Endpoints ────────────────────────────────────────────────

@app.get("/api/health", tags=["Health"])
def health_check():
    """
    Lightweight liveness check.

    Reports API connectivity + database + PostGIS status so the frontend
    can distinguish three states:
      - API only (DEMO MODE)
      - API + Database (DATABASE MODE without PostGIS)
      - API + Database + PostGIS (FULL MODE)
    """
    from app.db.database import is_database_available, is_postgis_enabled

    db_available = is_database_available()
    postgis_ok = is_postgis_enabled() if db_available else False
    repo_mode = settings.REPOSITORY_MODE if db_available else "mock"

    return {
        "status": "healthy",
        "api": "healthy",
        "service": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "version": settings.API_VERSION,
        "database": "connected" if db_available else "unavailable",
        "postgis": "enabled" if postgis_ok else ("disabled" if db_available else "unavailable"),
        "repository": repo_mode,
    }


@app.get("/api/status", tags=["Health"])
def system_status():
    """
    Detailed system-status report including database layer information.
    """
    from app.db.database import is_database_available, is_postgis_enabled

    db_available = is_database_available()
    postgis_ok = is_postgis_enabled() if db_available else False
    repo_mode = settings.REPOSITORY_MODE if db_available else "mock"

    return {
        "status": "operational",
        "api": "healthy",
        "service": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "version": settings.API_VERSION,
        "database": "connected" if db_available else "unavailable",
        "postgis": "enabled" if postgis_ok else ("disabled" if db_available else "unavailable"),
        "repository": repo_mode,
        "capabilities": [
            "multi_source_ingestion",
            "crs_harmonization_preview",
            "schema_mapping",
            "spatial_entity_matching",
            "conflict_detection",
            "audit_provenance_trail",
            "gdal_proj_geopandas_engine",
            "postgis_spatial_store" if db_available else "synthetic_mock_repository",
        ],
    }


# Include API Routes
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
