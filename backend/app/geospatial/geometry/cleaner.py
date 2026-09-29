"""
Geometry Cleaner & Repair Engine
Provides derived geometry repair without overwriting original authoritative source geometry.
"""

from typing import Dict, Any, Optional
from shapely.geometry import shape, mapping
from shapely.validation import make_valid
from app.geospatial.geometry.validator import GeometryValidator

class GeometryCleaner:
    """
    Cleaner for invalid geometries.
    Generates a DERIVED repaired geometry while keeping original geometry intact.
    """

    @staticmethod
    def repair_geometry(geometry: Dict[str, Any]) -> Dict[str, Any]:
        """
        Attempts to repair invalid geometry using Shapely make_valid or buffer(0).
        Returns:
            {
                "is_repaired": bool,
                "repair_method": "shapely.make_valid" | "buffer(0)" | "none",
                "original_validity": Dict[str, Any],
                "repaired_validity": Dict[str, Any],
                "original_geometry": geometry,
                "derived_repaired_geometry": geometry
            }
        """
        orig_val = GeometryValidator.validate_geometry(geometry)
        
        if orig_val["valid"]:
            return {
                "is_repaired": False,
                "repair_method": "none",
                "original_validity": orig_val,
                "repaired_validity": orig_val,
                "original_geometry": geometry,
                "derived_repaired_geometry": geometry
            }
            
        try:
            geom_obj = shape(geometry)
            repaired_obj = None
            method = "shapely.make_valid"
            
            try:
                repaired_obj = make_valid(geom_obj)
            except Exception:
                repaired_obj = geom_obj.buffer(0)
                method = "buffer(0)"
                
            repaired_geojson = mapping(repaired_obj)
            repaired_val = GeometryValidator.validate_geometry(repaired_geojson)
            
            return {
                "is_repaired": repaired_val["valid"],
                "repair_method": method,
                "original_validity": orig_val,
                "repaired_validity": repaired_val,
                "original_geometry": geometry,
                "derived_repaired_geometry": repaired_geojson
            }
        except Exception as e:
            return {
                "is_repaired": False,
                "repair_method": f"failed: {str(e)}",
                "original_validity": orig_val,
                "repaired_validity": orig_val,
                "original_geometry": geometry,
                "derived_repaired_geometry": geometry
            }
