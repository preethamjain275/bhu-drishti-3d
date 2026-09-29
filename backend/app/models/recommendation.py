"""
BHOO-MITRA AI — SQLAlchemy Model: Recommendation

A harmonisation recommendation produced by the conflict-resolution engine.
No unsupported AI claims are stored — every recommendation is linked to
at least one evidence item and a supporting conflict case.

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


VALID_REC_STATUSES = {
    "PENDING_VERIFICATION",
    "APPROVED",
    "REJECTED",
    "MODIFIED",
    "DEFERRED",
}


class Recommendation(Base):
    """
    A data-harmonisation recommendation for a canonical entity.

    candidate_representation: JSON dict describing the proposed canonical state
                               (proposed boundary source, land use, owner, etc.)
    confidence:               0–100 confidence that this recommendation is correct
    supporting_evidence_ids:  list[str] — Evidence.id values supporting this
    unresolved_items:         list[str] — open items the reviewer must check
    """

    __tablename__ = "recommendations"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))

    entity_id = Column(
        String(64),
        ForeignKey("canonical_entities.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    parcel_id = Column(String(128), nullable=True, index=True)
    conflict_id = Column(
        String(64),
        ForeignKey("conflict_cases.id", ondelete="SET NULL"),
        nullable=True,
    )

    candidate_representation = Column(JSON, nullable=True)   # proposed canonical record
    confidence = Column(Float, nullable=True)                # 0–100
    status = Column(String(64), nullable=False, default="PENDING_VERIFICATION")

    supporting_evidence_ids = Column(JSON, nullable=True)   # list of Evidence.id
    unresolved_items = Column(JSON, nullable=True)          # list of open questions
    reasoning = Column(Text, nullable=True)

    # Convenience fields mirroring existing mock schema
    proposed_boundary_source = Column(String(128), nullable=True)
    proposed_land_use = Column(String(128), nullable=True)

    is_synthetic_demo = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow, onupdate=_utcnow)

    # Relationships
    entity = relationship("CanonicalEntity", back_populates="recommendations")
    conflict = relationship("ConflictCase", back_populates="recommendations")
    verifications = relationship("VerificationRecord", back_populates="recommendation")
    audit_events = relationship(
        "AuditEvent",
        back_populates="recommendation",
        foreign_keys="AuditEvent.recommendation_id",
    )

    __table_args__ = (
        CheckConstraint(
            "confidence IS NULL OR (confidence >= 0 AND confidence <= 100)",
            name="ck_recommendation_confidence_range",
        ),
    )

    @validates("status")
    def validate_status(self, _key, value):
        if value not in VALID_REC_STATUSES:
            raise ValueError(
                f"Recommendation status must be one of {VALID_REC_STATUSES}; got {value!r}"
            )
        return value

    def __repr__(self) -> str:
        return f"<Recommendation id={self.id!r} status={self.status!r}>"
