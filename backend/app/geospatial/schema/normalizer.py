"""
Attribute Normalizer
Normalizes strings, numbers, dates, and categorical values while preserving original values.
"""

import re
from typing import Dict, Any, Optional

CATEGORICAL_MAP = {
    # Land use normalization
    "res": "Residential",
    "residential": "Residential",
    "comm": "Commercial",
    "commercial": "Commercial",
    "ind": "Industrial",
    "industrial": "Industrial",
    "govt": "Government / Public",
    "government": "Government / Public",
    "public": "Government / Public",
    "agri": "Agricultural",
    "agricultural": "Agricultural",
    "vacant": "Vacant / Open",
    "open": "Vacant / Open",
    
    # Property status normalization
    "disputed": "Disputed",
    "litigation": "Disputed",
    "conflict": "Disputed",
    "clear": "Clear",
    "encroached": "Encroached",
    "encroachment": "Encroached",
    "under review": "Under Review",
    "pending": "Under Review",
    "verified": "Verified",

    # Owner category normalization
    "bbmp": "Municipal (BBMP)",
    "karnataka": "State Govt",
    "state": "State Govt",
    "private": "Private Individual",
    "corporate": "Private Corporate",
}

class AttributeNormalizer:
    """
    Normalizes property values into standardized canonical representations.
    Always preserves original raw value.
    """

    @staticmethod
    def normalize_string(val: Optional[Any]) -> Dict[str, Any]:
        """Normalize whitespace and capitalization for string values."""
        if val is None:
            return {"original_value": None, "normalized_value": None}
        raw_str = str(val)
        cleaned = re.sub(r'\s+', ' ', raw_str).strip()
        return {
            "original_value": raw_str,
            "normalized_value": cleaned if cleaned else None
        }

    @staticmethod
    def normalize_category(val: Optional[Any]) -> Dict[str, Any]:
        """Normalize categorical strings (e.g., land_use, property_status)."""
        if val is None:
            return {"original_value": None, "normalized_value": "Unspecified"}
        raw_str = str(val)
        lower_str = raw_str.strip().lower()
        
        normalized = CATEGORICAL_MAP.get(lower_str, raw_str.strip().title())
        return {
            "original_value": raw_str,
            "normalized_value": normalized
        }

    @staticmethod
    def normalize_numeric(val: Optional[Any], round_digits: int = 2) -> Dict[str, Any]:
        """Normalize numeric floats and integers."""
        if val is None:
            return {"original_value": None, "normalized_value": None}
        try:
            num = float(val)
            norm = round(num, round_digits) if round_digits >= 0 else num
            return {
                "original_value": val,
                "normalized_value": norm
            }
        except Exception:
            return {"original_value": val, "normalized_value": None}

    @staticmethod
    def normalize_feature_attributes(props: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processes a full properties dict, returning a dual dict containing:
        - raw_properties: original properties
        - normalized_properties: normalized properties
        """
        normalized = {}
        for k, v in props.items():
            k_lower = k.lower().strip()
            if k_lower in ["land_use", "landuse", "status", "property_status", "owner", "ownership"]:
                normalized[k] = AttributeNormalizer.normalize_category(v)["normalized_value"]
            elif isinstance(v, (int, float)):
                normalized[k] = AttributeNormalizer.normalize_numeric(v)["normalized_value"]
            elif isinstance(v, str):
                normalized[k] = AttributeNormalizer.normalize_string(v)["normalized_value"]
            else:
                normalized[k] = v
                
        return {
            "original_attributes": props,
            "normalized_attributes": normalized
        }
