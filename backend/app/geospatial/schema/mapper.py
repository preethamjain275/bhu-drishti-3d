"""
Schema Mapper
Inspects raw vector attributes, extracts structured schema info, and maps fields to the Canonical Urban Schema.
"""

from typing import Dict, Any, List, Optional

CANONICAL_FIELDS = [
    {"name": "canonical_entity_id", "type": "string", "description": "Global unique entity identifier"},
    {"name": "canonical_parcel_id", "type": "string", "description": "Standard parcel identifier (e.g. PRCL-101)"},
    {"name": "land_use", "type": "string", "description": "Standardized land use category"},
    {"name": "property_status", "type": "string", "description": "Legal / operational status"},
    {"name": "area", "type": "float", "description": "Parcel area in sq. meters"},
    {"name": "perimeter", "type": "float", "description": "Parcel perimeter in meters"},
    {"name": "owner_category", "type": "string", "description": "Owner classification (Govt, Private, BBMP)"},
    {"name": "building_count", "type": "integer", "description": "Number of structures"},
    {"name": "observation_date", "type": "date", "description": "Date of observation / survey"},
    {"name": "source_count", "type": "integer", "description": "Count of contributing sources"},
    {"name": "geometry_source", "type": "string", "description": "Primary spatial asset provenance"},
    {"name": "quality_score", "type": "float", "description": "Confidence / quality index"},
]

# Deterministic alias mapping rules
FIELD_ALIASES = {
    "canonical_parcel_id": ["parcel_id", "survey_parcel_id", "katha_no", "plot_id", "pid", "survey_no", "cadastral_id", "id"],
    "land_use": ["landuse", "land_use", "usage", "zone", "zoning", "category"],
    "property_status": ["status", "prop_status", "legal_status", "state"],
    "area": ["survey_area", "gis_area", "shape_area", "area_sqm", "extent", "area"],
    "perimeter": ["shape_len", "perimeter", "boundary_length", "perim"],
    "owner_category": ["owner", "ownership", "holder", "claimant", "category"],
    "building_count": ["buildings", "bldg_count", "structures", "structures_count"],
    "observation_date": ["survey_date", "obs_date", "date", "updated_at", "last_survey"],
}

class SchemaMapper:
    """
    Deterministic schema inspector and canonical field mapper.
    """

    @staticmethod
    def inspect_attributes(features: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Inspect attribute fields from feature list: field name, field type, sample values, unique count, missing count.
        """
        if not features:
            return []
            
        field_stats: Dict[str, Dict[str, Any]] = {}
        total_count = len(features)
        
        for feat in features:
            props = feat.get("properties", {}) or {}
            for key, val in props.items():
                if key not in field_stats:
                    field_stats[key] = {
                        "name": key,
                        "values": [],
                        "types": set(),
                        "missing_count": 0
                    }
                    
                if val is None or val == "":
                    field_stats[key]["missing_count"] += 1
                else:
                    field_stats[key]["values"].append(val)
                    field_stats[key]["types"].add(type(val).__name__)

        results = []
        for key, stats in field_stats.items():
            vals = stats["values"]
            unique_vals = list(set(vals))
            samples = unique_vals[:3]
            
            # infer primary type
            types_list = list(stats["types"])
            primary_type = types_list[0] if types_list else "string"
            if "float" in types_list:
                primary_type = "float"
            elif "int" in types_list and len(types_list) == 1:
                primary_type = "integer"
                
            results.append({
                "field_name": key,
                "field_type": primary_type,
                "nullable": stats["missing_count"] > 0,
                "sample_values": samples,
                "unique_count": len(unique_vals),
                "missing_count": stats["missing_count"],
                "total_count": total_count
            })
            
        return results

    @staticmethod
    def map_to_canonical(source_fields: List[str]) -> List[Dict[str, Any]]:
        """
        Deterministically maps source attribute field names to canonical urban schema fields.
        """
        mappings = []
        mapped_source_fields = set()
        
        for can_field in CANONICAL_FIELDS:
            can_name = can_field["name"]
            aliases = FIELD_ALIASES.get(can_name, [can_name])
            
            matched_source = None
            confidence = 0.0
            
            for src in source_fields:
                src_lower = src.lower().strip()
                if src_lower == can_name:
                    matched_source = src
                    confidence = 1.0
                    break
                elif src_lower in aliases:
                    matched_source = src
                    confidence = 0.9
                    break
                elif any(alias in src_lower for alias in aliases):
                    matched_source = src
                    confidence = 0.75
                    
            if matched_source:
                mapped_source_fields.add(matched_source)
                
            mappings.append({
                "canonical_field": can_name,
                "target_type": can_field["type"],
                "source_field": matched_source,
                "confidence": confidence,
                "status": "EXACT_MATCH" if confidence == 1.0 else ("SEMANTIC_MATCH" if confidence >= 0.75 else "UNMAPPED")
            })
            
        return mappings
