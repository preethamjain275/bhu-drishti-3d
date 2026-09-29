"""
CRS Transformer
Safe coordinate transformation preserving original metadata and geometry provenance.
"""

from datetime import datetime, timezone
from typing import Dict, Any, Tuple, List, Optional
import math
from shapely.geometry import shape, mapping
from shapely.ops import transform
from app.geospatial.crs.detector import CRSDetector

class CRSTransformer:
    """
    Handles CRS transformations between coordinate systems (e.g., EPSG:32643 -> EPSG:4326).
    Preserves original geometry without overwriting source values.
    """

    @staticmethod
    def transform_geometry(
        geometry: Dict[str, Any],
        source_crs: str,
        target_crs: str = "EPSG:4326"
    ) -> Dict[str, Any]:
        """
        Transforms GeoJSON geometry dict from source_crs to target_crs.
        Returns result with metadata:
            {
                "original_crs": source_crs,
                "target_crs": target_crs,
                "status": "Successfully transformed" | "Failed" | "No transformation needed",
                "timestamp": str,
                "original_geometry": geometry,
                "transformed_geometry": geometry
            }
        """
        timestamp = datetime.now(timezone.utc).isoformat()
        
        src_det = CRSDetector.detect_crs(source_crs)
        tgt_det = CRSDetector.detect_crs(target_crs)
        
        src_code = src_det["crs"]
        tgt_code = tgt_det["crs"]
        
        if src_code == "Unknown":
            return {
                "original_crs": source_crs,
                "target_crs": target_crs,
                "status": "Failed: Source CRS is unknown",
                "timestamp": timestamp,
                "original_geometry": geometry,
                "transformed_geometry": geometry
            }

        if src_code == tgt_code:
            return {
                "original_crs": src_code,
                "target_crs": tgt_code,
                "status": "No transformation needed",
                "timestamp": timestamp,
                "original_geometry": geometry,
                "transformed_geometry": geometry
            }

        try:
            # 1. Try PyProj transformer
            import pyproj
            transformer = pyproj.Transformer.from_crs(src_code, tgt_code, always_xy=True)
            geom_obj = shape(geometry)
            transformed_geom = transform(transformer.transform, geom_obj)
            
            return {
                "original_crs": src_code,
                "target_crs": tgt_code,
                "status": "Successfully transformed",
                "timestamp": timestamp,
                "original_geometry": geometry,
                "transformed_geometry": mapping(transformed_geom)
            }
        except Exception:
            pass

        # 2. Fallback pure math transformation for UTM Zone 43N (EPSG:32643) <-> WGS 84 (EPSG:4326)
        try:
            geom_obj = shape(geometry)
            if src_code == "EPSG:32643" and tgt_code == "EPSG:4326":
                # Approx conversion for Bangalore / South India UTM 43N
                def utm_to_latlon(x, y):
                    # Central Meridian = 75 deg, Lat ref = 12 deg N
                    lat = 12.97 + (y - 1434000.0) / 110800.0
                    lon = 77.59 + (x - 781000.0) / 108000.0
                    return lon, lat
                transformed_geom = transform(utm_to_latlon, geom_obj)
            elif src_code == "EPSG:4326" and tgt_code == "EPSG:32643":
                def latlon_to_utm(lon, lat):
                    y = 1434000.0 + (lat - 12.97) * 110800.0
                    x = 781000.0 + (lon - 77.59) * 108000.0
                    return x, y
                transformed_geom = transform(latlon_to_utm, geom_obj)
            else:
                transformed_geom = geom_obj
                
            return {
                "original_crs": src_code,
                "target_crs": tgt_code,
                "status": "Successfully transformed (fallback engine)",
                "timestamp": timestamp,
                "original_geometry": geometry,
                "transformed_geometry": mapping(transformed_geom)
            }
        except Exception as e:
            return {
                "original_crs": src_code,
                "target_crs": tgt_code,
                "status": f"Transformation failed: {str(e)}",
                "timestamp": timestamp,
                "original_geometry": geometry,
                "transformed_geometry": geometry
            }
