"""
BHOO-MITRA AI — SQLAlchemy Models: CanonicalEntity & EntityObservation

CanonicalEntity: The harmonised, unified representation of a land parcel.
EntityObservation: A single source's claim about that parcel — raw & unmodified.

PostGIS geometry columns are defined here.
All records marked is_synthetic_demo = True are SYNTHETIC DEMO DATA.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    DateTime,
    ForeignKey,
    CheckConstraint,
    Text,
    JSON,
    Boolean,
    ARRAY,
)
from sqlalchemy.orm import relationship, validates
from geoalchemy2 import Geometry

from app.db.base import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


# ─── SRID used across urban demo parcels (WGS-84) ───────────────────────────
DEMO_SRID = 4326


class CanonicalEntity(Base):
    """
    The unified, harmonised representation of a single land parcel.

    One CanonicalEntity can be observed from multiple sources — the
    harmonisation engine produces a single authoritative record from those
    observations.

    geometry: PostGIS GEOMETRY(MULTIPOLYGON, 4326)
              Stores the currently-accepted boundary polygon.
              CRS is preserved; no silent reprojection occurs here.
    """

    __tablename__ = "canonical_entities"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Business keys
    canonical_entity_id = Column(String(64), nullable=True, index=True)
    parcel_id = Column(String(128), nullable=True, index=True, unique=True)

    # Attributes
    land_use = Column(String(128), nullable=True)
    property_status = Column(String(64), nullable=True, default="Active")
    owner_category = Column(String(64), nullable=True)

    # Spatial measurements (derived — do not recompute without full audit trail)
    area = Column(Float, nullable=True)        # m²
    perimeter = Column(Float, nullable=True)   # m
    building_count = Column(Integer, nullable=True, default=0)

    # Centroid & bbox stored as JSON for quick map preview (no PostGIS query needed)
    centroid = Column(JSON, nullable=True)     # [lon, lat]
    bbox = Column(JSON, nullable=True)         # [minLon, minLat, maxLon, maxLat]

    # PostGIS geometry — MULTIPOLYGON to handle complex parcels
    geometry = Column(
        Geometry(geometry_type="GEOMETRY", srid=DEMO_SRID, spatial_index=True),
        nullable=True,
    )

    # Temporal
    observation_date = Column(String(32), nullable=True)
    quality_score = Column(Float, nullable=True)   # 0–100

    observation_ids = Column(JSON, nullable=True)   # list of EntityObservation.id

    is_synthetic_demo = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow, onupdate=_utcnow)

    # Relationships
    observations = relationship("EntityObservation", back_populates="entity")
    conflicts = relationship("ConflictCase", back_populates="entity")
    evidence = relationship("Evidence", back_populates="entity")
    recommendations = relationship("Recommendation", back_populates="entity")
    verifications = relationship("VerificationRecord", back_populates="entity")
    audit_events = relationship("AuditEvent", back_populates="entity", foreign_keys="AuditEvent.entity_id")
    quality_signals = relationship("QualitySignal", back_populates="entity")

    __table_args__ = (
        CheckConstraint(
            "quality_score IS NULL OR (quality_score >= 0 AND quality_score <= 100)",
            name="ck_entity_quality_range",
        ),
    )

    @validates("property_status")
    def validate_status(self, _key, value):
        allowed = {"Active", "Disputed", "Archived", "Pending", "Unknown"}
        if value and value not in allowed:
            raise ValueError(f"property_status must be one of {allowed}; got {value!r}")
        return value

    def __repr__(self) -> str:
        return f"<CanonicalEntity id={self.id!r} parcel_id={self.parcel_id!r}>"


class EntityObservation(Base):
    """
    A single source's raw claim about a parcel.

    Source provenance is fully preserved — nothing is silently overwritten.
    geometry: PostGIS point / polygon as received from the source (CRS preserved).
    """

    __tablename__ = "entity_observations"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))

    source_asset_id = Column(
        String(64),
        ForeignKey("source_assets.id", ondelete="SET NULL"),
        nullable=True,
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

    # Source-side identifiers
    source_record_id = Column(String(128), nullable=True)    # e.g. "PARCEL-014"
    source_name = Column(String(256), nullable=True)

    observation_date = Column(String(32), nullable=True)
    attributes = Column(JSON, nullable=True)                 # raw source attribute dict

    # PostGIS geometry — as received (no silent transformation)
    geometry = Column(
        Geometry(geometry_type="GEOMETRY", srid=DEMO_SRID, spatial_index=True),
        nullable=True,
    )

    geometry_type = Column(String(64), nullable=True)
    bbox = Column(JSON, nullable=True)
    area_sqm = Column(Float, nullable=True)
    location_label = Column(String(256), nullable=True)

    confidence = Column(Float, nullable=True)   # 0–100
    status = Column(String(64), nullable=True, default="PENDING")

    candidate_canonical_id = Column(String(64), nullable=True)

    is_synthetic_demo = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow)

    # Relationships
    source_asset = relationship("SourceAsset", back_populates="observations")
    entity = relationship("CanonicalEntity", back_populates="observations")
    source = relationship("DataSource", back_populates="observations")
    evidence = relationship("Evidence", back_populates="observation")

    __table_args__ = (
        CheckConstraint(
            "confidence IS NULL OR (confidence >= 0 AND confidence <= 100)",
            name="ck_observation_confidence_range",
        ),
    )

    def __repr__(self) -> str:
        return f"<EntityObservation id={self.id!r} source_record_id={self.source_record_id!r}>"
