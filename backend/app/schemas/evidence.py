from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class EvidenceNodeSchema(BaseModel):
    id: str
    entityId: str
    sourceId: str
    sourceName: str
    evidenceType: str
    title: str
    timestamp: str
    confidence: float
    metadata: Dict[str, Any] = {}

class EvidenceGraphSchema(BaseModel):
    nodes: List[EvidenceNodeSchema]
    relationships: List[Dict[str, str]]
