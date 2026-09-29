"""Initial migration: PostGIS extension + all BHOO-MITRA AI tables

Revision ID: 0001
Revises:
Create Date: 2026-09-26

Steps:
  1. Enable PostGIS extension
  2. Create data_sources table
  3. Create source_assets table
  4. Create canonical_entities table (with PostGIS geometry + GiST index)
  5. Create entity_observations table (with PostGIS geometry + GiST index)
  6. Create conflict_cases table
  7. Create evidence table
  8. Create recommendations table
  9. Create verification_records table
  10. Create audit_events table
  11. Create quality_signals table

Geometry SRID: 4326 (WGS-84)
"""

from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
import geoalchemy2
from alembic import op

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── 1. PostGIS Extension ──────────────────────────────────────────────────
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis;")

    # ── 2. data_sources ───────────────────────────────────────────────────────
    op.create_table(
        "data_sources",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("name", sa.String(256), nullable=False),
        sa.Column("type", sa.String(64), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("format", sa.String(64), nullable=True),
        sa.Column("organization", sa.String(256), nullable=True),
        sa.Column("contact_email", sa.String(256), nullable=True),
        sa.Column("crs", sa.String(32), nullable=True),
        sa.Column("spatial_metadata", sa.JSON, nullable=True),
        sa.Column("temporal_metadata", sa.JSON, nullable=True),
        sa.Column("authority_level", sa.String(32), nullable=True),
        sa.Column("reliability_score", sa.Float, nullable=True),
        sa.Column("quality_metadata", sa.JSON, nullable=True),
        sa.Column("status", sa.String(32), nullable=False, server_default="READY"),
        sa.Column("entity_count", sa.Integer, nullable=True),
        sa.Column("asset_count", sa.Integer, nullable=True),
        sa.Column("is_synthetic_demo", sa.Boolean, nullable=False, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.CheckConstraint(
            "reliability_score IS NULL OR (reliability_score >= 0 AND reliability_score <= 100)",
            name="ck_datasource_reliability_range",
        ),
    )

    # ── 3. source_assets ──────────────────────────────────────────────────────
    op.create_table(
        "source_assets",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column(
            "source_id",
            sa.String(64),
            sa.ForeignKey("data_sources.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name", sa.String(256), nullable=False),
        sa.Column("file_type", sa.String(64), nullable=True),
        sa.Column("format", sa.String(64), nullable=True),
        sa.Column("crs", sa.String(32), nullable=True),
        sa.Column("geometry_type", sa.String(64), nullable=True),
        sa.Column("record_count", sa.Integer, nullable=True),
        sa.Column("size_mb", sa.Float, nullable=True),
        sa.Column("status", sa.String(32), nullable=False, server_default="READY"),
        sa.Column("is_synthetic_demo", sa.Boolean, nullable=False, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
    )
    op.create_index("ix_source_assets_source_id", "source_assets", ["source_id"])

    # ── 4. canonical_entities (PostGIS geometry) ──────────────────────────────
    op.create_table(
        "canonical_entities",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("canonical_entity_id", sa.String(64), nullable=True),
        sa.Column("parcel_id", sa.String(128), nullable=True, unique=True),
        sa.Column("land_use", sa.String(128), nullable=True),
        sa.Column("property_status", sa.String(64), nullable=True, server_default="Active"),
        sa.Column("owner_category", sa.String(64), nullable=True),
        sa.Column("area", sa.Float, nullable=True),
        sa.Column("perimeter", sa.Float, nullable=True),
        sa.Column("building_count", sa.Integer, nullable=True, server_default="0"),
        sa.Column("centroid", sa.JSON, nullable=True),
        sa.Column("bbox", sa.JSON, nullable=True),
        # PostGIS geometry column — GEOMETRY supports Polygon, MultiPolygon, Point etc.
        sa.Column(
            "geometry",
            geoalchemy2.types.Geometry(geometry_type="GEOMETRY", srid=4326),
            nullable=True,
        ),
        sa.Column("observation_date", sa.String(32), nullable=True),
        sa.Column("quality_score", sa.Float, nullable=True),
        sa.Column("observation_ids", sa.JSON, nullable=True),
        sa.Column("is_synthetic_demo", sa.Boolean, nullable=False, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.CheckConstraint(
            "quality_score IS NULL OR (quality_score >= 0 AND quality_score <= 100)",
            name="ck_entity_quality_range",
        ),
    )
    op.create_index("ix_canonical_entities_parcel_id", "canonical_entities", ["parcel_id"])
    op.create_index("ix_canonical_entities_canonical_entity_id", "canonical_entities", ["canonical_entity_id"])
    # GiST spatial index — supports ST_Intersects, ST_Within, ST_DWithin etc.
    op.execute(
        "CREATE INDEX ix_canonical_entities_geometry_gist "
        "ON canonical_entities USING GIST (geometry);"
    )

    # ── 5. entity_observations (PostGIS geometry) ─────────────────────────────
    op.create_table(
        "entity_observations",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column(
            "source_asset_id",
            sa.String(64),
            sa.ForeignKey("source_assets.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "entity_id",
            sa.String(64),
            sa.ForeignKey("canonical_entities.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "source_id",
            sa.String(64),
            sa.ForeignKey("data_sources.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("source_record_id", sa.String(128), nullable=True),
        sa.Column("source_name", sa.String(256), nullable=True),
        sa.Column("observation_date", sa.String(32), nullable=True),
        sa.Column("attributes", sa.JSON, nullable=True),
        sa.Column(
            "geometry",
            geoalchemy2.types.Geometry(geometry_type="GEOMETRY", srid=4326),
            nullable=True,
        ),
        sa.Column("geometry_type", sa.String(64), nullable=True),
        sa.Column("bbox", sa.JSON, nullable=True),
        sa.Column("area_sqm", sa.Float, nullable=True),
        sa.Column("location_label", sa.String(256), nullable=True),
        sa.Column("confidence", sa.Float, nullable=True),
        sa.Column("status", sa.String(64), nullable=True, server_default="PENDING"),
        sa.Column("candidate_canonical_id", sa.String(64), nullable=True),
        sa.Column("is_synthetic_demo", sa.Boolean, nullable=False, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.CheckConstraint(
            "confidence IS NULL OR (confidence >= 0 AND confidence <= 100)",
            name="ck_observation_confidence_range",
        ),
    )
    op.create_index("ix_entity_observations_entity_id", "entity_observations", ["entity_id"])
    op.create_index("ix_entity_observations_source_id", "entity_observations", ["source_id"])
    # GiST spatial index for future ST_Intersects / ST_DWithin operations
    op.execute(
        "CREATE INDEX ix_entity_observations_geometry_gist "
        "ON entity_observations USING GIST (geometry);"
    )

    # ── 6. conflict_cases ─────────────────────────────────────────────────────
    op.create_table(
        "conflict_cases",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column(
            "entity_id",
            sa.String(64),
            sa.ForeignKey("canonical_entities.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("parcel_id", sa.String(128), nullable=True),
        sa.Column("conflict_type", sa.String(128), nullable=False),
        sa.Column("severity", sa.String(32), nullable=False, server_default="MEDIUM"),
        sa.Column("status", sa.String(32), nullable=False, server_default="OPEN"),
        sa.Column("title", sa.String(512), nullable=True),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("priority_score", sa.Float, nullable=True),
        sa.Column("area_discrepancy_sqm", sa.Float, nullable=True, server_default="0"),
        sa.Column("sources_involved", sa.JSON, nullable=True),
        sa.Column("evidence_ids", sa.JSON, nullable=True),
        sa.Column("suggested_resolution", sa.Text, nullable=True),
        sa.Column("detected_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_synthetic_demo", sa.Boolean, nullable=False, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.CheckConstraint(
            "priority_score IS NULL OR (priority_score >= 0 AND priority_score <= 100)",
            name="ck_conflict_priority_range",
        ),
    )
    op.create_index("ix_conflict_cases_entity_id", "conflict_cases", ["entity_id"])
    op.create_index("ix_conflict_cases_parcel_id", "conflict_cases", ["parcel_id"])

    # ── 7. evidence ───────────────────────────────────────────────────────────
    op.create_table(
        "evidence",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column(
            "conflict_id",
            sa.String(64),
            sa.ForeignKey("conflict_cases.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "entity_id",
            sa.String(64),
            sa.ForeignKey("canonical_entities.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "source_id",
            sa.String(64),
            sa.ForeignKey("data_sources.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "observation_id",
            sa.String(64),
            sa.ForeignKey("entity_observations.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("evidence_type", sa.String(128), nullable=True),
        sa.Column("title", sa.String(512), nullable=True),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("source_name", sa.String(256), nullable=True),
        sa.Column("confidence", sa.Float, nullable=True),
        sa.Column("reliability", sa.Float, nullable=True),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=True),
        sa.Column("evidence_metadata", sa.JSON, nullable=True),
        sa.Column("is_synthetic_demo", sa.Boolean, nullable=False, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.CheckConstraint(
            "confidence IS NULL OR (confidence >= 0 AND confidence <= 100)",
            name="ck_evidence_confidence_range",
        ),
        sa.CheckConstraint(
            "reliability IS NULL OR (reliability >= 0 AND reliability <= 100)",
            name="ck_evidence_reliability_range",
        ),
    )
    op.create_index("ix_evidence_entity_id", "evidence", ["entity_id"])
    op.create_index("ix_evidence_conflict_id", "evidence", ["conflict_id"])

    # ── 8. recommendations ────────────────────────────────────────────────────
    op.create_table(
        "recommendations",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column(
            "entity_id",
            sa.String(64),
            sa.ForeignKey("canonical_entities.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("parcel_id", sa.String(128), nullable=True),
        sa.Column(
            "conflict_id",
            sa.String(64),
            sa.ForeignKey("conflict_cases.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("candidate_representation", sa.JSON, nullable=True),
        sa.Column("confidence", sa.Float, nullable=True),
        sa.Column("status", sa.String(64), nullable=False, server_default="PENDING_VERIFICATION"),
        sa.Column("supporting_evidence_ids", sa.JSON, nullable=True),
        sa.Column("unresolved_items", sa.JSON, nullable=True),
        sa.Column("reasoning", sa.Text, nullable=True),
        sa.Column("proposed_boundary_source", sa.String(128), nullable=True),
        sa.Column("proposed_land_use", sa.String(128), nullable=True),
        sa.Column("is_synthetic_demo", sa.Boolean, nullable=False, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.CheckConstraint(
            "confidence IS NULL OR (confidence >= 0 AND confidence <= 100)",
            name="ck_recommendation_confidence_range",
        ),
    )
    op.create_index("ix_recommendations_entity_id", "recommendations", ["entity_id"])
    op.create_index("ix_recommendations_parcel_id", "recommendations", ["parcel_id"])

    # ── 9. verification_records ───────────────────────────────────────────────
    op.create_table(
        "verification_records",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column(
            "entity_id",
            sa.String(64),
            sa.ForeignKey("canonical_entities.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("parcel_id", sa.String(128), nullable=True),
        sa.Column(
            "recommendation_id",
            sa.String(64),
            sa.ForeignKey("recommendations.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("reviewer_id", sa.String(64), nullable=True),
        sa.Column("reviewer_name", sa.String(256), nullable=True),
        sa.Column("reviewer_role", sa.String(256), nullable=True),
        sa.Column("decision", sa.String(64), nullable=False),
        sa.Column("reason", sa.Text, nullable=True),
        sa.Column("status", sa.String(64), nullable=False, server_default="PENDING"),
        sa.Column("is_synthetic_demo", sa.Boolean, nullable=False, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
    )
    op.create_index("ix_verification_records_entity_id", "verification_records", ["entity_id"])

    # ── 10. audit_events (append-only) ────────────────────────────────────────
    op.create_table(
        "audit_events",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.Column("actor_id", sa.String(64), nullable=True),
        sa.Column("actor_name", sa.String(256), nullable=True),
        sa.Column("actor_role", sa.String(256), nullable=True),
        sa.Column("action", sa.String(128), nullable=False),
        sa.Column("module", sa.String(64), nullable=True),
        sa.Column("reason", sa.Text, nullable=True),
        sa.Column(
            "entity_id",
            sa.String(64),
            sa.ForeignKey("canonical_entities.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("parcel_id", sa.String(128), nullable=True),
        sa.Column(
            "conflict_id",
            sa.String(64),
            sa.ForeignKey("conflict_cases.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "recommendation_id",
            sa.String(64),
            sa.ForeignKey("recommendations.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "verification_id",
            sa.String(64),
            sa.ForeignKey("verification_records.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "source_id",
            sa.String(64),
            sa.ForeignKey("data_sources.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("previous_state", sa.JSON, nullable=True),
        sa.Column("new_state", sa.JSON, nullable=True),
        sa.Column("evidence_ids", sa.JSON, nullable=True),
        sa.Column("audit_metadata", sa.JSON, nullable=True),
        sa.Column("is_synthetic_demo", sa.Boolean, nullable=False, server_default="true"),
    )
    op.create_index("ix_audit_events_timestamp", "audit_events", ["timestamp"])
    op.create_index("ix_audit_events_entity_id", "audit_events", ["entity_id"])

    # ── 11. quality_signals ───────────────────────────────────────────────────
    op.create_table(
        "quality_signals",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column(
            "entity_id",
            sa.String(64),
            sa.ForeignKey("canonical_entities.id", ondelete="CASCADE"),
            nullable=True,
        ),
        sa.Column(
            "source_id",
            sa.String(64),
            sa.ForeignKey("data_sources.id", ondelete="CASCADE"),
            nullable=True,
        ),
        sa.Column("signal_type", sa.String(64), nullable=False),
        sa.Column("value", sa.Float, nullable=True),
        sa.Column("severity", sa.String(32), nullable=True, server_default="INFO"),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("signal_metadata", sa.JSON, nullable=True),
        sa.Column("is_synthetic_demo", sa.Boolean, nullable=False, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.CheckConstraint(
            "value IS NULL OR (value >= 0 AND value <= 100)",
            name="ck_quality_signal_value_range",
        ),
    )
    op.create_index("ix_quality_signals_entity_id", "quality_signals", ["entity_id"])
    op.create_index("ix_quality_signals_source_id", "quality_signals", ["source_id"])


def downgrade() -> None:
    op.drop_table("quality_signals")
    op.drop_table("audit_events")
    op.drop_table("verification_records")
    op.drop_table("recommendations")
    op.drop_table("evidence")
    op.drop_table("conflict_cases")
    op.drop_table("entity_observations")
    op.drop_table("canonical_entities")
    op.drop_table("source_assets")
    op.drop_table("data_sources")
    op.execute("DROP EXTENSION IF EXISTS postgis CASCADE;")
