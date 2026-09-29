"""
Geometry Metrics & Spatial Relationship Utilities
Calculates area, perimeter, centroid, bounding box, IoU, centroid distance, and spatial predicates.
"""

from typing import Dict, Any, List, Optional, Tuple
from shapely.geometry import shape, mapping

class GeometryMetrics:
    """
    Utility class for geometric metric computations and spatial relation checks.
    """

    @staticmethod
    def compute_metrics(geometry: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates area, perimeter, centroid, bounding box for a GeoJSON geometry.
        """
        try:
            geom_obj = shape(geometry)
            area = float(geom_obj.area)
            length = float(geom_obj.length) # Perimeter / length
            bounds = [float(b) for b in geom_obj.bounds]
            centroid = [float(geom_obj.centroid.x), float(geom_obj.centroid.y)]
            
            return {
                "area": area,
                "perimeter": length,
                "centroid": centroid,
                "bbox": bounds,
                "geometry_type": geom_obj.geom_type,
            }
        except Exception as e:
            return {
                "area": 0.0,
                "perimeter": 0.0,
                "centroid": [0.0, 0.0],
                "bbox": [0.0, 0.0, 0.0, 0.0],
                "geometry_type": "Unknown",
                "error": str(e)
            }

    @staticmethod
    def compute_iou(geom1: Dict[str, Any], geom2: Dict[str, Any]) -> Dict[str, float]:
        """
        Calculates Intersection-over-Union (IoU) between two polygon geometries.
        IoU = intersection_area / union_area
        """
        try:
            g1 = shape(geom1)
            g2 = shape(geom2)
            
            if not g1.is_valid:
                g1 = g1.buffer(0)
            if not g2.is_valid:
                g2 = g2.buffer(0)
                
            intersection = g1.intersection(g2)
            union = g1.union(g2)
            
            inter_area = float(intersection.area)
            union_area = float(union.area)
            
            iou = inter_area / union_area if union_area > 0 else 0.0
            
            return {
                "intersection_area": inter_area,
                "union_area": union_area,
                "iou": iou,
                "area_similarity": float(min(g1.area, g2.area) / max(g1.area, g2.area)) if max(g1.area, g2.area) > 0 else 0.0
            }
        except Exception as e:
            return {
                "intersection_area": 0.0,
                "union_area": 0.0,
                "iou": 0.0,
                "area_similarity": 0.0,
                "error": str(e)
            }

    @staticmethod
    def compare_geometries(geom1: Dict[str, Any], geom2: Dict[str, Any]) -> Dict[str, Any]:
        """
        Full comparison metrics between two geometries: centroid distance, area diff, perimeter diff, IoU.
        """
        m1 = GeometryMetrics.compute_metrics(geom1)
        m2 = GeometryMetrics.compute_metrics(geom2)
        iou_res = GeometryMetrics.compute_iou(geom1, geom2)
        
        c1_x, c1_y = m1["centroid"]
        c2_x, c2_y = m2["centroid"]
        centroid_distance = float(((c1_x - c2_x)**2 + (c1_y - c2_y)**2)**0.5)
        
        area_diff = float(abs(m1["area"] - m2["area"]))
        perim_diff = float(abs(m1["perimeter"] - m2["perimeter"]))
        
        return {
            "geom1_metrics": m1,
            "geom2_metrics": m2,
            "centroid_distance": centroid_distance,
            "area_difference": area_diff,
            "perimeter_difference": perim_diff,
            "intersection_area": iou_res["intersection_area"],
            "union_area": iou_res["union_area"],
            "iou": iou_res["iou"],
            "area_similarity": iou_res["area_similarity"],
        }

    @staticmethod
    def spatial_relations(geom1: Dict[str, Any], geom2: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluates spatial predicates: intersects, contains, within, touches, overlaps, crosses, distance.
        """
        try:
            g1 = shape(geom1)
            g2 = shape(geom2)
            
            return {
                "intersects": bool(g1.intersects(g2)),
                "contains": bool(g1.contains(g2)),
                "within": bool(g1.within(g2)),
                "touches": bool(g1.touches(g2)),
                "overlaps": bool(g1.overlaps(g2)),
                "crosses": bool(g1.crosses(g2)),
                "distance": float(g1.distance(g2))
            }
        except Exception as e:
            return {
                "intersects": False,
                "contains": False,
                "within": False,
                "touches": False,
                "overlaps": False,
                "crosses": False,
                "distance": 0.0,
                "error": str(e)
            }
