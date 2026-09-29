"""
Ingestion Service
Service layer for file upload, format inspection, ingestion job triggering, and progress tracking.
"""

import os
from typing import Dict, Any, List, Optional
from app.geospatial.io.reader import GDALProcessor
from app.geospatial.pipeline import IngestionPipeline, ProcessingJobStatus, JOBS_STORE

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class IngestionService:
    """
    Manages vector dataset uploads, format inspections, and processing pipeline execution.
    """

    def __init__(self):
        self.upload_dir = UPLOAD_DIR

    def inspect_file(self, file_path: str) -> Dict[str, Any]:
        """Inspects uploaded vector file for metadata, format, CRS, geometry, feature count."""
        return GDALProcessor.inspect_dataset(file_path)

    def start_ingestion_job(self, file_path: str, source_id: str = "SRC-001", target_crs: str = "EPSG:4326") -> Dict[str, Any]:
        """Creates and executes an ingestion pipeline job for the given file."""
        file_name = os.path.basename(file_path)
        job = IngestionPipeline.create_job(source_id, file_name, target_crs)
        
        # Execute processing pipeline synchronously for demo/synchronous jobs
        result_job = IngestionPipeline.process_dataset(job["job_id"], file_path, target_crs)
        return result_job

    def get_job_status(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Returns details and progress for an ingestion job."""
        return IngestionPipeline.get_job(job_id)

    def get_job_by_id(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Alias for get_job_status."""
        return self.get_job_status(job_id)

    def list_recent_jobs(self) -> List[Dict[str, Any]]:
        """List all tracked ingestion jobs."""
        return list(JOBS_STORE.values())

    def get_jobs(self) -> List[Dict[str, Any]]:
        """Alias for list_recent_jobs."""
        return self.list_recent_jobs()

