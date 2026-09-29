"""
Schema package: field mapping to Canonical Urban Schema and attribute normalization.
"""

from app.geospatial.schema.mapper import SchemaMapper, CANONICAL_FIELDS
from app.geospatial.schema.normalizer import AttributeNormalizer

__all__ = ["SchemaMapper", "CANONICAL_FIELDS", "AttributeNormalizer"]
