"""
Harmonization Service
Business service for CRS transformation, canonical schema mapping, attribute normalization, and quality scoring.
"""

from typing import Dict, Any, List, Optional
from app.geospatial.crs.detector import CRSDetector
from app.geospatial.crs.validator import CRSValidator
from app.geospatial.crs.transformer import CRSTransformer
from app.geospatial.geometry.validator import GeometryValidator
from app.geospatial.geometry.cleaner import GeometryCleaner
from app.geospatial.schema.mapper import SchemaMapper
from app.geospatial.schema.normalizer import AttributeNormalizer
from app.geospatial.quality.analyzer import QualityAnalyzer

class HarmonizationService:
    """
    Geospatial Harmonization Service.
    """

    def analyze_crs(self, crs_string: str) -> Dict[str, Any]:
        """Detect and validate CRS representation."""
        return CRSValidator.validate_crs(crs_string)

    def transform_geometry(self, geometry: Dict[str, Any], source_crs: str, target_crs: str = "EPSG:4326") -> Dict[str, Any]:
        """Reprojects geometry from source_crs to target_crs while keeping source geometry intact."""
        return CRSTransformer.transform_geometry(geometry, source_crs, target_crs)

    def map_schema(self, source_fields: List[str]) -> List[Dict[str, Any]]:
        """Maps source attribute field names to canonical urban schema."""
        return SchemaMapper.map_to_canonical(source_fields)

    def validate_geometry(self, geometry: Dict[str, Any]) -> Dict[str, Any]:
        """Validates GeoJSON geometry topology."""
        return GeometryValidator.validate_geometry(geometry)

    def repair_geometry(self, geometry: Dict[str, Any]) -> Dict[str, Any]:
        """Creates a derived repaired geometry using Shapely make_valid / buffer(0)."""
        return GeometryCleaner.repair_geometry(geometry)

    def normalize_attributes(self, props: Dict[str, Any]) -> Dict[str, Any]:
        """Normalizes attribute strings, dates, numbers, and category values."""
        return AttributeNormalizer.normalize_feature_attributes(props)

    def evaluate_quality(self, dataset_meta: Dict[str, Any], features: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Full quality evaluation of a feature collection dataset."""
        crs_info = self.analyze_crs(dataset_meta.get("crs", "Unknown"))
        
        geoms_val = [self.validate_geometry(f.get("geometry")) for f in features]
        attr_inspect = SchemaMapper.inspect_attributes(features)
        source_fields = [attr["field_name"] for attr in attr_inspect]
        mappings = self.map_schema(source_fields)
        
        return QualityAnalyzer.analyze_dataset_quality(dataset_meta, crs_info, geoms_val, mappings, attr_inspect)
