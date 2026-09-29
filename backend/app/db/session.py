"""
BHOO-MITRA AI — FastAPI Database Session Dependency

Provides get_db() for use as a FastAPI Depends() injection into route handlers
that require a live SQLAlchemy Session.
"""

from __future__ import annotations

from typing import Generator

from sqlalchemy.orm import Session

from app.db.database import get_session_factory


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that yields a SQLAlchemy Session.

    Usage in routes:
        db: Session = Depends(get_db)

    If Postgres is unavailable the session factory will be None and this
    generator immediately raises RuntimeError — callers should use
    is_database_available() to guard accordingly.
    """
    factory = get_session_factory()
    if factory is None:
        raise RuntimeError("PostgreSQL is not available. REPOSITORY_MODE=mock is active.")
    session: Session = factory()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
