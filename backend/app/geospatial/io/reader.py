"""
Dataset Reader & GDAL Processor
Inspects, detects formats, extracts metadata, reads vector datasets, and converts to GeoJSON.
"""

import os
import json
import csv
from typing import Dict, Any, List, Optional, Tuple

class GDALProcessor:
    """
    GDAL/OGR abstraction for inspect, format detection, metadata extraction,
    vector dataset reading, and format conversion.
    """
    
    @staticmethod
    def detect_format(file_path: str) -> str:
        """
        Detect file format from content header or extension.
        Supports: GeoJSON, CSV, Shapefile, KML, GeoPackage, Raster (GeoTIFF).
        """
        ext = os.path.splitext(file_path)[1].lower()
        
        # Quick check by magic bytes / contents if file exists
        if os.path.exists(file_path):
            try:
                with open(file_path, "rb") as f:
                    header = f.read(512)
                    if header.startswith(b"SQLite format 3"):
                        return "GeoPackage"
                    if b"<?xml" in header or b"<kml" in header:
                        return "KML"
                    if header.strip().startswith(b"{") or header.strip().startswith(b"["):
                        return "GeoJSON"
                    if b"II*\x00" in header or b"MM\x00*" in header:
                        return "GeoTIFF (Raster)"
            except Exception:
                pass
                
        ext_map = {
            ".geojson": "GeoJSON",
            ".json": "GeoJSON",
            ".shp": "Shapefile",
            ".zip": "Shapefile (Archived)",
            ".csv": "CSV",
            ".kml": "KML",
            ".kmz": "KML (Compressed)",
            ".gpkg": "GeoPackage",
            ".tif": "GeoTIFF (Raster)",
            ".tiff": "GeoTIFF (Raster)",
        }
        return ext_map.get(ext, "Unknown Format")

    @staticmethod
    def inspect_dataset(file_path: str) -> Dict[str, Any]:
        """
        Inspect dataset to extract file size, format, geometry type, feature count,
        CRS, bounding box, and attribute fields.
        """
        file_size = os.path.getsize(file_path) if os.path.exists(file_path) else 0
        fmt = GDALProcessor.detect_format(file_path)
        
        # Try GeoPandas / Fiona if available
        try:
            import geopandas as gpd
            gdf = gpd.read_file(file_path)
            geom_types = list(set(gdf.geometry.type.dropna().unique()))
            primary_geom = geom_types[0] if geom_types else "Unknown"
            crs_str = str(gdf.crs) if gdf.crs else "Unknown"
            total_bounds = list(gdf.total_bounds) if len(gdf) > 0 else [0.0, 0.0, 0.0, 0.0]
            fields = [c for c in gdf.columns if c != "geometry"]
            
            return {
                "file_path": file_path,
                "file_name": os.path.basename(file_path),
                "file_size": file_size,
                "format": fmt,
                "geometry_type": primary_geom,
                "feature_count": len(gdf),
                "crs": crs_str if crs_str != "None" else "Unknown",
                "bbox": total_bounds,
                "attribute_fields": fields,
                "is_raster": "Raster" in fmt,
            }
        except Exception:
            pass

        # Fallback to json / csv parsing
        if fmt == "GeoJSON":
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                features = data.get("features", [])
                feature_count = len(features)
                
                crs = "Unknown"
                if "crs" in data and "properties" in data["crs"]:
                    crs = str(data["crs"]["properties"].get("name", "Unknown"))
                elif feature_count > 0:
                    crs = "EPSG:4326" # Standard default for GeoJSON if unspecified
                    
                geom_type = "Unknown"
                fields = []
                min_x, min_y, max_x, max_y = float("inf"), float("inf"), float("-inf"), float("-inf")
                
                if features:
                    first_feat = features[0]
                    geom_type = first_feat.get("geometry", {}).get("type", "Polygon")
                    fields = list(first_feat.get("properties", {}).keys())
                    
                    for feat in features:
                        coords = feat.get("geometry", {}).get("coordinates", [])
                        _extract_bounds(coords, min_x, min_y, max_x, max_y)
                        
                bbox = [min_x, min_y, max_x, max_y] if min_x != float("inf") else [0.0, 0.0, 0.0, 0.0]
                
                return {
                    "file_path": file_path,
                    "file_name": os.path.basename(file_path),
                    "file_size": file_size,
                    "format": "GeoJSON",
                    "geometry_type": geom_type,
                    "feature_count": feature_count,
                    "crs": crs,
                    "bbox": bbox,
                    "attribute_fields": fields,
                    "is_raster": False,
                }
            except Exception as e:
                pass
                
        # Default fallback metadata
        return {
            "file_path": file_path,
            "file_name": os.path.basename(file_path),
            "file_size": file_size,
            "format": fmt,
            "geometry_type": "Polygon",
            "feature_count": 0,
            "crs": "Unknown",
            "bbox": [0.0, 0.0, 0.0, 0.0],
            "attribute_fields": [],
            "is_raster": "Raster" in fmt,
        }

    @staticmethod
    def read_vector_dataset(file_path: str) -> List[Dict[str, Any]]:
        """
        Reads a vector dataset into a standardized list of GeoJSON-like feature dicts.
        """
        try:
            import geopandas as gpd
            gdf = gpd.read_file(file_path)
            geojson_str = gdf.to_json()
            data = json.loads(geojson_str)
            return data.get("features", [])
        except Exception:
            pass

        fmt = GDALProcessor.detect_format(file_path)
        if fmt == "GeoJSON":
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            return data.get("features", [])
            
        return []

    @staticmethod
    def convert_to_geojson(file_path: str, output_path: str) -> str:
        """
        Converts vector dataset at file_path to GeoJSON at output_path.
        """
        try:
            import geopandas as gpd
            gdf = gpd.read_file(file_path)
            gdf.to_file(output_path, driver="GeoJSON")
            return output_path
        except Exception:
            pass
            
        features = GDALProcessor.read_vector_dataset(file_path)
        geojson_data = {
            "type": "FeatureCollection",
            "features": features
        }
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(geojson_data, f, indent=2)
        return output_path


def _extract_bounds(coords: Any, min_x: float, min_y: float, max_x: float, max_y: float):
    """Helper recursive coordinate unpacker for bbox calculation."""
    if isinstance(coords, (list, tuple)) and len(coords) >= 2 and isinstance(coords[0], (int, float)):
        x, y = coords[0], coords[1]
        min_x = min(min_x, x)
        min_y = min(min_y, y)
        max_x = max(max_x, x)
        max_y = max(max_y, y)
    elif isinstance(coords, (list, tuple)):
        for sub in coords:
            _extract_bounds(sub, min_x, min_y, max_x, max_y)

class DatasetReader(GDALProcessor):
    """High-level DatasetReader extending GDALProcessor."""
    pass
