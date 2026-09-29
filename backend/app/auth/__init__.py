"""
BHOO-MITRA AI — Authentication & Authorization (RBAC) Package
"""

from app.auth.service import AuthService
from app.auth.security import hash_password, verify_password, create_access_token, decode_access_token
from app.auth.permissions import PERMISSIONS, ROLE_PERMISSIONS_MAP, get_permissions_for_roles
from app.auth.dependencies import get_current_user, require_permission, require_role

__all__ = [
    "AuthService",
    "hash_password",
    "verify_password",
    "create_access_token",
    "decode_access_token",
    "PERMISSIONS",
    "ROLE_PERMISSIONS_MAP",
    "get_permissions_for_roles",
    "get_current_user",
    "require_permission",
    "require_role",
]
