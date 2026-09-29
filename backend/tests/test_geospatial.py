"""
BHOO-MITRA AI — Geospatial Processing Layer Unit & Integration Tests
Tests CRS, Geometry Validation, Metrics, IoU, Schema Mapping, Quality Analysis, and Ingestion Pipeline.
"""

import pytest
import os
from app.geospatial.crs.detector import CRSDetector
from app.geospatial.crs.validator import CRSValidator
from app.geospatial.crs.transformer import CRSTransformer
from app.geospatial.geometry.validator import GeometryValidator
from app.geospatial.geometry.cleaner import GeometryCleaner
from app.geospatial.geometry.metrics import GeometryMetrics
from app.geospatial.schema.mapper import SchemaMapper
from app.geospatial.schema.normalizer import AttributeNormalizer
from app.geospatial.quality.analyzer import QualityAnalyzer
from app.geospatial.pipeline import IngestionPipeline, ProcessingJobStatus

# ── 1. CRS Tests ─────────────────────────────────────────────────────────────

def test_crs_detection():
    # Valid CRS
    res1 = CRSDetector.detect_crs("EPSG:4326")
    assert res1["crs"] == "EPSG:4326"
    assert res1["is_known"] is True
    assert res1["is_projected"] is False

    res2 = CRSDetector.detect_crs("32643")
    assert res2["crs"] == "EPSG:32643"
    assert res2["is_projected"] is True

    # Unknown / missing CRS
    res3 = CRSDetector.detect_crs(None)
    assert res3["crs"] == "Unknown"
    assert res3["is_known"] is False

    res4 = CRSDetector.detect_crs("INVALID_CRS_99999")
    assert res4["crs"] == "Unknown"
    assert res4["is_known"] is False


def test_crs_transformation():
    poly_32643 = {
        "type": "Polygon",
        "coordinates": [[[781000, 1434000], [781100, 1434000], [781100, 1434100], [781000, 1434100], [781000, 1434000]]]
    }
    
    # Reproject EPSG:32643 -> EPSG:4326
    tx1 = CRSTransformer.transform_geometry(poly_32643, "EPSG:32643", "EPSG:4326")
    assert tx1["status"].startswith("Successfully")
    assert tx1["original_crs"] == "EPSG:32643"
    assert tx1["target_crs"] == "EPSG:4326"
    assert tx1["original_geometry"] == poly_32643
    assert tx1["transformed_geometry"]["type"] == "Polygon"

    # Reproject EPSG:4326 -> EPSG:32643
    poly_4326 = tx1["transformed_geometry"]
    tx2 = CRSTransformer.transform_geometry(poly_4326, "EPSG:4326", "EPSG:32643")
    assert tx2["status"].startswith("Successfully")

# ── 2. Geometry Validation & Cleaning Tests ────────────────────────────────────

def test_geometry_validation():
    # Valid Polygon
    valid_poly = {
        "type": "Polygon",
        "coordinates": [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]
    }
    val1 = GeometryValidator.validate_geometry(valid_poly)
    assert val1["valid"] is True
    assert val1["geometry_type"] == "Polygon"
    assert len(val1["issues"]) == 0

    # Self-intersecting Invalid Polygon (bow-tie shape)
    bowtie_poly = {
        "type": "Polygon",
        "coordinates": [[[0, 0], [10, 10], [10, 0], [0, 10], [0, 0]]]
    }
    val2 = GeometryValidator.validate_geometry(bowtie_poly)
    assert val2["valid"] is False
    assert len(val2["issues"]) > 0

    # Point & MultiPolygon
    point_geom = {"type": "Point", "coordinates": [77.59, 12.97]}
    val3 = GeometryValidator.validate_geometry(point_geom)
    assert val3["valid"] is True
    assert val3["geometry_type"] == "Point"

    # Derived repair test
    clean_res = GeometryCleaner.repair_geometry(bowtie_poly)
    assert clean_res["original_geometry"] == bowtie_poly
    assert clean_res["derived_repaired_geometry"] != bowtie_poly
    assert clean_res["repaired_validity"]["valid"] is True

