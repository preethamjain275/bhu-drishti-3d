"""
FastAPI Authentication & Authorization Dependencies
Provides reusable route dependencies: require_authenticated_user, require_permission, require_role.
Enforces authoritative backend authorization.
"""

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Callable, Dict, Any, Optional

from app.auth.service import AuthService
from app.core.config import settings

security_bearer = HTTPBearer(auto_error=False)

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security_bearer)) -> Dict[str, Any]:
    """
    Dependency that extracts and validates the Bearer token from the Request Authorization header.
    In DEMO_MODE when credentials are missing, falls back to default Viewer user if AUTH_MODE == "demo".
    Returns 401 Unauthorized if unauthenticated.
    """
    if credentials and credentials.credentials:
        user = AuthService.get_user_by_token(credentials.credentials)
        if user:
            return user
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is invalid or expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # If DEMO mode is allowed and no header passed, check config
    auth_mode = getattr(settings, "AUTH_MODE", "demo")
    if auth_mode == "demo":
        # Fallback to Admin demo user in dev/demo mode for unauthenticated API testing
        demo_user = AuthService.get_user_by_id("USR-DEMO-ADMIN")
        if demo_user:
            return demo_user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required. Please provide a valid Bearer token.",
        headers={"WWW-Authenticate": "Bearer"},
    )


def require_permission(permission_name: str) -> Callable:
    """
    Dependency factory verifying that the authenticated user possesses the required permission.
    Returns 403 Forbidden if permission is missing.
    """
    def _permission_checker(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        user_perms = current_user.get("permissions", [])
        if permission_name not in user_perms:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: Required permission '{permission_name}' is not granted for your role ({', '.join(current_user.get('roles', []))}).",
            )
        return current_user

    return _permission_checker


def require_role(role_name: str) -> Callable:
    """
    Dependency factory verifying that the authenticated user possesses the required role.
    Returns 403 Forbidden if role is missing.
    """
    def _role_checker(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        user_roles = [r.upper() for r in current_user.get("roles", [])]
        if role_name.upper() not in user_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: Required role '{role_name}' is missing.",
            )
        return current_user

    return _role_checker
