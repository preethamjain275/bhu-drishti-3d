from typing import Optional, Dict, Any
from pydantic import BaseModel

class AuditEventSchema(BaseModel):
    id: str
    timestamp: str
    actorId: str
    actorName: str
    actorRole: str
    action: str
    module: str
    sourceId: Optional[str] = None
    entityId: Optional[str] = None
    conflictId: Optional[str] = None
    evidenceId: Optional[str] = None
    recommendationId: Optional[str] = None
    verificationId: Optional[str] = None
    reason: str
    metadata: Dict[str, Any] = {}

class CreateAuditEventRequest(BaseModel):
    actorId: str = "USR-CURRENT-OFFICER"
    actorName: str = "Rajesh Kumar"
    actorRole: str = "Senior Revenue Officer"
    action: str
    module: str
    sourceId: Optional[str] = None
    entityId: Optional[str] = None
    conflictId: Optional[str] = None
    evidenceId: Optional[str] = None
    recommendationId: Optional[str] = None
    verificationId: Optional[str] = None
    reason: str
    metadata: Dict[str, Any] = {}