# ── 3. Metrics & IoU Tests ───────────────────────────────────────────────────

def test_geometry_metrics():
    square1 = {
        "type": "Polygon",
        "coordinates": [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]
    }
    metrics = GeometryMetrics.compute_metrics(square1)
    assert metrics["area"] == 100.0
    assert metrics["perimeter"] == 40.0
    assert metrics["centroid"] == [5.0, 5.0]
    assert metrics["bbox"] == [0.0, 0.0, 10.0, 10.0]

    square2 = {
        "type": "Polygon",
        "coordinates": [[[5, 0], [15, 0], [15, 10], [5, 10], [5, 0]]]
    }
    iou_res = GeometryMetrics.compute_iou(square1, square2)
    assert iou_res["intersection_area"] == 50.0
    assert iou_res["union_area"] == 150.0
    assert abs(iou_res["iou"] - 0.333333) < 0.01

    rels = GeometryMetrics.spatial_relations(square1, square2)
    assert rels["intersects"] is True
    assert rels["contains"] is False
    assert rels["distance"] == 0.0

# ── 4. Schema Mapping & Attribute Normalization Tests ────────────────────────

def test_schema_mapping():
    source_fields = ["survey_parcel_id", "landuse", "prop_status", "survey_area", "owner"]
    mappings = SchemaMapper.map_to_canonical(source_fields)
    
    can_map = {m["canonical_field"]: m for m in mappings}
    assert can_map["canonical_parcel_id"]["source_field"] == "survey_parcel_id"
    assert can_map["land_use"]["source_field"] == "landuse"
    assert can_map["property_status"]["source_field"] == "prop_status"
    assert can_map["area"]["source_field"] == "survey_area"


def test_attribute_normalization():
    norm_res = AttributeNormalizer.normalize_category(" residential ")
    assert norm_res["original_value"] == " residential "
    assert norm_res["normalized_value"] == "Residential"

    props = {
        "landuse": " residential ",
        "survey_area": 1234.5678,
        "owner": "BBMP"
    }
    norm_props = AttributeNormalizer.normalize_feature_attributes(props)
    assert norm_props["original_attributes"] == props
    assert norm_props["normalized_attributes"]["landuse"] == "Residential"
    assert norm_props["normalized_attributes"]["survey_area"] == 1234.57

# ── 5. Full Pipeline Test ────────────────────────────────────────────────────

def test_ingestion_pipeline():
    job = IngestionPipeline.create_job("SRC-TEST", "test_file.geojson", "EPSG:4326")
    assert job["status"] == ProcessingJobStatus.QUEUED

    # Create dummy file to run pipeline
    sample_file = os.path.join(os.path.dirname(__file__), "sample_test.geojson")
    sample_data = """{
        "type": "FeatureCollection",
        "crs": {"type": "name", "properties": {"name": "EPSG:32643"}},
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[781000, 1434000], [781100, 1434000], [781100, 1434100], [781000, 1434100], [781000, 1434000]]]
                },
                "properties": {"survey_parcel_id": "P101", "landuse": "commercial", "survey_area": 10000}
            }
        ]
    }"""
    with open(sample_file, "w", encoding="utf-8") as f:
        f.write(sample_data)

    res_job = IngestionPipeline.process_dataset(job["job_id"], sample_file, "EPSG:4326")
    
    assert res_job["status"] in [ProcessingJobStatus.COMPLETED, ProcessingJobStatus.NEEDS_REVIEW]
    assert res_job["progress_percent"] == 100
    assert res_job["quality"]["overall_quality_score"] > 0.0
    assert len(res_job["normalized_features"]) == 1
    
    # Cleanup sample file
    if os.path.exists(sample_file):
        os.remove(sample_file)
