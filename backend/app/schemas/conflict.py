from typing import List, Optional
from pydantic import BaseModel

class ConflictCaseSchema(BaseModel):
    id: str
    entityId: str
    parcelId: str
    conflictType: str
    severity: str
    status: str
    description: str
    sourcesInvolved: List[str]
    areaDiscrepancySqm: Optional[float] = None
    detectedAt: str

class ConflictDetailSchema(ConflictCaseSchema):
    evidenceIds: List[str] = []
    suggestedResolution: Optional[str] = None
