"""
BHOO-MITRA AI — Entity Service

Supports both PostgreSQL (postgres mode) and in-memory demo fallback (mock mode).
"""

from __future__ import annotations

from typing import List, Optional, TYPE_CHECKING

from app.repositories.mock_repository import MockRepository
from app.mock_data.entities import SYNTHETIC_ENTITIES_DATA, SYNTHETIC_OBSERVATIONS_DATA
from app.schemas.entity import CanonicalEntitySchema, EntityObservationSchema

if TYPE_CHECKING:
    from sqlalchemy.orm import Session


class EntityService:
    def __init__(self, session: Optional["Session"] = None):
        if session is not None:
            from app.repositories.postgres_repository import (
                CanonicalEntityRepository,
                EntityObservationRepository,
            )
            self.entity_repo = CanonicalEntityRepository(session)
            self.obs_repo = EntityObservationRepository(session)
            self._session = session
        else:
            self.entity_repo = MockRepository(SYNTHETIC_ENTITIES_DATA, id_field="id")
            self.obs_repo = MockRepository(SYNTHETIC_OBSERVATIONS_DATA, id_field="id")
            self._session = None

    def get_entities(self, query: Optional[str] = None) -> List[CanonicalEntitySchema]:
        def filter_fn(item: dict) -> bool:
            if not query:
                return True
            q = query.lower()
            return q in (item.get("id") or "").lower() or q in (item.get("parcel_id") or item.get("parcelId") or "").lower()

        raw_items = self.entity_repo.get_all(filter_fn=filter_fn)
        results = []
        for item in raw_items:
            try:
                results.append(self._entity_to_schema(item))
            except Exception:
                pass
        return results

    def get_entity_by_id(self, entity_id: str) -> Optional[CanonicalEntitySchema]:
        item = self.entity_repo.get_by_id(entity_id)
        if not item:
            return None
        try:
            return self._entity_to_schema(item)
        except Exception:
            return None

    def get_observations(self) -> List[EntityObservationSchema]:
        raw = self.obs_repo.get_all()
        results = []
        for item in raw:
            try:
                results.append(self._obs_to_schema(item))
            except Exception:
                pass
        return results

    def _entity_to_schema(self, item: dict) -> CanonicalEntitySchema:
        if self._session is not None:
            return CanonicalEntitySchema(
                id=item.get("id", ""),
                parcelId=item.get("parcel_id") or item.get("parcelId", ""),
                landUse=item.get("land_use") or item.get("landUse", ""),
                status=item.get("property_status") or item.get("status", "Active"),
                areaSqm=item.get("area") or item.get("areaSqm") or 0.0,
                perimeterM=item.get("perimeter") or item.get("perimeterM") or 0.0,
                centroid=item.get("centroid") or [77.2024, 28.6012],
                bbox=item.get("bbox") or [77.2018, 28.6006, 77.2031, 28.6019],
                observationIds=item.get("observation_ids") or item.get("observationIds") or [],
            )
        return CanonicalEntitySchema(**item)

    def _obs_to_schema(self, item: dict) -> EntityObservationSchema:
        if self._session is not None:
            return EntityObservationSchema(
                id=item.get("id", ""),
                sourceId=item.get("source_id") or item.get("sourceId", ""),
                sourceName=item.get("source_name") or item.get("sourceName", ""),
                sourceEntityId=item.get("source_record_id") or item.get("sourceEntityId", ""),
                candidateCanonicalId=item.get("candidate_canonical_id") or item.get("candidateCanonicalId", ""),
                geometryType=item.get("geometry_type") or item.get("geometryType", "Polygon"),
                areaSqm=item.get("area_sqm") or item.get("areaSqm") or 0.0,
                attributes=item.get("attributes") or {},
                observationDate=item.get("observation_date") or item.get("observationDate", ""),
                confidenceScore=item.get("confidence") or item.get("confidenceScore") or 0.0,
                status=item.get("status", "PENDING"),
                locationLabel=item.get("location_label") or item.get("locationLabel", ""),
                bbox=item.get("bbox") or [77.2018, 28.6006, 77.2031, 28.6019],
            )
        return EntityObservationSchema(**item)
