"""
BHOO-MITRA AI — Alembic Environment Configuration

Configures Alembic to:
  1. Use the DATABASE_URL from app settings
  2. Import all SQLAlchemy models so autogenerate can detect schema changes
  3. Support both online (live DB) and offline (SQL script) migration modes
"""

from __future__ import annotations

import os
import sys
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from sqlalchemy import engine_from_config, pool

# ─── Add backend directory to sys.path ───────────────────────────────────────
# Allows importing app.* modules from within the alembic/ subdirectory
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

# ─── Import app settings & models ────────────────────────────────────────────
from app.core.config import settings  # noqa: E402
from app.db.base import Base  # noqa: E402

# Import all models so Alembic autogenerate can detect them
from app.models.source import DataSource, SourceAsset  # noqa: E402, F401
from app.models.entity import CanonicalEntity, EntityObservation  # noqa: E402, F401
from app.models.conflict import ConflictCase  # noqa: E402, F401
from app.models.evidence import Evidence  # noqa: E402, F401
from app.models.recommendation import Recommendation  # noqa: E402, F401
from app.models.verification import VerificationRecord  # noqa: E402, F401
from app.models.audit import AuditEvent  # noqa: E402, F401
from app.models.quality import QualitySignal  # noqa: E402, F401

# ─── Alembic Config ───────────────────────────────────────────────────────────
config = context.config

# Override sqlalchemy.url from environment / settings (never hardcode credentials)
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


# ─── Offline Migration ────────────────────────────────────────────────────────

def run_migrations_offline() -> None:
    """Generate a SQL script without connecting to the database."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


# ─── Online Migration ─────────────────────────────────────────────────────────

def run_migrations_online() -> None:
    """Run migrations against a live database connection."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
