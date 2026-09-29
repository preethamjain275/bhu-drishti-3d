from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

class SpatialMetadataSchema(BaseModel):
    crs: str
    crsName: str
    targetCrs: str
    transformationName: str
    geometryType: str
    bbox: List[float]
    coveragePercentage: float
    spatialExtentDescription: str
    accuracyMeters: float

class TemporalMetadataSchema(BaseModel):
    observationDate: str
    lastUpdated: str
    dataVintage: str
    updateFrequency: str

class SchemaFieldSchema(BaseModel):
    name: str
    type: str
    nullable: bool
    example: str
    description: Optional[str] = None

class QualityWeightsSchema(BaseModel):
    geometry: float
    attributes: float
    completeness: float
    crs: float
    duplicates: float

class QualitySignalSchema(BaseModel):
    completeness: float
    geometryValidity: float
    attributeCompleteness: float
    crsValidity: float
    duplicateRate: float
    overallQualityScore: float
    weights: QualityWeightsSchema

class SourceAssetSchema(BaseModel):
    id: str
    sourceId: str
    name: str
    assetType: str
    format: str
    sizeMb: float
    featureCount: int
    crs: str
    lastUpdated: str
    status: str

class SourceReliabilitySchema(BaseModel):
    score: float
    level: str
    historicalConsistency: float
    geometryQuality: float
    attributeQuality: float
    temporalFreshness: float
    verificationHistoryCount: int

class ValidationSummarySchema(BaseModel):
    geometry: str
    crs: str
    schema_status: str = Field(..., alias="schema")
    duplicates: str
    requiredFields: str
    missingAttributes: str

    model_config = ConfigDict(populate_by_name=True)

class ValidationMessageSchema(BaseModel):
    code: str
    message: str
    severity: str

class ValidationResultSchema(BaseModel):
    passed: bool
    summary: ValidationSummarySchema
    warnings: List[ValidationMessageSchema] = []
    errors: List[ValidationMessageSchema] = []

class DataSourceSchema(BaseModel):
    id: str
    name: str
    type: str
    format: str
    status: str
    organization: str
    contactEmail: str
    description: str
    entityCount: int
    assetCount: int
    lastUpdated: str
    spatial: SpatialMetadataSchema
    temporal: TemporalMetadataSchema
    quality: QualitySignalSchema
    reliability: SourceReliabilitySchema
    schema_fields: List[SchemaFieldSchema] = Field(..., alias="schema")
    assets: List[SourceAssetSchema] = []
    validation: ValidationResultSchema
    observedEntityIds: List[str] = []

    model_config = ConfigDict(populate_by_name=True)
