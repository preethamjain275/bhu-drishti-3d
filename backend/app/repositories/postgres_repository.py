"""
BHOO-MITRA AI — PostgreSQL / PostGIS Repository Implementations

Concrete repository classes backed by SQLAlchemy 2.x + PostGIS.
Each class follows the same get_all / get_by_id / create / update / delete
contract as MockRepository so that services are interchangeable.

Geometry is stored as WKT (Well-Known Text) in the input dict and
converted to a GeoAlchemy2 WKTElement for persistence.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Callable, Dict, List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.repositories.base import BaseRepository

logger = logging.getLogger(__name__)


def _row_to_dict(row) -> Dict[str, Any]:
    """Convert a SQLAlchemy ORM instance to a plain dict, skipping internal SA attrs."""
    d: Dict[str, Any] = {}
    for col in row.__table__.columns:
        val = getattr(row, col.name)
        if isinstance(val, datetime):
            d[col.name] = val.isoformat()
        else:
            d[col.name] = val
    return d


# ─── Generic Postgres Repository ─────────────────────────────────────────────

class PostgresRepository(BaseRepository):
    """
    Generic SQLAlchemy-backed repository for any ORM model class.

    model_class: SQLAlchemy ORM model (e.g. DataSource)
    id_field:    primary-key column name (default "id")
    session:     live SQLAlchemy Session
    """

    def __init__(self, session: Session, model_class, id_field: str = "id"):
        self.session = session
        self.model_class = model_class
        self.id_field = id_field

    def get_all(
        self,
        filter_fn: Optional[Callable[[Dict[str, Any]], bool]] = None,
    ) -> List[Dict[str, Any]]:
        rows = self.session.execute(select(self.model_class)).scalars().all()
        dicts = [_row_to_dict(r) for r in rows]
        if filter_fn:
            dicts = [d for d in dicts if filter_fn(d)]
        return dicts

    def get_by_id(self, item_id: str) -> Optional[Dict[str, Any]]:
        row = self.session.get(self.model_class, item_id)
        return _row_to_dict(row) if row else None

    def create(self, item: Dict[str, Any]) -> Dict[str, Any]:
        # Remove geometry key — handled by specialised subclasses
        data = {k: v for k, v in item.items() if k != "geometry"}
        instance = self.model_class(**data)
        self.session.add(instance)
        self.session.flush()
        return _row_to_dict(instance)

    def update(self, item_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        row = self.session.get(self.model_class, item_id)
        if not row:
            return None
        for key, val in updates.items():
            if hasattr(row, key):
                setattr(row, key, val)
        if hasattr(row, "updated_at"):
            row.updated_at = datetime.now(timezone.utc)
        self.session.flush()
        return _row_to_dict(row)

    def delete(self, item_id: str) -> bool:
        row = self.session.get(self.model_class, item_id)
        if not row:
            return False
        self.session.delete(row)
        self.session.flush()
        return True


# ─── Specialised Repositories ─────────────────────────────────────────────────

class DataSourceRepository(PostgresRepository):
    """PostgreSQL-backed DataSource repository."""

    def __init__(self, session: Session):
        from app.models.source import DataSource
        super().__init__(session, DataSource, id_field="id")


class SourceAssetRepository(PostgresRepository):
    """PostgreSQL-backed SourceAsset repository."""

    def __init__(self, session: Session):
        from app.models.source import SourceAsset
        super().__init__(session, SourceAsset, id_field="id")


class CanonicalEntityRepository(PostgresRepository):
    """PostgreSQL-backed CanonicalEntity repository with geometry support."""

    def __init__(self, session: Session):
        from app.models.entity import CanonicalEntity
        super().__init__(session, CanonicalEntity, id_field="id")

    def create(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Override to handle PostGIS geometry column."""
        from geoalchemy2 import WKTElement
        from app.models.entity import CanonicalEntity, DEMO_SRID

        data = dict(item)
        geom_wkt = data.pop("geometry", None)

        instance = CanonicalEntity(**data)
        if geom_wkt:
            try:
                instance.geometry = WKTElement(geom_wkt, srid=DEMO_SRID)
            except Exception as exc:
                logger.warning("Geometry rejected — invalid WKT: %s", exc)
                # Do NOT silently fix geometry; leave as None
        self.session.add(instance)
        self.session.flush()
        return _row_to_dict(instance)


class EntityObservationRepository(PostgresRepository):
    """PostgreSQL-backed EntityObservation repository with geometry support."""

    def __init__(self, session: Session):
        from app.models.entity import EntityObservation
        super().__init__(session, EntityObservation, id_field="id")

    def create(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Override to handle PostGIS geometry column."""
        from geoalchemy2 import WKTElement
        from app.models.entity import EntityObservation, DEMO_SRID

        data = dict(item)
        geom_wkt = data.pop("geometry", None)

        instance = EntityObservation(**data)
        if geom_wkt:
            try:
                instance.geometry = WKTElement(geom_wkt, srid=DEMO_SRID)
            except Exception as exc:
                logger.warning("Observation geometry rejected — invalid WKT: %s", exc)
        self.session.add(instance)
        self.session.flush()
        return _row_to_dict(instance)


class ConflictRepository(PostgresRepository):
    def __init__(self, session: Session):
        from app.models.conflict import ConflictCase
        super().__init__(session, ConflictCase, id_field="id")


class EvidenceRepository(PostgresRepository):
    def __init__(self, session: Session):
        from app.models.evidence import Evidence
        super().__init__(session, Evidence, id_field="id")


class RecommendationRepository(PostgresRepository):
    def __init__(self, session: Session):
        from app.models.recommendation import Recommendation
        super().__init__(session, Recommendation, id_field="id")


class VerificationRepository(PostgresRepository):
    def __init__(self, session: Session):
        from app.models.verification import VerificationRecord
        super().__init__(session, VerificationRecord, id_field="id")


class AuditRepository(PostgresRepository):
    """
    Postgres-backed AuditEvent repository.

    NOTE: update() and delete() are intentionally disabled for audit records.
    All audit activity must be captured via create() only.
    """

    def __init__(self, session: Session):
        from app.models.audit import AuditEvent
        super().__init__(session, AuditEvent, id_field="id")

    def update(self, item_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        raise RuntimeError(
            "AuditEvent records are append-only and must never be updated. "
            "Create a new event instead."
        )

    def delete(self, item_id: str) -> bool:
        raise RuntimeError(
            "AuditEvent records are append-only and must never be deleted."
        )


class QualitySignalRepository(PostgresRepository):
    def __init__(self, session: Session):
        from app.models.quality import QualitySignal
        super().__init__(session, QualitySignal, id_field="id")
