"""
BHOO-MITRA AI — Database Engine & Session Factory

Creates the SQLAlchemy async-compatible synchronous engine and session factory.
Falls back gracefully when PostgreSQL is unavailable.
"""

from __future__ import annotations

import logging
from typing import Optional

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import OperationalError

from app.core.config import settings

logger = logging.getLogger(__name__)

# ─── Engine ──────────────────────────────────────────────────────────────────

def _build_engine():
    try:
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
            connect_args={},
        )
        # Quick connectivity test
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("PostgreSQL engine created and verified — %s", settings.DATABASE_URL.split("@")[-1])
        return engine
    except Exception as exc:
        logger.warning("PostgreSQL unavailable (%s). Falling back to DEMO MODE.", str(exc))
        return None


# Module-level engine — None if Postgres is unavailable
_engine = None
_SessionLocal: Optional[sessionmaker] = None


def get_engine():
    """Return the SQLAlchemy engine, lazily initialising on first call."""
    global _engine, _SessionLocal
    if _engine is None and settings.REPOSITORY_MODE == "postgres":
        _engine = _build_engine()
        if _engine is not None:
            _SessionLocal = sessionmaker(bind=_engine, autoflush=False, autocommit=False)
    return _engine


def is_database_available() -> bool:
    """Return True when a working PostgreSQL engine exists."""
    return get_engine() is not None


def is_postgis_enabled() -> bool:
    """Return True when the PostGIS extension is enabled in the connected database."""
    engine = get_engine()
    if engine is None:
        return False
    try:
        with engine.connect() as conn:
            result = conn.execute(
                text("SELECT COUNT(*) FROM pg_extension WHERE extname = 'postgis'")
            )
            return result.scalar() > 0  # type: ignore[operator]
    except Exception:
        return False


def get_session_factory() -> Optional[sessionmaker]:
    """Return the sessionmaker if Postgres is available, else None."""
    get_engine()
    return _SessionLocal
