"""
Geometry Validator
Inspects Shapely geometries for validity, self-intersections, empty/null states, and structural anomalies.
Does NOT modify authoritative source geometries.
"""

from typing import Dict, Any, List, Optional
from shapely.geometry import shape
from shapely.validation import explain_validity

class GeometryValidator:
    """
    Validation pipeline for vector geometries.
    """

    @staticmethod
    def validate_geometry(geometry: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Validate a GeoJSON geometry dict.
        Returns:
            {
                "valid": bool,
                "geometry_type": str,
                "is_empty": bool,
                "is_null": bool,
                "issues": List[str],
                "validity_reason": str
            }
        """
        if geometry is None:
            return {
                "valid": False,
                "geometry_type": "None",
                "is_empty": True,
                "is_null": True,
                "issues": ["Geometry is null"],
                "validity_reason": "Null geometry object"
            }
            
        try:
            geom_obj = shape(geometry)
            geom_type = geom_obj.geom_type
            is_empty = geom_obj.is_empty
            
            issues: List[str] = []
            if is_empty:
                issues.append("Geometry is empty")
                
            is_valid = geom_obj.is_valid
            reason = "Valid geometry"
            
            if not is_valid:
                reason = explain_validity(geom_obj)
                if "Self-intersection" in reason or "Self-intersection" in str(reason):
                    issues.append("Self-intersection detected")
                elif "Ring Self-intersection" in reason:
                    issues.append("Invalid interior/exterior ring self-intersection")
                elif "Too few points" in reason:
                    issues.append("Too few vertices for geometry type")
                else:
                    issues.append(f"Invalid geometry: {reason}")
                    
            # Check for duplicate consecutive vertices if Polygon / LineString
            try:
                coords = list(geom_obj.exterior.coords) if hasattr(geom_obj, "exterior") else []
                if coords:
                    for i in range(len(coords) - 1):
                        if coords[i] == coords[i + 1] and i < len(coords) - 2:
                            issues.append("Duplicate consecutive vertices detected")
                            break
            except Exception:
                pass
                
            return {
                "valid": len(issues) == 0 and is_valid,
                "geometry_type": geom_type,
                "is_empty": is_empty,
                "is_null": False,
                "issues": issues,
                "validity_reason": reason
            }
        except Exception as e:
            return {
                "valid": False,
                "geometry_type": geometry.get("type", "Unknown") if isinstance(geometry, dict) else "Unknown",
                "is_empty": False,
                "is_null": False,
                "issues": [f"Failed to parse geometry: {str(e)}"],
                "validity_reason": str(e)
            }
