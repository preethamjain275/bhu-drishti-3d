"""
BHOO-MITRA AI — Evidence Service

Supports both PostgreSQL (postgres mode) and in-memory demo fallback (mock mode).
"""

from __future__ import annotations

from typing import List, Optional, TYPE_CHECKING

from app.repositories.mock_repository import MockRepository
from app.mock_data.evidence import SYNTHETIC_EVIDENCE_NODES, SYNTHETIC_EVIDENCE_RELATIONSHIPS
from app.schemas.evidence import EvidenceNodeSchema, EvidenceGraphSchema

if TYPE_CHECKING:
    from sqlalchemy.orm import Session


class EvidenceService:
    def __init__(self, session: Optional["Session"] = None):
        if session is not None:
            from app.repositories.postgres_repository import EvidenceRepository
            self.node_repo = EvidenceRepository(session)
            self._session = session
        else:
            self.node_repo = MockRepository(SYNTHETIC_EVIDENCE_NODES, id_field="id")
            self._session = None

    def get_evidence_nodes(self, entity_id: Optional[str] = None) -> List[EvidenceNodeSchema]:
        def filter_fn(item: dict) -> bool:
            eid = item.get("entity_id") or item.get("entityId")
            if entity_id and eid != entity_id:
                return False
            return True

        raw_items = self.node_repo.get_all(filter_fn=filter_fn)
        results = []
        for item in raw_items:
            try:
                results.append(self._to_schema(item))
            except Exception:
                pass
        return results

    def get_evidence_by_id(self, evidence_id: str) -> Optional[EvidenceNodeSchema]:
        item = self.node_repo.get_by_id(evidence_id)
        if not item:
            return None
        try:
            return self._to_schema(item)
        except Exception:
            return None

    def get_evidence_graph(self) -> EvidenceGraphSchema:
        nodes = self.get_evidence_nodes()
        if self._session is not None:
            # Build simple relationships from DB data
            relationships = []
            for node in nodes:
                if node.sourceId:
                    relationships.append({"from": node.sourceId, "to": node.id})
                if node.entityId:
                    relationships.append({"from": node.id, "to": node.entityId})
            return EvidenceGraphSchema(nodes=nodes, relationships=relationships)
        return EvidenceGraphSchema(nodes=nodes, relationships=SYNTHETIC_EVIDENCE_RELATIONSHIPS)

    def _to_schema(self, item: dict) -> EvidenceNodeSchema:
        if self._session is not None:
            return EvidenceNodeSchema(
                id=item.get("id", ""),
                entityId=item.get("entity_id") or item.get("entityId", ""),
                sourceId=item.get("source_id") or item.get("sourceId", ""),
                sourceName=item.get("source_name") or item.get("sourceName", ""),
                evidenceType=item.get("evidence_type") or item.get("evidenceType", ""),
                title=item.get("title") or item.get("description") or "",
                timestamp=item.get("timestamp") or item.get("created_at") or "",
                confidence=item.get("confidence") or 0.0,
                metadata=item.get("evidence_metadata") or item.get("metadata") or {},
            )
        return EvidenceNodeSchema(**item)
