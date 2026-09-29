"""
Role and Permission Definitions Matrix
Defines explicit granular permissions and role-to-permission maps for BHOO-MITRA AI.
"""

from typing import Dict, List, Set

# Granular Permission Constants
PERMISSIONS = {
    # Sources
    "SOURCES_READ": "sources.read",
    "SOURCES_CREATE": "sources.create",
    "SOURCES_UPDATE": "sources.update",
    "SOURCES_DELETE": "sources.delete",
    
    # Ingestion & Harmonization
    "INGESTION_READ": "ingestion.read",
    "INGESTION_RUN": "ingestion.run",
    "HARMONIZATION_READ": "harmonization.read",
    "HARMONIZATION_RUN": "harmonization.run",
    
    # Entities
    "ENTITIES_READ": "entities.read",
    "ENTITIES_MATCH": "entities.match",
    
    # Conflicts
    "CONFLICTS_READ": "conflicts.read",
    "CONFLICTS_INVESTIGATE": "conflicts.investigate",
    "CONFLICTS_UPDATE": "conflicts.update",
    
    # Evidence & Recommendations
    "EVIDENCE_READ": "evidence.read",
    "EVIDENCE_CREATE": "evidence.create",
    "RECOMMENDATIONS_READ": "recommendations.read",
    "RECOMMENDATIONS_GENERATE": "recommendations.generate",
    
    # Verification
    "VERIFICATION_READ": "verification.read",
    "VERIFICATION_DECIDE": "verification.decide",
    
    # Audit
    "AUDIT_READ": "audit.read",
    "AUDIT_EXPORT": "audit.export",
    
    # User & System Admin
    "USERS_READ": "users.read",
    "USERS_CREATE": "users.create",
    "USERS_UPDATE": "users.update",
    "USERS_DELETE": "users.delete",
    "SETTINGS_READ": "settings.read",
    "SETTINGS_UPDATE": "settings.update",
}

ALL_PERMISSIONS = list(PERMISSIONS.values())

# Role -> Permission Mapping Matrix
ROLE_PERMISSIONS_MAP: Dict[str, List[str]] = {
    "ADMIN": ALL_PERMISSIONS,
    
    "DATA_OFFICER": [
        "sources.read", "sources.create", "sources.update", "sources.delete",
        "ingestion.read", "ingestion.run",
        "harmonization.read", "harmonization.run",
        "entities.read",
        "conflicts.read",
        "evidence.read",
        "audit.read",
    ],
    
    "GIS_ANALYST": [
        "sources.read",
        "ingestion.read",
        "harmonization.read",
        "entities.read", "entities.match",
        "conflicts.read", "conflicts.investigate",
        "evidence.read", "evidence.create",
        "recommendations.read", "recommendations.generate",
        "audit.read",
    ],
    
    "REVIEWER": [
        "sources.read",
        "entities.read",
        "conflicts.read", "conflicts.investigate", "conflicts.update",
        "evidence.read", "evidence.create",
        "recommendations.read", "recommendations.generate",
        "verification.read", "verification.decide",
        "audit.read",
    ],
    
    "AUDITOR": [
        "sources.read",
        "entities.read",
        "conflicts.read",
        "evidence.read",
        "recommendations.read",
        "verification.read",
        "audit.read", "audit.export",
    ],
    
    "VIEWER": [
        "sources.read",
        "entities.read",
        "conflicts.read",
        "evidence.read",
        "recommendations.read",
        "verification.read",
        "audit.read",
    ],
}

def get_permissions_for_roles(roles: List[str]) -> Set[str]:
    """Returns set of all permission strings granted to a list of role names."""
    perms = set()
    for role in roles:
        role_upper = role.upper()
        if role_upper in ROLE_PERMISSIONS_MAP:
            perms.update(ROLE_PERMISSIONS_MAP[role_upper])
    return perms
