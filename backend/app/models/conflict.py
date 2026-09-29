"""
BHOO-MITRA AI — SQLAlchemy Model: ConflictCase

Represents a detected spatial, attribute, temporal, or topological
conflict between two or more source observations of the same parcel.
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


VALID_CONFLICT_TYPES = {
    "Geometry",
    "Attribute",
    "Temporal",
    "Topology",
    # Legacy / composite types from existing mock data kept for compatibility
    "Boundary Discrepancy & Area Discrepancy",
    "Zoning & Land Use Conflict",
}

VALID_SEVERITIES = {"LOW", "MEDIUM", "HIGH", "CRITICAL"}
VALID_STATUSES = {"OPEN", "REVIEW", "RESOLVED", "DEFERRED", "CLOSED"}


class ConflictCase(Base):
    """
    A single conflict detected between source observations of the same parcel.

    priority_score: 0–100 composite urgency rating
    severity:       LOW | MEDIUM | HIGH | CRITICAL
    status:         OPEN | REVIEW | RESOLVED | DEFERRED | CLOSED
    """

    __tablename__ = "conflict_cases"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))

    entity_id = Column(
        String(64),
        ForeignKey("canonical_entities.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    parcel_id = Column(String(128), nullable=True, index=True)

    conflict_type = Column(String(128), nullable=False)
    severity = Column(String(32), nullable=False, default="MEDIUM")
    status = Column(String(32), nullable=False, default="OPEN")

    title = Column(String(512), nullable=True)
    description = Column(Text, nullable=True)

    priority_score = Column(Float, nullable=True)   # 0–100
    area_discrepancy_sqm = Column(Float, nullable=True, default=0.0)

    sources_involved = Column(JSON, nullable=True)    # list of source names
    evidence_ids = Column(JSON, nullable=True)         # list of Evidence.id
    suggested_resolution = Column(Text, nullable=True)

    detected_at = Column(DateTime(timezone=True), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    is_synthetic_demo = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow, onupdate=_utcnow)

    # Relationships
    entity = relationship("CanonicalEntity", back_populates="conflicts")
    evidence = relationship("Evidence", back_populates="conflict")
    recommendations = relationship("Recommendation", back_populates="conflict")
    audit_events = relationship(
        "AuditEvent",
        back_populates="conflict",
        foreign_keys="AuditEvent.conflict_id",
    )

    __table_args__ = (
        CheckConstraint(
            "priority_score IS NULL OR (priority_score >= 0 AND priority_score <= 100)",
            name="ck_conflict_priority_range",
        ),
    )

    @validates("severity")
    def validate_severity(self, _key, value):
        if value not in VALID_SEVERITIES:
            raise ValueError(f"severity must be one of {VALID_SEVERITIES}; got {value!r}")
        return value

    @validates("status")
    def validate_status(self, _key, value):
        if value not in VALID_STATUSES:
            raise ValueError(f"conflict status must be one of {VALID_STATUSES}; got {value!r}")
        return value

    def __repr__(self) -> str:
        return f"<ConflictCase id={self.id!r} type={self.conflict_type!r} severity={self.severity!r}>"
