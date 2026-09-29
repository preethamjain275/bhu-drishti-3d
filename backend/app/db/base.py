"""
BHOO-MITRA AI — SQLAlchemy Declarative Base

All ORM models inherit from this Base so that Alembic can discover them
automatically for migration generation.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Single declarative base used by all BHOO-MITRA AI ORM models."""
    pass
