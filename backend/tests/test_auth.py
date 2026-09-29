"""
BHOO-MITRA AI — Authentication & Authorization (RBAC) Unit & API Security Tests
"""

import pytest
from app.auth.service import AuthService
from app.auth.security import create_access_token, decode_access_token, hash_password, verify_password
from app.auth.permissions import get_permissions_for_roles, ROLE_PERMISSIONS_MAP

# ── 1. Security & Hashing Tests ──────────────────────────────────────────────

def test_password_hashing():
    pwd = "SecretGovPassword2026"
    hashed = hash_password(pwd)
    assert hashed != pwd
    assert verify_password(pwd, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_creation_and_decoding():
    payload = {"sub": "USR-101", "email": "analyst@bhoomitra.demo", "roles": ["GIS_ANALYST"]}
    token = create_access_token(payload)
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "USR-101"
    assert decoded["email"] == "analyst@bhoomitra.demo"
    assert decoded["roles"] == ["GIS_ANALYST"]

def test_jwt_invalid_token():
    invalid_token = "invalid.jwt.token"
    assert decode_access_token(invalid_token) is None

# ── 2. User Authentication Service Tests ──────────────────────────────────────

def test_demo_user_logins():
    # Valid Admin Login
    admin_user = AuthService.authenticate_user("admin@bhoomitra.demo", "demo123")
    assert admin_user is not None
    assert admin_user["roles"] == ["ADMIN"]
    assert "users.read" in admin_user["permissions"]

    # Valid Reviewer Login
    reviewer = AuthService.authenticate_user("reviewer@bhoomitra.demo", "demo123")
    assert reviewer is not None
    assert reviewer["roles"] == ["REVIEWER"]
    assert "verification.decide" in reviewer["permissions"]

    # Invalid Password
    wrong_pwd = AuthService.authenticate_user("admin@bhoomitra.demo", "WrongPassword")
    assert wrong_pwd is None

    # Unknown User
    unknown = AuthService.authenticate_user("nonexistent@bhoomitra.demo", "demo123")
    assert unknown is None

# ── 3. Role & Permission Matrix Tests ────────────────────────────────────────

def test_rbac_permission_matrix():
    admin_perms = get_permissions_for_roles(["ADMIN"])
    assert "users.create" in admin_perms
    assert "verification.decide" in admin_perms

    viewer_perms = get_permissions_for_roles(["VIEWER"])
    assert "sources.read" in viewer_perms
    assert "verification.decide" not in viewer_perms
    assert "users.create" not in viewer_perms

    reviewer_perms = get_permissions_for_roles(["REVIEWER"])
    assert "verification.decide" in reviewer_perms
    assert "users.delete" not in reviewer_perms

    auditor_perms = get_permissions_for_roles(["AUDITOR"])
    assert "audit.read" in auditor_perms
    assert "audit.export" in auditor_perms
    assert "verification.decide" not in auditor_perms

# ── 4. User Management Tests ──────────────────────────────────────────────────

def test_user_creation():
    new_user = AuthService.create_user(
        username="new.analyst",
        email="new.analyst@bhoomitra.demo",
        full_name="New Analyst",
        password="password123",
        roles=["GIS_ANALYST"]
    )
    assert new_user["email"] == "new.analyst@bhoomitra.demo"
    assert "GIS_ANALYST" in new_user["roles"]
    assert "entities.match" in new_user["permissions"]

    # Authenticate newly created user
    auth_res = AuthService.authenticate_user("new.analyst@bhoomitra.demo", "password123")
    assert auth_res is not None
    assert auth_res["id"] == new_user["id"]
