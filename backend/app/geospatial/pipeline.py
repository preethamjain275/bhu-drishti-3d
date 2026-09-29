"""
Ingestion Processing Pipeline
Orchestrates spatial dataset ingestion from upload to PostGIS-ready dataset.
Stages: UPLOAD -> FORMAT_DETECTION -> METADATA_EXTRACTION -> CRS_DETECTION -> SCHEMA_INSPECTION -> GEOMETRY_VALIDATION -> ATTRIBUTE_NORMALIZATION -> CRS_HARMONIZATION -> QUALITY_ANALYSIS -> POSTGIS_READY.
"""

import uuid
from enum import Enum
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Callable

from app.geospatial.io.reader import DatasetReader, GDALProcessor
from app.geospatial.crs.detector import CRSDetector
from app.geospatial.crs.validator import CRSValidator
from app.geospatial.crs.transformer import CRSTransformer
from app.geospatial.geometry.validator import GeometryValidator
from app.geospatial.geometry.cleaner import GeometryCleaner
from app.geospatial.geometry.metrics import GeometryMetrics
from app.geospatial.schema.mapper import SchemaMapper
from app.geospatial.schema.normalizer import AttributeNormalizer
from app.geospatial.quality.analyzer import QualityAnalyzer

class ProcessingJobStatus(str, Enum):
    QUEUED = "Queued"
    INSPECTING = "Inspecting"
    VALIDATING = "Validating"
    NORMALIZING = "Normalizing"
    TRANSFORMING = "Transforming"
    ANALYZING = "Analyzing"
    COMPLETED = "Completed"
    FAILED = "Failed"
    NEEDS_REVIEW = "Needs Review"

# In-memory job registry for tracking ingestion jobs
JOBS_STORE: Dict[str, Dict[str, Any]] = {}

class IngestionPipeline:
    """
    Main ingestion processing pipeline.
    """

    @staticmethod
    def create_job(source_id: str, file_name: str, target_crs: str = "EPSG:4326") -> Dict[str, Any]:
        job_id = f"JOB-{uuid.uuid4().hex[:8].upper()}"
        job = {
            "job_id": job_id,
            "source_id": source_id,
            "file_name": file_name,
            "target_crs": target_crs,
            "status": ProcessingJobStatus.QUEUED,
            "progress_percent": 0,
            "current_stage": "Queued",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "completed_at": None,
            "metadata": {},
            "crs_info": {},
            "quality": {},
            "features_summary": {
                "total": 0,
                "valid": 0,
                "repaired": 0,
            },
            "error": None
        }
        JOBS_STORE[job_id] = job
        return job

    @staticmethod
    def get_job(job_id: str) -> Optional[Dict[str, Any]]:
        return JOBS_STORE.get(job_id)

    @staticmethod
    def process_dataset(
        job_id: str,
        file_path: str,
        target_crs: str = "EPSG:4326",
        auto_repair: bool = False
    ) -> Dict[str, Any]:
        job = JOBS_STORE.get(job_id) or IngestionPipeline.create_job("SRC-001", os.path.basename(file_path), target_crs)
        
        try:
            # 1. Format Detection & Metadata Extraction (15%)
            job["status"] = ProcessingJobStatus.INSPECTING
            job["current_stage"] = "Format Detection & Metadata Extraction"
            job["progress_percent"] = 15
            
            meta = GDALProcessor.inspect_dataset(file_path)
            job["metadata"] = meta
            
            # 2. CRS Detection & Validation (30%)
            job["current_stage"] = "CRS Analysis"
            job["progress_percent"] = 30
            
            raw_crs = meta.get("crs", "Unknown")
            crs_val = CRSValidator.validate_crs(raw_crs)
            job["crs_info"] = crs_val
            
            # 3. Read Vector Features & Schema Inspection (45%)
            job["status"] = ProcessingJobStatus.VALIDATING
            job["current_stage"] = "Schema Inspection & Geometry Validation"
            job["progress_percent"] = 45
            
            features = GDALProcessor.read_vector_dataset(file_path)
            attr_inspect = SchemaMapper.inspect_attributes(features)
            source_fields = [attr["field_name"] for attr in attr_inspect]
            schema_mappings = SchemaMapper.map_to_canonical(source_fields)
            
            # 4. Geometry Validation & Reprojection (65%)
            job["status"] = ProcessingJobStatus.NORMALIZING
            job["current_stage"] = "Geometry Validation & Reprojection"
            job["progress_percent"] = 65
            
            validated_geoms = []
            normalized_features = []
            valid_count = 0
            repaired_count = 0
            
            for feat in features:
                geom = feat.get("geometry")
                props = feat.get("properties", {}) or {}
                
                val_res = GeometryValidator.validate_geometry(geom)
                validated_geoms.append(val_res)
                
                if val_res["valid"]:
                    valid_count += 1
                elif auto_repair:
                    repair_res = GeometryCleaner.repair_geometry(geom)
                    if repair_res["is_repaired"]:
                        geom = repair_res["derived_repaired_geometry"]
                        repaired_count += 1
                        
                # Transform geometry to target_crs if needed
                transformed_res = CRSTransformer.transform_geometry(geom, crs_val["crs"], target_crs)
                final_geom = transformed_res["transformed_geometry"]
                
                # Attribute normalization
                norm_attrs = AttributeNormalizer.normalize_feature_attributes(props)
                
                normalized_features.append({
                    "type": "Feature",
                    "geometry": final_geom,
                    "properties": norm_attrs["normalized_attributes"],
                    "_provenance": {
                        "original_crs": crs_val["crs"],
                        "target_crs": target_crs,
                        "original_attributes": props,
                        "geometry_validity": val_res
                    }
                })

            # 5. Quality Analysis (85%)
            job["status"] = ProcessingJobStatus.ANALYZING
            job["current_stage"] = "Data Quality Analysis"
            job["progress_percent"] = 85
            
            quality_res = QualityAnalyzer.analyze_dataset_quality(
                meta, crs_val, validated_geoms, schema_mappings, attr_inspect
            )
            job["quality"] = quality_res
            job["features_summary"] = {
                "total": len(features),
                "valid": valid_count,
                "repaired": repaired_count,
            }
            
            # 6. PostGIS Ready / Complete (100%)
            final_status = ProcessingJobStatus.COMPLETED
            if not crs_val["valid"] or quality_res["overall_quality_score"] < 0.6:
                final_status = ProcessingJobStatus.NEEDS_REVIEW
                
            job["status"] = final_status
            job["current_stage"] = "PostGIS Ready" if final_status == ProcessingJobStatus.COMPLETED else "Requires Manual Review"
            job["progress_percent"] = 100
            job["completed_at"] = datetime.now(timezone.utc).isoformat()
            job["normalized_features"] = normalized_features
            job["schema_mappings"] = schema_mappings
            
            return job
        except Exception as e:
            job["status"] = ProcessingJobStatus.FAILED
            job["current_stage"] = "Processing Failed"
            job["error"] = str(e)
            return job
