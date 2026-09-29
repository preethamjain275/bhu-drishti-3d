"""
CRS Detector
Detects, normalizes, and classifies Coordinate Reference Systems from raw strings, EPSG codes, or WKT metadata.
"""

from typing import Dict, Any, Optional

class CRSDetector:
    """
    Detector for Coordinate Reference Systems (CRS).
    Returns 'Unknown' if CRS information is missing or invalid.
    """

    KNOWN_CRS_MAP = {
        "4326": "EPSG:4326",
        "EPSG:4326": "EPSG:4326",
        "WGS 84": "EPSG:4326",
        "WGS84": "EPSG:4326",
        "32643": "EPSG:32643",
        "EPSG:32643": "EPSG:32643",
        "WGS 84 / UTM ZONE 43N": "EPSG:32643",
        "UTM 43N": "EPSG:32643",
        "3857": "EPSG:3857",
        "EPSG:3857": "EPSG:3857",
        "WEB MERCATOR": "EPSG:3857",
        "PSEUDO-MERCATOR": "EPSG:3857",
    }

    @staticmethod
    def detect_crs(raw_crs: Optional[Any]) -> Dict[str, Any]:
        """
        Detect and normalize raw CRS input.
        Returns:
            {
                "crs": "EPSG:4326" | "EPSG:32643" | "Unknown",
                "is_known": bool,
                "is_projected": bool,
                "unit": "degree" | "meter" | "unknown",
                "original_input": str
            }
        """
        if raw_crs is None:
            return {
                "crs": "Unknown",
                "is_known": False,
                "is_projected": False,
                "unit": "unknown",
                "original_input": "None"
            }
            
        raw_str = str(raw_crs).strip()
        if not raw_str or raw_str.lower() in ["none", "null", "undefined", "unknown"]:
            return {
                "crs": "Unknown",
                "is_known": False,
                "is_projected": False,
                "unit": "unknown",
                "original_input": raw_str
            }

        # Try PyProj if available
        try:
            import pyproj
            crs_obj = pyproj.CRS.from_user_input(raw_crs)
            epsg_code = crs_obj.to_epsg()
            norm_code = f"EPSG:{epsg_code}" if epsg_code else str(crs_obj.name)
            is_proj = crs_obj.is_projected
            axis_unit = "meter" if is_proj else "degree"
            
            return {
                "crs": norm_code,
                "is_known": True,
                "is_projected": is_proj,
                "unit": axis_unit,
                "original_input": raw_str
            }
        except Exception:
            pass

        # Fallback to map lookup
        upper_str = raw_str.upper()
        for key, val in CRSDetector.KNOWN_CRS_MAP.items():
            if key in upper_str:
                is_proj = val != "EPSG:4326"
                unit = "meter" if is_proj else "degree"
                return {
                    "crs": val,
                    "is_known": True,
                    "is_projected": is_proj,
                    "unit": unit,
                    "original_input": raw_str
                }

        # If missing or unrecognized, report CRS: Unknown
        return {
            "crs": "Unknown",
            "is_known": False,
            "is_projected": False,
            "unit": "unknown",
            "original_input": raw_str
        }
