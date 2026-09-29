from typing import List, Optional
from pydantic import BaseModel

class RecommendationSchema(BaseModel):
    id: str
    entityId: str
    parcelId: str
    proposedBoundarySource: str
    proposedLandUse: str
    confidence: float
    supportingEvidenceIds: List[str]
    unresolvedItems: List[str]
    status: str
    reasoning: str

class GenerateRecommendationRequest(BaseModel):
    entityId: str
    forceRefresh: bool = False
