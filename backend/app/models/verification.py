"""
BHOO-MITRA AI — SQLAlchemy Model: VerificationRecord

A human reviewer's decision on a harmonisation recommendation.
Supports: Approved | Modified | Rejected | Deferred | Needs More Evidence

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


VALID_DECISIONS = {
    "CONFIRMED",
    "MODIFIED",
    "REJECTED",
    "DEFERRED",
    "NEEDS_MORE_EVIDENCE",
}

VALID_VER_STATUSES = {
    "APPROVED",
    "MODIFIED",
    "REJECTED",
    "DEFERRED",
    "PENDING",
}


class VerificationRecord(Base):
    """
    A reviewer's decision on a recommendation.

    reviewer_id / reviewer_name: officer who reviewed the case
    decision:                    CONFIRMED | MODIFIED | REJECTED | DEFERRED | NEEDS_MORE_EVIDENCE
    status:                      APPROVED | MODIFIED | REJECTED | DEFERRED | PENDING
    """

    __tablename__ = "verification_records"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))

    entity_id = Column(
        String(64),
        ForeignKey("canonical_entities.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    parcel_id = Column(String(128), nullable=True)
    recommendation_id = Column(
        String(64),
        ForeignKey("recommendations.id", ondelete="SET NULL"),
        nullable=True,
    )

    reviewer_id = Column(String(64), nullable=True)
    reviewer_name = Column(String(256), nullable=True)
    reviewer_role = Column(String(256), nullable=True)

    decision = Column(String(64), nullable=False)
    reason = Column(Text, nullable=True)
    status = Column(String(64), nullable=False, default="PENDING")

    is_synthetic_demo = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow, onupdate=_utcnow)

    # Relationships
    entity = relationship("CanonicalEntity", back_populates="verifications")
    recommendation = relationship("Recommendation", back_populates="verifications")
    audit_events = relationship(
        "AuditEvent",
        back_populates="verification",
        foreign_keys="AuditEvent.verification_id",
    )

    @validates("decision")
    def validate_decision(self, _key, value):
        if value not in VALID_DECISIONS:
            raise ValueError(
                f"verification decision must be one of {VALID_DECISIONS}; got {value!r}"
            )
        return value

    @validates("status")
    def validate_status(self, _key, value):
        if value not in VALID_VER_STATUSES:
            raise ValueError(
                f"verification status must be one of {VALID_VER_STATUSES}; got {value!r}"
            )
        return value

    def __repr__(self) -> str:
        return f"<VerificationRecord id={self.id!r} decision={self.decision!r}>"
