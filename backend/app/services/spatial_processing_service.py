"""
Spatial Processing Service
Service layer exposing geometric metric calculations, IoU polygon comparison, and spatial predicates.
"""

from typing import Dict, Any, List, Optional
from app.geospatial.geometry.metrics import GeometryMetrics

class SpatialProcessingService:
    """
    Spatial calculations and predicate evaluations service.
    """

    def calculate_metrics(self, geometry: Dict[str, Any]) -> Dict[str, Any]:
        """Calculates area, perimeter, centroid, and bounding box."""
        return GeometryMetrics.compute_metrics(geometry)

    def calculate_iou(self, geom1: Dict[str, Any], geom2: Dict[str, Any]) -> Dict[str, float]:
        """Calculates Intersection-over-Union (IoU) between two polygons."""
        return GeometryMetrics.compute_iou(geom1, geom2)

    def compare_geometries(self, geom1: Dict[str, Any], geom2: Dict[str, Any]) -> Dict[str, Any]:
        """Computes comprehensive metric comparison between two geometries."""
        return GeometryMetrics.compare_geometries(geom1, geom2)

    def check_spatial_relations(self, geom1: Dict[str, Any], geom2: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluates topological spatial relations: intersects, contains, within, touches, overlaps, crosses, distance."""
        return GeometryMetrics.spatial_relations(geom1, geom2)
