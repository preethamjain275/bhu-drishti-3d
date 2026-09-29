"""
Geospatial API Router
FastAPI endpoints for dataset inspection, geometry validation, CRS transformation, pipeline processing, and spatial metrics.
Separates API routes from core processing logic.
"""

import os
import shutil
import uuid
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Dict, Any, List, Optional

from app.schemas.geospatial import (
    InspectRequest,
    ValidateRequest,
    TransformRequest,
    ProcessRequest,
    MetricsRequest,
    IoURequest,
    JobStatusResponse,
)
from app.services.ingestion_service import IngestionService, UPLOAD_DIR
from app.services.harmonization_service import HarmonizationService
from app.services.spatial_processing_service import SpatialProcessingService

router = APIRouter(prefix="/geospatial", tags=["Geospatial Engine"])

ingestion_service = IngestionService()
harmonization_service = HarmonizationService()
spatial_service = SpatialProcessingService()

@router.post("/upload", response_model=Dict[str, Any])
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a vector spatial dataset (GeoJSON, Shapefile zip, CSV, KML, GeoPackage).
    Saves to controlled temporary upload directory.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing")
        
    ext = os.path.splitext(file.filename)[1].lower()
    allowed_exts = [".geojson", ".json", ".shp", ".zip", ".csv", ".kml", ".kmz", ".gpkg", ".tif", ".tiff"]
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format '{ext}'. Allowed formats: {', '.join(allowed_exts)}"
        )
        
    unique_name = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        inspection = ingestion_service.inspect_file(file_path)
        return {
            "status": "uploaded",
            "file_name": file.filename,
            "stored_path": file_path,
            "inspection": inspection
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")


@router.post("/inspect", response_model=Dict[str, Any])
async def inspect_dataset(req: InspectRequest):
    """
    Inspect a spatial file for format, geometry type, CRS, feature count, bbox, and attributes.
    """
    if req.file_path and os.path.exists(req.file_path):
        return ingestion_service.inspect_file(req.file_path)
        
    # Demo dataset inspection fallback if no file path provided
    return {
        "file_name": req.raw_dataset_name or "Municipal_Cadastral_2024.geojson",
        "format": "GeoJSON",
        "geometry_type": "Polygon",
        "feature_count": 128,
        "crs": "EPSG:32643",
        "bbox": [77.58, 12.96, 77.62, 13.01],
        "attribute_fields": ["survey_parcel_id", "landuse", "prop_status", "survey_area", "owner"],
        "is_raster": False
    }


@router.post("/validate", response_model=Dict[str, Any])
async def validate_geometry(req: ValidateRequest):
    """
    Validate GeoJSON geometry topology for validity, self-intersections, and ring issues.
    """
    return harmonization_service.validate_geometry(req.geometry)


@router.post("/transform", response_model=Dict[str, Any])
async def transform_geometry(req: TransformRequest):
    """
    Transform GeoJSON geometry from source_crs to target_crs while preserving provenance.
    """
    return harmonization_service.transform_geometry(req.geometry, req.source_crs, req.target_crs)


@router.post("/process", response_model=Dict[str, Any])
async def process_ingestion(req: ProcessRequest):
    """
    Triggers full spatial ingestion pipeline for file or sample synthetic dataset.
    """
    target_crs = req.target_crs or "EPSG:4326"
    source_id = req.source_id or "SRC-001"
    
    file_path = req.file_path
    if not file_path or not os.path.exists(file_path):
        # Create a sample demo GeoJSON file to process if none provided
        sample_path = os.path.join(UPLOAD_DIR, "demo_parcels.geojson")
        if not os.path.exists(sample_path):
            sample_data = {
                "type": "FeatureCollection",
                "crs": {"type": "name", "properties": {"name": "EPSG:32643"}},
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [[[781000, 1434000], [781100, 1434000], [781100, 1434100], [781000, 1434100], [781000, 1434000]]]
                        },
                        "properties": {
                            "survey_parcel_id": "PRCL-B101",
                            "landuse": "RESIDENTIAL",
                            "prop_status": "Clear",
                            "survey_area": 10000.0,
                            "owner": "BBMP"
                        }
                    }
                ]
            }
            import json
            with open(sample_path, "w", encoding="utf-8") as f:
                json.dump(sample_data, f, indent=2)
        file_path = sample_path
        
    job = ingestion_service.start_ingestion_job(file_path, source_id, target_crs)
    return job


@router.get("/jobs/{job_id}", response_model=Dict[str, Any])
async def get_job_status(job_id: str):
    """
    Returns pipeline processing job status and results by job_id.
    """
    job = ingestion_service.get_job_status(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Ingestion job '{job_id}' not found.")
    return job


@router.post("/metrics", response_model=Dict[str, Any])
async def calculate_metrics(req: MetricsRequest):
    """
    Calculate area, perimeter, centroid, and bounding box for a geometry.
    """
    return spatial_service.calculate_metrics(req.geometry)


@router.post("/iou", response_model=Dict[str, Any])
async def calculate_iou(req: IoURequest):
    """
    Calculate Intersection-over-Union (IoU) and area similarity between two polygon geometries.
    """
    return spatial_service.compare_geometries(req.geom1, req.geom2)
