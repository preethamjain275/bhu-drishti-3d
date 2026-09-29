"""
CRS Validator
Validates CRS definitions and compatibility.
"""

from typing import Dict, Any
from app.geospatial.crs.detector import CRSDetector

class CRSValidator:
    """
    Validator for Coordinate Reference Systems.
    """

    @staticmethod
    def validate_crs(crs_input: Any) -> Dict[str, Any]:
        """
        Validate CRS input and return structured evaluation.
        """
        detected = CRSDetector.detect_crs(crs_input)
        
        if detected["crs"] == "Unknown":
            return {
                "valid": False,
                "crs": "Unknown",
                "issues": ["CRS information is missing or unrecognized. Data review required before reprojection."],
                "requires_review": True
            }
            
        return {
            "valid": True,
            "crs": detected["crs"],
            "is_projected": detected["is_projected"],
            "unit": detected["unit"],
            "issues": [],
            "requires_review": False
        }
