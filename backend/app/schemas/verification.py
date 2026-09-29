from typing import Optional
from pydantic import BaseModel

class VerificationRecordSchema(BaseModel):
    id: str
    recommendationId: str
    entityId: str
    reviewerName: str
    reviewerRole: str
    decision: str
    reason: str
    timestamp: str
    status: str

class VerificationDecisionRequest(BaseModel):
    decision: str
    reason: str
    reviewerName: Optional[str] = "Rajesh Kumar"
    reviewerRole: Optional[str] = "Senior Revenue Officer"
