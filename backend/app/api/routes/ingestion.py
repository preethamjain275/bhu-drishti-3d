from fastapi import APIRouter, Depends
from app.api.dependencies import get_ingestion_service
from app.services.ingestion_service import IngestionService
from app.schemas.ingestion import IngestionJobSchema, StartIngestionRequest
from app.schemas.response import StandardResponse, ListResponse
from app.core.errors import ResourceNotFoundException

router = APIRouter(prefix="/ingestion", tags=["Ingestion"])

@router.get("/jobs", response_model=ListResponse[IngestionJobSchema])
def get_ingestion_jobs(
    service: IngestionService = Depends(get_ingestion_service),
):
    jobs = service.get_jobs()
    return ListResponse(
        success=True,
        data=jobs,
        total=len(jobs),
        message="Ingestion jobs retrieved successfully",
    )

@router.get("/jobs/{job_id}", response_model=StandardResponse[IngestionJobSchema])
def get_job_by_id(
    job_id: str,
    service: IngestionService = Depends(get_ingestion_service),
):
    job = service.get_job_by_id(job_id)
    if not job:
        raise ResourceNotFoundException(f"Ingestion job '{job_id}' not found")
    return StandardResponse(success=True, data=job, message="Ingestion job retrieved")

@router.post("/jobs", response_model=StandardResponse[IngestionJobSchema])
def start_ingestion(
    req: StartIngestionRequest,
    service: IngestionService = Depends(get_ingestion_service),
):
    job = service.start_ingestion_job(req)
    return StandardResponse(
        success=True,
        data=job,
        message="Ingestion pipeline started successfully",
    )
