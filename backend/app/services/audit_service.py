"""
BHOO-MITRA AI — Audit Service

Supports both PostgreSQL (postgres mode) and in-memory demo fallback (mock mode).
Audit records are append-only — no update/delete logic is exposed.
"""

from __future__ import annotations

import random
from datetime import datetime, timezone
from typing import List, Optional, TYPE_CHECKING

from app.repositories.mock_repository import MockRepository
from app.mock_data.audit import SYNTHETIC_AUDIT_EVENTS
from app.schemas.audit import AuditEventSchema, CreateAuditEventRequest

if TYPE_CHECKING:
    from sqlalchemy.orm import Session


class AuditService:
    def __init__(self, session: Optional["Session"] = None):
        if session is not None:
            from app.repositories.postgres_repository import AuditRepository
            self.repo = AuditRepository(session)
            self._session = session
        else:
            self.repo = MockRepository(SYNTHETIC_AUDIT_EVENTS, id_field="id")
            self._session = None

    def get_events(self, module: Optional[str] = None, entity_id: Optional[str] = None) -> List[AuditEventSchema]:
        def filter_fn(item: dict) -> bool:
            item_module = item.get("module")
            item_entity = item.get("entity_id") or item.get("entityId")
            if module and module != "ALL" and item_module != module:
                return False
            if entity_id and item_entity != entity_id:
                return False
            return True

        raw_items = self.repo.get_all(filter_fn=filter_fn)
        raw_items.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        results = []
        for item in raw_items:
            try:
                results.append(self._to_schema(item))
            except Exception:
                pass
        return results

    def get_event_by_id(self, event_id: str) -> Optional[AuditEventSchema]:
        item = self.repo.get_by_id(event_id)
        if not item:
            return None
        try:
            return self._to_schema(item)
        except Exception:
            return None

    def create_event(self, req: CreateAuditEventRequest) -> AuditEventSchema:
        event_id = f"AUD-{random.randint(1000, 9999)}"
        new_event: dict = {
            "id": event_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "actor_id": req.actorId,
            "actor_name": req.actorName,
            "actor_role": req.actorRole,
            "action": req.action,
            "module": req.module,
            "source_id": req.sourceId,
            "entity_id": req.entityId,
            "conflict_id": req.conflictId,
            "recommendation_id": req.recommendationId,
            "verification_id": req.verificationId,
            "reason": req.reason,
            "audit_metadata": req.metadata,
        }
        # For mock repo use camelCase keys too
        if self._session is None:
            new_event.update({
                "actorId": req.actorId,
                "actorName": req.actorName,
                "actorRole": req.actorRole,
                "sourceId": req.sourceId,
                "entityId": req.entityId,
                "conflictId": req.conflictId,
                "evidenceId": req.evidenceId,
                "recommendationId": req.recommendationId,
                "verificationId": req.verificationId,
                "metadata": req.metadata,
            })
        created = self.repo.create(new_event)
        return self._to_schema(created)

    def _to_schema(self, item: dict) -> AuditEventSchema:
        if self._session is not None:
            return AuditEventSchema(
                id=item.get("id", ""),
                timestamp=item.get("timestamp") or item.get("created_at") or "",
                actorId=item.get("actor_id") or item.get("actorId", ""),
                actorName=item.get("actor_name") or item.get("actorName", ""),
                actorRole=item.get("actor_role") or item.get("actorRole", ""),
                action=item.get("action", ""),
                module=item.get("module", ""),
                sourceId=item.get("source_id") or item.get("sourceId"),
                entityId=item.get("entity_id") or item.get("entityId"),
                conflictId=item.get("conflict_id") or item.get("conflictId"),
                evidenceId=item.get("evidence_id") or item.get("evidenceId"),
                recommendationId=item.get("recommendation_id") or item.get("recommendationId"),
                verificationId=item.get("verification_id") or item.get("verificationId"),
                reason=item.get("reason") or "",
                metadata=item.get("audit_metadata") or item.get("metadata") or {},
            )
        return AuditEventSchema(**item)
