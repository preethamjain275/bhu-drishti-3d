"""
BHOO-MITRA AI — SQLAlchemy Model: Evidence

Evidence represents provenance-anchored facts used to support or challenge
conflict resolution recommendations. Source lineage is fully preserved.
All records marked is_synthetic_demo = True are SYNTHETIC DEMO DATA.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    String,
    Float,
    DateTime,
    ForeignKey,
    CheckConstraint,
    Text,
    JSON,
    Boolean,
)
from sqlalchemy.orm import relationship, validates

from app.db.base import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Evidence(Base):
    """
    A single provenance-anchored evidence item.

    confidence:  0–100  (how certain is this evidence item)
    reliability: 0–100  (source-level reliability at time of capture)
    """

    __tablename__ = "evidence"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))

    conflict_id = Column(
        String(64),
        ForeignKey("conflict_cases.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    entity_id = Column(
        String(64),
        ForeignKey("canonical_entities.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    source_id = Column(
        String(64),
        ForeignKey("data_sources.id", ondelete="SET NULL"),
        nullable=True,
    )
    observation_id = Column(
        String(64),
        ForeignKey("entity_observations.id", ondelete="SET NULL"),
        nullable=True,
    )

    evidence_type = Column(String(128), nullable=True)    # "Geometry Observation" | "Conveyance Deed Record" | …
    title = Column(String(512), nullable=True)
    description = Column(Text, nullable=True)
    source_name = Column(String(256), nullable=True)

    confidence = Column(Float, nullable=True)   # 0–100
    reliability = Column(Float, nullable=True)  # 0–100

    timestamp = Column(DateTime(timezone=True), nullable=True)

    evidence_metadata = Column(JSON, nullable=True)     # e.g. {"area_sqm": 2430, "crs": "EPSG:4326"}

    is_synthetic_demo = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow)

    # Relationships
    conflict = relationship("ConflictCase", back_populates="evidence")
    entity = relationship("CanonicalEntity", back_populates="evidence")
    source = relationship("DataSource", back_populates="evidence")
    observation = relationship("EntityObservation", back_populates="evidence")

    __table_args__ = (
        CheckConstraint(
            "confidence IS NULL OR (confidence >= 0 AND confidence <= 100)",
            name="ck_evidence_confidence_range",
        ),
        CheckConstraint(
            "reliability IS NULL OR (reliability >= 0 AND reliability <= 100)",
            name="ck_evidence_reliability_range",
        ),
    )

    def __repr__(self) -> str:
        return f"<Evidence id={self.id!r} type={self.evidence_type!r}>"
