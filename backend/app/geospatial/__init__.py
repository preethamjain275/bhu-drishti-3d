"""
BHOO-MITRA AI — Geospatial Processing Layer
Integrates GDAL, PROJ, GeoPandas, and Shapely for real geospatial ingestion,
CRS harmonization, geometry validation, attribute normalization, and quality scoring.
"""

from app.geospatial.pipeline import IngestionPipeline, ProcessingJobStatus

__all__ = [
    "IngestionPipeline",
    "ProcessingJobStatus",
]
