"""
BHOO-MITRA AI — SQLAlchemy Model: AuditEvent

Append-only audit log for every significant action in the system.
Records are NEVER updated or deleted — only new records are appended.
previous_state / new_state store JSON snapshots for full traceability.

All records marked is_synthetic_demo = True are SYNTHETIC DEMO DATA.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    Text,
    JSON,
    Boolean,
)
from sqlalchemy.orm import relationship

from app.db.base import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class AuditEvent(Base):
    """
    Immutable audit event.

    This table is append-only: no UPDATE or DELETE should ever be issued.
    Insert new rows to record state changes; never rewrite history.

    actor_role:  Human-readable role description
    action:      Upper-case action code (e.g. "RECOMMENDATION_APPROVED")
    module:      System module (e.g. "Verification", "Sources", "Conflicts")
    """

    __tablename__ = "audit_events"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Temporal
    timestamp = Column(DateTime(timezone=True), nullable=False, default=_utcnow, index=True)

    # Actor
    actor_id = Column(String(64), nullable=True)
    actor_name = Column(String(256), nullable=True)
    actor_role = Column(String(256), nullable=True)

    # Action
    action = Column(String(128), nullable=False)
    module = Column(String(64), nullable=True)
    reason = Column(Text, nullable=True)

    # Entity references (nullable — audit events may relate to any combination)
    entity_id = Column(
        String(64),
        ForeignKey("canonical_entities.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    parcel_id = Column(String(128), nullable=True)
    conflict_id = Column(
        String(64),
        ForeignKey("conflict_cases.id", ondelete="SET NULL"),
        nullable=True,
    )
    recommendation_id = Column(
        String(64),
        ForeignKey("recommendations.id", ondelete="SET NULL"),
        nullable=True,
    )
    verification_id = Column(
        String(64),
        ForeignKey("verification_records.id", ondelete="SET NULL"),
        nullable=True,
    )
    source_id = Column(
        String(64),
        ForeignKey("data_sources.id", ondelete="SET NULL"),
        nullable=True,
    )

    # State snapshots (append-only provenance)
    previous_state = Column(JSON, nullable=True)
    new_state = Column(JSON, nullable=True)
    evidence_ids = Column(JSON, nullable=True)          # list of Evidence.id involved
    audit_metadata = Column(JSON, nullable=True)

    is_synthetic_demo = Column(Boolean, nullable=False, default=True)

    # Relationships (read-only navigation — no cascade writes)
    entity = relationship("CanonicalEntity", back_populates="audit_events", foreign_keys=[entity_id])
    conflict = relationship("ConflictCase", back_populates="audit_events", foreign_keys=[conflict_id])
    recommendation = relationship("Recommendation", back_populates="audit_events", foreign_keys=[recommendation_id])
    verification = relationship("VerificationRecord", back_populates="audit_events", foreign_keys=[verification_id])
    source = relationship("DataSource", back_populates="audit_events", foreign_keys=[source_id])

    def __repr__(self) -> str:
        return f"<AuditEvent id={self.id!r} action={self.action!r}>"
