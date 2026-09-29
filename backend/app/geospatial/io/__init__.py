"""
Geospatial I/O package: dataset reading, format detection, format conversion, metadata extraction.
"""
from app.geospatial.io.reader import DatasetReader, GDALProcessor
from app.geospatial.io.writer import DatasetWriter

__all__ = ["DatasetReader", "GDALProcessor", "DatasetWriter"]
