"""
Authentication REST API Router
FastAPI endpoints for login, user session verification (me), logout, and user/role administration.
"""

from fastapi import APIRouter, HTTPException, Depends, status, Request
from typing import Dict, Any, List

from app.schemas.auth import LoginRequest, LoginResponseData, UserCreateRequest, UserUpdateRequest
from app.schemas.response import StandardResponse, ListResponse
from app.auth.service import AuthService
from app.auth.dependencies import get_current_user, require_permission, require_role
from app.auth.permissions import ROLE_PERMISSIONS_MAP, ALL_PERMISSIONS
from app.services.audit_service import AuditService

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])
audit_service = AuditService()

@router.post("/login", response_model=StandardResponse[LoginResponseData])
def login(req: LoginRequest, request: Request):
    """
    Authenticate user credentials and return JWT access token.
    Never returns password hashes.
    """
    user_payload = AuthService.authenticate_user(req.email, req.password)
    if not user_payload:
        # Audit login failure
        try:
            audit_service.record_event(
                actor_id="UNAUTHENTICATED",
                actor_name=req.email,
                actor_role="GUEST",
                action="LOGIN_FAILED",
                module="Authentication",
                reason=f"Failed login attempt for email '{req.email}'",
                metadata={"ip": request.client.host if request.client else "unknown"}
            )
        except Exception:
            pass
            
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/username or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    response_data = AuthService.create_login_response(user_payload)
    
    # Audit login success
    try:
        audit_service.record_event(
            actor_id=user_payload["id"],
            actor_name=user_payload["full_name"],
            actor_role=", ".join(user_payload["roles"]),
            action="LOGIN_SUCCESS",
            module="Authentication",
            reason=f"User '{user_payload['full_name']}' logged in successfully.",
            metadata={"ip": request.client.host if request.client else "unknown"}
        )
    except Exception:
        pass

    return StandardResponse(
        success=True,
        data=response_data,
        message="Authentication successful."
    )


@router.get("/me", response_model=StandardResponse[Dict[str, Any]])
def get_current_user_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Returns current authenticated user details, roles, permissions, and status.
    """
    return StandardResponse(
        success=True,
        data=current_user,
        message="Current authenticated user session retrieved."
    )


@router.post("/logout", response_model=StandardResponse[Dict[str, str]])
def logout(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Logs out the current authenticated user and records audit trail event.
    """
    try:
        audit_service.record_event(
            actor_id=current_user["id"],
            actor_name=current_user["full_name"],
            actor_role=", ".join(current_user.get("roles", [])),
            action="LOGOUT",
            module="Authentication",
            reason=f"User '{current_user['full_name']}' logged out.",
        )
    except Exception:
        pass

    return StandardResponse(
        success=True,
        data={"status": "logged_out"},
        message="Session closed successfully."
    )


@router.get("/users", response_model=ListResponse[Dict[str, Any]])
def list_users(current_user: Dict[str, Any] = Depends(require_permission("users.read"))):
    """
    List all system users and their assigned roles/permissions. (Requires users.read permission)
    """
    users = AuthService.list_all_users()
    return ListResponse(
        success=True,
        data=users,
        total=len(users),
        message="Users retrieved successfully."
    )


@router.post("/users", response_model=StandardResponse[Dict[str, Any]])
def create_user(
    req: UserCreateRequest,
    current_user: Dict[str, Any] = Depends(require_permission("users.create"))
):
    """
    Creates a new system user. (Requires users.create permission)
    """
    try:
        new_user = AuthService.create_user(
            username=req.username,
            email=req.email,
            full_name=req.full_name,
            password=req.password,
            roles=req.roles
        )
        
        try:
            audit_service.record_event(
                actor_id=current_user["id"],
                actor_name=current_user["full_name"],
                actor_role=", ".join(current_user.get("roles", [])),
                action="USER_CREATED",
                module="User Management",
                reason=f"Created user '{new_user['full_name']}' ({new_user['email']}) with roles {new_user['roles']}.",
            )
        except Exception:
            pass

        return StandardResponse(
            success=True,
            data=new_user,
            message="User created successfully."
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/users/{user_id}", response_model=StandardResponse[Dict[str, Any]])
def update_user(
    user_id: str,
    req: UserUpdateRequest,
    current_user: Dict[str, Any] = Depends(require_permission("users.update"))
):
    """
    Updates user active status or assigned roles. (Requires users.update permission)
    """
    user = AuthService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{user_id}' not found.")

    if req.is_active is not None:
        user = AuthService.toggle_user_active(user_id, req.is_active)

    try:
        audit_service.record_event(
            actor_id=current_user["id"],
            actor_name=current_user["full_name"],
            actor_role=", ".join(current_user.get("roles", [])),
            action="USER_UPDATED",
            module="User Management",
            reason=f"Updated user status/roles for '{user_id}'.",
        )
    except Exception:
        pass

    return StandardResponse(
        success=True,
        data=user,
        message="User updated successfully."
    )


@router.get("/roles", response_model=StandardResponse[Dict[str, Any]])
def list_roles(current_user: Dict[str, Any] = Depends(require_permission("users.read"))):
    """
    Lists system roles and their granted permissions matrix.
    """
    return StandardResponse(
        success=True,
        data={
            "roles": list(ROLE_PERMISSIONS_MAP.keys()),
            "permissions_matrix": ROLE_PERMISSIONS_MAP,
            "all_permissions": ALL_PERMISSIONS
        },
        message="System roles and permissions matrix retrieved."
    )
