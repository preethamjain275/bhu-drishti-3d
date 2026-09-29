"""
BHOO-MITRA AI — SQLAlchemy Model: QualitySignal

Discrete quality observations attached to entities or sources.
Used to track geometry quality, attribute completeness, CRS validity,
temporal freshness, source reliability, and topology quality.

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


VALID_SIGNAL_TYPES = {
    "Geometry Quality",
    "Attribute Completeness",
    "CRS Validity",
    "Temporal Freshness",
    "Source Reliability",
    "Topology Quality",
    "Duplicate Rate",
    "Overall Quality",
}

VALID_SIGNAL_SEVERITIES = {"INFO", "LOW", "MEDIUM", "HIGH", "CRITICAL"}


class QualitySignal(Base):
    """
    A discrete quality observation for an entity or source.

    signal_type: one of VALID_SIGNAL_TYPES
    value:       0–100 quality score for this dimension
    severity:    INFO | LOW | MEDIUM | HIGH | CRITICAL
    """

    __tablename__ = "quality_signals"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))

    entity_id = Column(
        String(64),
        ForeignKey("canonical_entities.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    source_id = Column(
        String(64),
        ForeignKey("data_sources.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    signal_type = Column(String(64), nullable=False)
    value = Column(Float, nullable=True)       # 0–100
    severity = Column(String(32), nullable=True, default="INFO")
    description = Column(Text, nullable=True)

    signal_metadata = Column(JSON, nullable=True)

    is_synthetic_demo = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow)

    # Relationships
    entity = relationship("CanonicalEntity", back_populates="quality_signals")
    source = relationship("DataSource", back_populates="quality_signals")

    __table_args__ = (
        CheckConstraint(
            "value IS NULL OR (value >= 0 AND value <= 100)",
            name="ck_quality_signal_value_range",
        ),
    )

    @validates("severity")
    def validate_severity(self, _key, value):
        if value and value not in VALID_SIGNAL_SEVERITIES:
            raise ValueError(
                f"QualitySignal severity must be one of {VALID_SIGNAL_SEVERITIES}; got {value!r}"
            )
        return value

    def __repr__(self) -> str:
        return f"<QualitySignal id={self.id!r} type={self.signal_type!r} value={self.value}>"
