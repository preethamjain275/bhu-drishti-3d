"""
Geospatial API Schemas
Pydantic request and response models for geospatial inspection, validation, transformation, and ingestion processing.
"""

from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

class InspectRequest(BaseModel):
    file_path: Optional[str] = Field(None, description="Path to file in upload directory")
    raw_dataset_name: Optional[str] = Field(None, description="Dataset name for synthetic inspection")

class ValidateRequest(BaseModel):
    geometry: Dict[str, Any] = Field(..., description="GeoJSON geometry object")
    crs: Optional[str] = Field("EPSG:4326", description="CRS of the geometry")

class TransformRequest(BaseModel):
    geometry: Dict[str, Any] = Field(..., description="GeoJSON geometry object to transform")
    source_crs: str = Field(..., description="Source CRS (e.g., EPSG:32643)")
    target_crs: str = Field("EPSG:4326", description="Target CRS (e.g., EPSG:4326)")

class ProcessRequest(BaseModel):
    file_path: Optional[str] = Field(None, description="Path to file to process")
    source_id: Optional[str] = Field("SRC-001", description="Associated DataSource ID")
    target_crs: Optional[str] = Field("EPSG:4326", description="Target output CRS")
    auto_repair: Optional[bool] = Field(False, description="Whether to generate derived repaired geometries")

class MetricsRequest(BaseModel):
    geometry: Dict[str, Any] = Field(..., description="GeoJSON geometry object")

class IoURequest(BaseModel):
    geom1: Dict[str, Any] = Field(..., description="First GeoJSON polygon")
    geom2: Dict[str, Any] = Field(..., description="Second GeoJSON polygon")

class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    progress_percent: int
    current_stage: str
    created_at: str
    completed_at: Optional[str] = None
    metadata: Dict[str, Any] = {}
    crs_info: Dict[str, Any] = {}
    quality: Dict[str, Any] = {}
    features_summary: Dict[str, Any] = {}
    error: Optional[str] = None
