"""
Authentication Service
Handles user authentication, token issuance, user profile fetching, demo mode fallback, and user management.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.auth.security import hash_password, verify_password, create_access_token, decode_access_token
from app.auth.permissions import get_permissions_for_roles, ROLE_PERMISSIONS_MAP

# Synthetic Demo User Accounts Registry
DEMO_USERS = {
    "admin@bhoomitra.demo": {
        "id": "USR-DEMO-ADMIN",
        "username": "admin.demo",
        "email": "admin@bhoomitra.demo",
        "full_name": "Rajesh Kumar (Admin)",
        "password_hash": hash_password("demo123"),
        "roles": ["ADMIN"],
        "is_active": True,
    },
    "data.officer@bhoomitra.demo": {
        "id": "USR-DEMO-DATA",
        "username": "data.officer.demo",
        "email": "data.officer@bhoomitra.demo",
        "full_name": "Priya Sharma (Data Officer)",
        "password_hash": hash_password("demo123"),
        "roles": ["DATA_OFFICER"],
        "is_active": True,
    },
    "analyst@bhoomitra.demo": {
        "id": "USR-DEMO-ANALYST",
        "username": "analyst.demo",
        "email": "analyst@bhoomitra.demo",
        "full_name": "Arun Patel (GIS Analyst)",
        "password_hash": hash_password("demo123"),
        "roles": ["GIS_ANALYST"],
        "is_active": True,
    },
    "reviewer@bhoomitra.demo": {
        "id": "USR-DEMO-REVIEWER",
        "username": "reviewer.demo",
        "email": "reviewer@bhoomitra.demo",
        "full_name": "Sunita Rao (Senior Reviewer)",
        "password_hash": hash_password("demo123"),
        "roles": ["REVIEWER"],
        "is_active": True,
    },
    "auditor@bhoomitra.demo": {
        "id": "USR-DEMO-AUDITOR",
        "username": "auditor.demo",
        "email": "auditor@bhoomitra.demo",
        "full_name": "Vikram Singh (Chief Auditor)",
        "password_hash": hash_password("demo123"),
        "roles": ["AUDITOR"],
        "is_active": True,
    },
    "viewer@bhoomitra.demo": {
        "id": "USR-DEMO-VIEWER",
        "username": "viewer.demo",
        "email": "viewer@bhoomitra.demo",
        "full_name": "Public Viewer",
        "password_hash": hash_password("demo123"),
        "roles": ["VIEWER"],
        "is_active": True,
    },
}

# User memory store for created demo/dev users
USERS_STORE: Dict[str, Dict[str, Any]] = DEMO_USERS.copy()

class AuthService:
    """
    Core Service handling authentication and authorization resolution.
    """

    @staticmethod
    def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticates user credentials and returns safe user profile dict."""
        user = USERS_STORE.get(email.lower().strip())
        if not user:
            # Fallback search by username
            for u in USERS_STORE.values():
                if u["username"].lower() == email.lower().strip():
                    user = u
                    break

        if not user:
            return None

        if not user.get("is_active", True):
            return None

        if not verify_password(password, user["password_hash"]):
            return None

        user["last_login_at"] = datetime.now(timezone.utc).isoformat()
        return AuthService._build_user_payload(user)

    @staticmethod
    def create_login_response(user_payload: Dict[str, Any]) -> Dict[str, Any]:
        """Generates JWT token and login response payload."""
        token_data = {
            "sub": user_payload["id"],
            "email": user_payload["email"],
            "roles": user_payload["roles"],
        }
        token = create_access_token(token_data)
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user_payload
        }

    @staticmethod
    def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        """Returns safe user dict by user_id."""
        for user in USERS_STORE.values():
            if user["id"] == user_id:
                return AuthService._build_user_payload(user)
        return None

    @staticmethod
    def get_user_by_token(token: str) -> Optional[Dict[str, Any]]:
        """Validates token and returns authenticated user payload."""
        payload = decode_access_token(token)
        if not payload:
            return None
        return AuthService.get_user_by_id(payload.get("sub", ""))

    @staticmethod
    def list_all_users() -> List[Dict[str, Any]]:
        """Lists all registered system users (for Admin dashboard)."""
        return [AuthService._build_user_payload(u) for u in USERS_STORE.values()]

    @staticmethod
    def create_user(username: str, email: str, full_name: str, password: str, roles: List[str]) -> Dict[str, Any]:
        """Creates a new user account."""
        email_clean = email.lower().strip()
        if email_clean in USERS_STORE:
            raise ValueError(f"User with email '{email_clean}' already exists.")

        user_id = f"USR-{len(USERS_STORE) + 1:04d}"
        new_user = {
            "id": user_id,
            "username": username.strip(),
            "email": email_clean,
            "full_name": full_name.strip(),
            "password_hash": hash_password(password),
            "roles": roles if roles else ["VIEWER"],
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_login_at": None,
        }
        USERS_STORE[email_clean] = new_user
        return AuthService._build_user_payload(new_user)

    @staticmethod
    def toggle_user_active(user_id: str, is_active: bool) -> Optional[Dict[str, Any]]:
        """Activates or deactivates a user account."""
        for user in USERS_STORE.values():
            if user["id"] == user_id:
                user["is_active"] = is_active
                return AuthService._build_user_payload(user)
        return None

    @staticmethod
    def _build_user_payload(user: Dict[str, Any]) -> Dict[str, Any]:
        roles = user.get("roles", ["VIEWER"])
        perms = list(get_permissions_for_roles(roles))
        
        return {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "full_name": user["full_name"],
            "is_active": user.get("is_active", True),
            "roles": roles,
            "permissions": perms,
            "created_at": user.get("created_at"),
            "last_login_at": user.get("last_login_at"),
        }
