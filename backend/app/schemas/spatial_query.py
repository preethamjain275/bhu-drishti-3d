from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SpatialQueryRequest(BaseModel):
    query: str = Field(..., description="Natural language spatial question")
    active_entity_id: Optional[str] = None
    active_view: Optional[str] = "SPLIT"

class ParsedQueryPlan(BaseModel):
    intent: str
    target_entity_id: Optional[str] = None
    extracted_entities: List[str]
    filters: Dict[str, Any]
    spatial_relationship: Optional[str] = None

class QueryResultSection(BaseModel):
    data_records: List[Dict[str, Any]]
    calculations: Dict[str, Any]
    explanation: str
    evidence_references: List[str]

class SpatialQueryResponse(BaseModel):
    query: str
    intent: str
    plan: ParsedQueryPlan
    result: QueryResultSection
    suggested_follow_ups: List[str]
    status: str = "SUCCESS"
