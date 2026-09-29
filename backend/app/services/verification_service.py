"""
BHOO-MITRA AI — Verification Service

Supports both PostgreSQL (postgres mode) and in-memory demo fallback (mock mode).
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional, TYPE_CHECKING

from app.repositories.mock_repository import MockRepository
from app.mock_data.verification import SYNTHETIC_VERIFICATION_RECORDS
from app.schemas.verification import VerificationRecordSchema, VerificationDecisionRequest

if TYPE_CHECKING:
    from sqlalchemy.orm import Session


class VerificationService:
    def __init__(self, session: Optional["Session"] = None):
        if session is not None:
            from app.repositories.postgres_repository import VerificationRepository
            self.repo = VerificationRepository(session)
            self._session = session
        else:
            self.repo = MockRepository(SYNTHETIC_VERIFICATION_RECORDS, id_field="id")
            self._session = None

    def get_verifications(self) -> List[VerificationRecordSchema]:
        raw_items = self.repo.get_all()
        results = []
        for item in raw_items:
            try:
                results.append(self._to_schema(item))
            except Exception:
                pass
        return results

    def get_verification_by_id(self, ver_id: str) -> Optional[VerificationRecordSchema]:
        item = self.repo.get_by_id(ver_id)
        if not item:
            return None
        try:
            return self._to_schema(item)
        except Exception:
            return None

    def submit_verification_decision(self, ver_id: str, req: VerificationDecisionRequest) -> VerificationRecordSchema:
        # Map frontend "CONFIRMED" to valid DB decision
        decision = req.decision
        if decision not in {"CONFIRMED", "MODIFIED", "REJECTED", "DEFERRED", "NEEDS_MORE_EVIDENCE"}:
            decision = "CONFIRMED"

        status = "APPROVED" if decision == "CONFIRMED" else "REJECTED"

        existing = self.repo.get_by_id(ver_id)
        if not existing:
            new_record = {
                "id": ver_id,
                "recommendationId": f"REC-{ver_id[-3:]}",
                "entityId": f"CANONICAL-{ver_id[-3:]}",
                "reviewerName": req.reviewerName or "Rajesh Kumar",
                "reviewerRole": req.reviewerRole or "Senior Revenue Officer",
                "decision": decision,
                "reason": req.reason,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "status": status,
            }
            created = self.repo.create(new_record)
            return self._to_schema(created)

        updated = self.repo.update(ver_id, {
            "decision": decision,
            "reason": req.reason,
            "reviewer_name": req.reviewerName or existing.get("reviewer_name", existing.get("reviewerName", "")),
            "reviewer_role": req.reviewerRole or existing.get("reviewer_role", existing.get("reviewerRole", "")),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "status": status,
        })
        return self._to_schema(updated)

    def _to_schema(self, item: dict) -> VerificationRecordSchema:
        if self._session is not None:
            return VerificationRecordSchema(
                id=item.get("id", ""),
                recommendationId=item.get("recommendation_id") or item.get("recommendationId", ""),
                entityId=item.get("entity_id") or item.get("entityId", ""),
                reviewerName=item.get("reviewer_name") or item.get("reviewerName", ""),
                reviewerRole=item.get("reviewer_role") or item.get("reviewerRole", ""),
                decision=item.get("decision", ""),
                reason=item.get("reason") or "",
                timestamp=item.get("created_at") or item.get("timestamp", ""),
                status=item.get("status", "PENDING"),
            )
        return VerificationRecordSchema(**item)
