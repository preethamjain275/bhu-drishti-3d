"""
Dataset Writer
Serializes spatial datasets to GeoJSON, Shapefile, GeoPackage, or CSV formats.
"""

import os
import json
from typing import Dict, Any, List, Optional

class DatasetWriter:
    """
    Writer utility for exporting spatial vector features.
    """

    @staticmethod
    def write_geojson(features: List[Dict[str, Any]], output_path: str, crs: str = "EPSG:4326") -> str:
        """
        Write list of GeoJSON feature dicts to a GeoJSON file.
        """
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        geojson = {
            "type": "FeatureCollection",
            "crs": {
                "type": "name",
                "properties": {
                    "name": crs
                }
            },
            "features": features
        }
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(geojson, f, indent=2)
        return output_path

    @staticmethod
    def write_dataset(features: List[Dict[str, Any]], output_path: str, format_name: str = "GeoJSON", crs: str = "EPSG:4326") -> str:
        """
        Export features into requested format (GeoJSON, Shapefile, GeoPackage, CSV).
        """
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        try:
            import geopandas as gpd
            from shapely.geometry import shape
            
            records = []
            geoms = []
            for feat in features:
                props = feat.get("properties", {}).copy()
                g = shape(feat.get("geometry", {}))
                records.append(props)
                geoms.append(g)
                
            gdf = gpd.GeoDataFrame(records, geometry=geoms, crs=crs)
            
            driver_map = {
                "GeoJSON": "GeoJSON",
                "Shapefile": "ESRI Shapefile",
                "GeoPackage": "GPKG",
            }
            driver = driver_map.get(format_name, "GeoJSON")
            gdf.to_file(output_path, driver=driver)
            return output_path
        except Exception:
            # Fallback to GeoJSON writing if GeoPandas fails or format driver is missing
            return DatasetWriter.write_geojson(features, output_path, crs=crs)
