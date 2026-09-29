from typing import List, Dict, Union
from pydantic import BaseModel

class EntityObservationSchema(BaseModel):
    id: str
    sourceId: str
    sourceName: str
    sourceEntityId: str
    candidateCanonicalId: str
    geometryType: str
    areaSqm: float
    attributes: Dict[str, Union[str, float, int]]
    observationDate: str
    confidenceScore: float
    status: str
    locationLabel: str
    bbox: List[float]

class CanonicalEntitySchema(BaseModel):
    id: str
    parcelId: str
    landUse: str
    status: str
    areaSqm: float
    perimeterM: float
    centroid: List[float]
    bbox: List[float]
    observationIds: List[str]
