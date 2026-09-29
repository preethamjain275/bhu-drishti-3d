"""
BHOO-MITRA AI — Recommendation Service

Supports both PostgreSQL (postgres mode) and in-memory demo fallback (mock mode).
"""

from __future__ import annotations

from typing import List, Optional, TYPE_CHECKING

from app.repositories.mock_repository import MockRepository
from app.mock_data.recommendations import SYNTHETIC_RECOMMENDATIONS_DATA
from app.schemas.recommendation import RecommendationSchema, GenerateRecommendationRequest

if TYPE_CHECKING:
    from sqlalchemy.orm import Session


class RecommendationService:
    def __init__(self, session: Optional["Session"] = None):
        if session is not None:
            from app.repositories.postgres_repository import RecommendationRepository
            self.repo = RecommendationRepository(session)
            self._session = session
        else:
            self.repo = MockRepository(SYNTHETIC_RECOMMENDATIONS_DATA, id_field="id")
            self._session = None

    def get_recommendations(self) -> List[RecommendationSchema]:
        raw_items = self.repo.get_all()
        results = []
        for item in raw_items:
            try:
                results.append(self._to_schema(item))
            except Exception:
                pass
        return results

    def get_recommendation_by_id(self, rec_id: str) -> Optional[RecommendationSchema]:
        item = self.repo.get_by_id(rec_id)
        if not item:
            return None
        try:
            return self._to_schema(item)
        except Exception:
            return None

    def generate_recommendation(self, req: GenerateRecommendationRequest) -> RecommendationSchema:
        existing = self.repo.get_all(filter_fn=lambda x: (x.get("entity_id") or x.get("entityId")) == req.entityId)
        if existing and not req.forceRefresh:
            return self._to_schema(existing[0])

        new_rec = {
            "id": f"REC-GEN-{req.entityId[-3:]}",
            "entityId": req.entityId,
            "parcelId": f"PARCEL-{req.entityId[-3:]}",
            "proposedBoundarySource": "SURVEY-2025-SP2291",
            "proposedLandUse": "Harmonized Zoning",
            "confidence": 98.4,
            "supportingEvidenceIds": ["EVID-SURV-SP2291", "EVID-GEOM-014"],
            "unresolvedItems": [],
            "status": "PENDING_VERIFICATION",
            "reasoning": "Deterministic harmonization recommendation based on sub-centimeter GNSS field survey boundaries.",
        }
        created = self.repo.create(new_rec)
        return self._to_schema(created)

    def _to_schema(self, item: dict) -> RecommendationSchema:
        if self._session is not None:
            cand = item.get("candidate_representation") or {}
            return RecommendationSchema(
                id=item.get("id", ""),
                entityId=item.get("entity_id") or item.get("entityId", ""),
                parcelId=item.get("parcel_id") or item.get("parcelId", ""),
                proposedBoundarySource=item.get("proposed_boundary_source") or cand.get("boundary_source", ""),
                proposedLandUse=item.get("proposed_land_use") or cand.get("land_use", ""),
                confidence=item.get("confidence") or 0.0,
                supportingEvidenceIds=item.get("supporting_evidence_ids") or [],
                unresolvedItems=item.get("unresolved_items") or [],
                status=item.get("status", "PENDING_VERIFICATION"),
                reasoning=item.get("reasoning") or "",
            )
        return RecommendationSchema(**item)
