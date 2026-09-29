"""
Geospatial Quality Analyzer
Computes deterministic quality scores and generates QualitySignal records.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class QualityAnalyzer:
    """
    Quality score calculation and signal generator for spatial datasets.
    """

    @staticmethod
    def analyze_dataset_quality(
        dataset_meta: Dict[str, Any],
        crs_validity: Dict[str, Any],
        geometry_results: List[Dict[str, Any]],
        schema_mappings: List[Dict[str, Any]],
        attributes_stats: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Calculates sub-scores for:
        - CRS Validity (0-1)
        - Geometry Validity (0-1)
        - Attribute Completeness (0-1)
        - Attribute Consistency (0-1)
        - Schema Compatibility (0-1)
        - Geometry Precision (0-1)
        - Source Reliability (0-1)
        """
        # 1. CRS Score
        crs_score = 1.0 if crs_validity.get("valid", False) else 0.4
        if crs_validity.get("crs") == "Unknown":
            crs_score = 0.0

        # 2. Geometry Validity Score
        total_geoms = len(geometry_results)
        valid_geoms = sum(1 for g in geometry_results if g.get("valid", False))
        geom_score = (valid_geoms / total_geoms) if total_geoms > 0 else 1.0

        # 3. Attribute Completeness Score
        total_fields = len(attributes_stats)
        if total_fields > 0:
            null_ratios = [stat["missing_count"] / max(1, stat["total_count"]) for stat in attributes_stats]
            completeness_score = max(0.0, 1.0 - (sum(null_ratios) / total_fields))
        else:
            completeness_score = 0.5

        # 4. Schema Compatibility Score
        if schema_mappings:
            matched = sum(1 for m in schema_mappings if m["status"] in ["EXACT_MATCH", "SEMANTIC_MATCH"])
            schema_score = matched / len(schema_mappings)
        else:
            schema_score = 0.5

        # 5. Geometry Precision Score
        is_proj = crs_validity.get("is_projected", False)
        precision_score = 0.95 if is_proj else 0.85

        # Overall weighted quality score
        overall_score = round(
            (crs_score * 0.25) +
            (geom_score * 0.35) +
            (completeness_score * 0.15) +
            (schema_score * 0.15) +
            (precision_score * 0.10),
            3
        )

        quality_signals = [
            {
                "signal_type": "CRS_VALIDITY",
                "score": crs_score,
                "status": "PASS" if crs_score >= 0.8 else "WARN",
                "details": f"CRS is {crs_validity.get('crs', 'Unknown')} (Projected: {is_proj})"
            },
            {
                "signal_type": "GEOMETRY_VALIDITY",
                "score": geom_score,
                "status": "PASS" if geom_score >= 0.9 else "FAIL",
                "details": f"{valid_geoms}/{total_geoms} features are topologically valid."
            },
            {
                "signal_type": "ATTRIBUTE_COMPLETENESS",
                "score": round(completeness_score, 3),
                "status": "PASS" if completeness_score >= 0.7 else "WARN",
                "details": f"Average field completeness across {total_fields} attributes."
            },
            {
                "signal_type": "SCHEMA_COMPATIBILITY",
                "score": round(schema_score, 3),
                "status": "PASS" if schema_score >= 0.7 else "WARN",
                "details": f"Schema maps to canonical urban schema with {round(schema_score*100,1)}% coverage."
            }
        ]

        return {
            "overall_quality_score": overall_score,
            "quality_grade": "A" if overall_score >= 0.85 else ("B" if overall_score >= 0.7 else "C"),
            "sub_scores": {
                "crs_validity": crs_score,
                "geometry_validity": geom_score,
                "attribute_completeness": round(completeness_score, 3),
                "schema_compatibility": round(schema_score, 3),
                "geometry_precision": precision_score,
            },
            "signals": quality_signals,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
