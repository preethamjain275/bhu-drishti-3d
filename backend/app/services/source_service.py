"""
BHOO-MITRA AI — Source Service

Supports both PostgreSQL (postgres mode) and in-memory demo fallback (mock mode).
"""

from __future__ import annotations

from typing import List, Optional, TYPE_CHECKING

from app.repositories.mock_repository import MockRepository
from app.mock_data.sources import SYNTHETIC_SOURCES_DATA
from app.schemas.source import DataSourceSchema

if TYPE_CHECKING:
    from sqlalchemy.orm import Session


class SourceService:
    def __init__(self, session: Optional["Session"] = None):
        if session is not None:
            from app.repositories.postgres_repository import DataSourceRepository
            self.repo = DataSourceRepository(session)
            self._session = session
        else:
            self.repo = MockRepository(SYNTHETIC_SOURCES_DATA, id_field="id")
            self._session = None

    def get_sources(self, source_type: Optional[str] = None, query: Optional[str] = None) -> List[DataSourceSchema]:
        def filter_fn(item: dict) -> bool:
            if source_type and source_type != "ALL" and item.get("type") != source_type:
                return False
            if query:
                q = query.lower()
                name = item.get("name", "").lower()
                src_id = item.get("id", "").lower()
                org = item.get("organization", "").lower()
                crs = (item.get("spatial_metadata") or item.get("spatial") or {}).get("crs", "").lower()
                if q not in name and q not in src_id and q not in org and q not in crs:
                    return False
            return True

        raw_items = self.repo.get_all(filter_fn=filter_fn)

        results = []
        for item in raw_items:
            try:
                results.append(self._to_schema(item))
            except Exception:
                pass
        return results

    def get_source_by_id(self, source_id: str) -> Optional[DataSourceSchema]:
        item = self.repo.get_by_id(source_id)
        if not item:
            return None
        try:
            return self._to_schema(item)
        except Exception:
            return None

    def _to_schema(self, item: dict) -> DataSourceSchema:
        """Map both postgres row dict and legacy mock dict to DataSourceSchema."""
        if self._session is not None:
            # Postgres row — reconstruct the rich nested schema from flat columns
            return DataSourceSchema(
                id=item.get("id", ""),
                name=item.get("name", ""),
                type=item.get("type", ""),
                format=item.get("format", ""),
                status=item.get("status", "READY"),
                organization=item.get("organization", ""),
                contactEmail=item.get("contact_email", ""),
                description=item.get("description", ""),
                entityCount=item.get("entity_count") or 0,
                assetCount=item.get("asset_count") or 0,
                lastUpdated=item.get("updated_at", ""),
                spatial=(item.get("spatial_metadata") or {
                    "crs": "EPSG:4326",
                    "crsName": "WGS 84",
                    "targetCrs": "EPSG:4326",
                    "transformationName": "Identity",
                    "geometryType": "Polygon",
                    "bbox": [77.201, 28.599, 77.205, 28.604],
                    "coveragePercentage": 100.0,
                    "spatialExtentDescription": "Urban Demo Area",
                    "accuracyMeters": 0.5,
                }),
                temporal=(item.get("temporal_metadata") or {
                    "observationDate": "2024-01-01",
                    "lastUpdated": item.get("updated_at", ""),
                    "dataVintage": "Demo",
                    "updateFrequency": "On demand",
                }),
                quality=(item.get("quality_metadata") or {
                    "completeness": 90,
                    "geometryValidity": 90,
                    "attributeCompleteness": 90,
                    "crsValidity": 100,
                    "duplicateRate": 2,
                    "overallQualityScore": 90.0,
                    "weights": {
                        "geometry": 0.3, "attributes": 0.25,
                        "completeness": 0.2, "crs": 0.15, "duplicates": 0.1,
                    },
                }),
                reliability={
                    "score": item.get("reliability_score") or 85,
                    "level": "High",
                    "historicalConsistency": 90,
                    "geometryQuality": 90,
                    "attributeQuality": 90,
                    "temporalFreshness": 90,
                    "verificationHistoryCount": 0,
                },
                schema=[],
                assets=[],
                validation={
                    "passed": True,
                    "summary": {
                        "geometry": "PASS", "crs": "PASS",
                        "schema": "PASS", "duplicates": "PASS",
                        "requiredFields": "PASS", "missingAttributes": "PASS",
                    },
                    "warnings": [],
                    "errors": [],
                },
                observedEntityIds=[],
            )
        # Mock dict — pass through directly
        return DataSourceSchema(**item)
