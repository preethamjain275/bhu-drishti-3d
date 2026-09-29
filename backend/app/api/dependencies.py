"""
BHOO-MITRA AI — FastAPI Service Dependencies

Provides service instances to FastAPI route handlers.

Repository mode is selected via REPOSITORY_MODE in settings:
  postgres  →  SQLAlchemy / PostGIS backed services
  mock      →  Existing in-memory MockRepository (unchanged)

If REPOSITORY_MODE=postgres but the database is unavailable,
the system transparently falls back to MockRepository so the
frontend remains fully functional (Demo Mode).
"""

from __future__ import annotations

import logging

from app.core.config import settings
from app.db.database import is_database_available, get_session_factory

from app.services.source_service import SourceService
from app.services.ingestion_service import IngestionService
from app.services.entity_service import EntityService
from app.services.conflict_service import ConflictService
from app.services.evidence_service import EvidenceService
from app.services.recommendation_service import RecommendationService
from app.services.verification_service import VerificationService
from app.services.audit_service import AuditService

logger = logging.getLogger(__name__)


def _use_postgres() -> bool:
    """Return True when postgres mode is configured AND the DB is reachable."""
    return settings.REPOSITORY_MODE == "postgres" and is_database_available()


def _make_db_session():
    """Return a new Session or None."""
    factory = get_session_factory()
    return factory() if factory else None


# ─── Service factory helpers ──────────────────────────────────────────────────

def _source_service() -> SourceService:
    if _use_postgres():
        session = _make_db_session()
        return SourceService(session=session)
    return SourceService()


def _entity_service() -> EntityService:
    if _use_postgres():
        session = _make_db_session()
        return EntityService(session=session)
    return EntityService()


def _conflict_service() -> ConflictService:
    if _use_postgres():
        session = _make_db_session()
        return ConflictService(session=session)
    return ConflictService()


def _evidence_service() -> EvidenceService:
    if _use_postgres():
        session = _make_db_session()
        return EvidenceService(session=session)
    return EvidenceService()


def _recommendation_service() -> RecommendationService:
    if _use_postgres():
        session = _make_db_session()
        return RecommendationService(session=session)
    return RecommendationService()


def _verification_service() -> VerificationService:
    if _use_postgres():
        session = _make_db_session()
        return VerificationService(session=session)
    return VerificationService()


def _audit_service() -> AuditService:
    if _use_postgres():
        session = _make_db_session()
        return AuditService(session=session)
    return AuditService()


# Singleton services for simple mock mode
_mock_source_service = SourceService()
_mock_ingestion_service = IngestionService()
_mock_entity_service = EntityService()
_mock_conflict_service = ConflictService()
_mock_evidence_service = EvidenceService()
_mock_recommendation_service = RecommendationService()
_mock_verification_service = VerificationService()
_mock_audit_service = AuditService()


# ─── FastAPI Depends callables ─────────────────────────────────────────────────

def get_source_service() -> SourceService:
    if _use_postgres():
        return _source_service()
    return _mock_source_service


def get_ingestion_service() -> IngestionService:
    # Ingestion stays mock for now (file processing is a later phase)
    return _mock_ingestion_service


def get_entity_service() -> EntityService:
    if _use_postgres():
        return _entity_service()
    return _mock_entity_service


def get_conflict_service() -> ConflictService:
    if _use_postgres():
        return _conflict_service()
    return _mock_conflict_service


def get_evidence_service() -> EvidenceService:
    if _use_postgres():
        return _evidence_service()
    return _mock_evidence_service


def get_recommendation_service() -> RecommendationService:
    if _use_postgres():
        return _recommendation_service()
    return _mock_recommendation_service


def get_verification_service() -> VerificationService:
    if _use_postgres():
        return _verification_service()
    return _mock_verification_service


def get_audit_service() -> AuditService:
    if _use_postgres():
        return _audit_service()
    return _mock_audit_service
