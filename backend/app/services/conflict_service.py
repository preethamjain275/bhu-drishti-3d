"""
BHOO-MITRA AI — Conflict Service

Supports both PostgreSQL (postgres mode) and in-memory demo fallback (mock mode).
"""

from __future__ import annotations

from typing import List, Optional, TYPE_CHECKING

from app.repositories.mock_repository import MockRepository
from app.mock_data.conflicts import SYNTHETIC_CONFLICTS_DATA
from app.schemas.conflict import ConflictCaseSchema, ConflictDetailSchema

if TYPE_CHECKING:
    from sqlalchemy.orm import Session


class ConflictService:
    def __init__(self, session: Optional["Session"] = None):
        if session is not None:
            from app.repositories.postgres_repository import ConflictRepository
            self.repo = ConflictRepository(session)
            self._session = session
        else:
            self.repo = MockRepository(SYNTHETIC_CONFLICTS_DATA, id_field="id")
            self._session = None

    def get_conflicts(self, status: Optional[str] = None, severity: Optional[str] = None) -> List[ConflictCaseSchema]:
        def filter_fn(item: dict) -> bool:
            item_status = item.get("status")
            item_severity = item.get("severity")
            if status and status != "ALL" and item_status != status:
                return False
            if severity and severity != "ALL" and item_severity != severity:
                return False
            return True

        raw_items = self.repo.get_all(filter_fn=filter_fn)
        results = []
        for item in raw_items:
            try:
                results.append(self._to_case_schema(item))
            except Exception:
                pass
        return results

    def get_conflict_by_id(self, conflict_id: str) -> Optional[ConflictDetailSchema]:
        item = self.repo.get_by_id(conflict_id)
        if not item:
            return None
        try:
            return self._to_detail_schema(item)
        except Exception:
            return None

    def _to_case_schema(self, item: dict) -> ConflictCaseSchema:
        if self._session is not None:
            return ConflictCaseSchema(
                id=item.get("id", ""),
                entityId=item.get("entity_id") or item.get("entityId", ""),
                parcelId=item.get("parcel_id") or item.get("parcelId", ""),
                conflictType=item.get("conflict_type") or item.get("conflictType", ""),
                severity=item.get("severity", "MEDIUM"),
                status=item.get("status", "OPEN"),
                description=item.get("description", ""),
                sourcesInvolved=item.get("sources_involved") or item.get("sourcesInvolved") or [],
                areaDiscrepancySqm=item.get("area_discrepancy_sqm") or item.get("areaDiscrepancySqm"),
                detectedAt=item.get("detected_at") or item.get("detectedAt") or "",
            )
        return ConflictCaseSchema(**item)

    def _to_detail_schema(self, item: dict) -> ConflictDetailSchema:
        if self._session is not None:
            return ConflictDetailSchema(
                id=item.get("id", ""),
                entityId=item.get("entity_id") or item.get("entityId", ""),
                parcelId=item.get("parcel_id") or item.get("parcelId", ""),
                conflictType=item.get("conflict_type") or item.get("conflictType", ""),
                severity=item.get("severity", "MEDIUM"),
                status=item.get("status", "OPEN"),
                description=item.get("description", ""),
                sourcesInvolved=item.get("sources_involved") or item.get("sourcesInvolved") or [],
                areaDiscrepancySqm=item.get("area_discrepancy_sqm") or item.get("areaDiscrepancySqm"),
                detectedAt=item.get("detected_at") or item.get("detectedAt") or "",
                evidenceIds=item.get("evidence_ids") or item.get("evidenceIds") or [],
                suggestedResolution=item.get("suggested_resolution") or item.get("suggestedResolution"),
            )
        return ConflictDetailSchema(**item)
