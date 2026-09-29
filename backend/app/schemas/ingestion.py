from pydantic import BaseModel

class IngestionJobSchema(BaseModel):
    id: str
    sourceName: str
    filename: str
    format: str
    progressPercent: int
    stage: str
    statusText: str

class StartIngestionRequest(BaseModel):
    filename: str
    sourceName: str
    sourceType: str
    format: str
    crs: str
