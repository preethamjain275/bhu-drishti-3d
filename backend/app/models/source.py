"""
BHOO-MITRA AI — SQLAlchemy Models: DataSource & SourceAsset

Represents the authoritative data-source registry — government GIS layers,
land-registry databases, survey datasets, and planning authority records.
All records are SYNTHETIC DEMO DATA; not real government records.
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
)
from sqlalchemy.orm import relationship, validates

from app.db.base import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class DataSource(Base):
    """
    Authoritative data-source registry entry.

    Each DataSource represents one government / institutional data provider
    (e.g. Municipal GIS Cell, Sub-Registrar Office, Survey Department).
    """

    __tablename__ = "data_sources"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(256), nullable=False)
    type = Column(String(64), nullable=False)          # "Government GIS" | "Land Registry" | …
    description = Column(Text, nullable=True)
    format = Column(String(64), nullable=True)         # "GeoJSON" | "Shapefile" | …
    organization = Column(String(256), nullable=True)
    contact_email = Column(String(256), nullable=True)

    # Spatial metadata (stored as JSON; geometry processing deferred to Phase 16)
    crs = Column(String(32), nullable=True)            # e.g. "EPSG:4326"
    spatial_metadata = Column(JSON, nullable=True)     # bbox, accuracyMeters, …
    temporal_metadata = Column(JSON, nullable=True)    # observationDate, updateFrequency, …

    # Authority & reliability
    authority_level = Column(String(32), nullable=True)   # "National" | "State" | "Municipal" | …
    reliability_score = Column(Float, nullable=True)      # 0–100

    # Quality signals (denormalised summary — detail in QualitySignal table)
    quality_metadata = Column(JSON, nullable=True)

    # Status
    status = Column(
        String(32),
        nullable=False,
        default="READY",
    )

    # Metadata
    entity_count = Column(Integer, nullable=True)
    asset_count = Column(Integer, nullable=True)

    # Demo-data marker
    is_synthetic_demo = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow, onupdate=_utcnow)

    # Relationships
    assets = relationship("SourceAsset", back_populates="source", cascade="all, delete-orphan")
    observations = relationship("EntityObservation", back_populates="source")
    evidence = relationship("Evidence", back_populates="source")
    audit_events = relationship("AuditEvent", back_populates="source", foreign_keys="AuditEvent.source_id")
    quality_signals = relationship("QualitySignal", back_populates="source")

    __table_args__ = (
        CheckConstraint(
            "reliability_score IS NULL OR (reliability_score >= 0 AND reliability_score <= 100)",
            name="ck_datasource_reliability_range",
        ),
    )

    @validates("status")
    def validate_status(self, _key, value):
        allowed = {"CONNECTED", "READY", "PENDING", "ERROR", "DISCONNECTED"}
        if value not in allowed:
            raise ValueError(f"DataSource status must be one of {allowed}; got {value!r}")
        return value

    def __repr__(self) -> str:
        return f"<DataSource id={self.id!r} name={self.name!r}>"


class SourceAsset(Base):
    """
    A single file or layer ingested from a DataSource.

    Examples: municipal_parcels.geojson, registry_deeds.csv
    CRS is preserved from source; no transformation is applied here.
    """

    __tablename__ = "source_assets"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    source_id = Column(String(64), ForeignKey("data_sources.id", ondelete="CASCADE"), nullable=False)

    name = Column(String(256), nullable=False)
    file_type = Column(String(64), nullable=True)       # "geojson" | "csv" | "shapefile" | …
    format = Column(String(64), nullable=True)
    crs = Column(String(32), nullable=True)             # preserved exactly as received
    geometry_type = Column(String(64), nullable=True)   # "Polygon" | "Point" | …
    record_count = Column(Integer, nullable=True)
    size_mb = Column(Float, nullable=True)

    status = Column(String(32), nullable=False, default="READY")

    is_synthetic_demo = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow, onupdate=_utcnow)

    # Relationships
    source = relationship("DataSource", back_populates="assets")
    observations = relationship("EntityObservation", back_populates="source_asset")

    @validates("status")
    def validate_status(self, _key, value):
        allowed = {"READY", "PENDING", "PROCESSING", "ERROR"}
        if value not in allowed:
            raise ValueError(f"SourceAsset status must be one of {allowed}; got {value!r}")
        return value

    def __repr__(self) -> str:
        return f"<SourceAsset id={self.id!r} name={self.name!r}>"
