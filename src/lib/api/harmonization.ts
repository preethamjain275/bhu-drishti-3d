/**
 * BHOO-MITRA AI — CRS, Metadata & Schema Harmonization API Service
 *
 * Provides strongly-typed models, synthetic dataset mapping algorithms,
 * CRS transformation previews, schema standardization, attribute normalization,
 * and harmonization readiness scoring.
 *
 * ⚠️ SYNTHETIC DEMONSTRATION HARMONIZATION — No actual PROJ/GDAL binaries executed.
 */

import { recordAuditEvent } from "@/lib/api/audit";
import { getDataSources, type DataSource } from "@/lib/api/sources";

export type PipelineStage =
  | "INGEST"
  | "INSPECT"
  | "STANDARDIZE"
  | "CRS HARMONIZE"
  | "SCHEMA MAP"
  | "QUALITY CHECK"
  | "READY FOR ENTITY MATCHING";

export type CompatibilityState =
  | "EXACT MATCH"
  | "SEMANTIC MATCH"
  | "TYPE CONVERSION"
  | "PARTIAL MATCH"
  | "CONFLICT"
  | "UNMAPPED";

export type IssueStatus = "OPEN" | "REVIEW" | "RESOLVED" | "DEFERRED";

export interface HarmonizationDataset {
  id: string;
  sourceName: string;
  assetName: string;
  format: string;
  crs: string;
  featureCount: number;
  geometryType: string;
  observationDate: string;
  qualityScore: number;
  selected: boolean;
}

export interface CanonicalField {
  name: string;
  label: string;
  type: "string" | "number" | "boolean" | "date" | "geometry";
  description: string;
  required: boolean;
}

export const CANONICAL_URBAN_SCHEMA: CanonicalField[] = [
  { name: "canonical_entity_id", label: "Canonical Entity ID", type: "string", description: "Global unique entity identifier", required: true },
  { name: "canonical_parcel_id", label: "Canonical Parcel ID", type: "string", description: "Standardized revenue/municipal parcel index", required: true },
  { name: "land_use", label: "Land Use Category", type: "string", description: "Harmonized zoning classification (Residential, Commercial, etc.)", required: true },
  { name: "property_status", label: "Property Status", type: "string", description: "Standardized operational status (Active, Pending, etc.)", required: false },
  { name: "area_sqm", label: "Calculated Area (m²)", type: "number", description: "Standardized area in square meters", required: true },
  { name: "perimeter_m", label: "Boundary Perimeter (m)", type: "number", description: "Total boundary perimeter in meters", required: false },
  { name: "owner_category", label: "Owner Category", type: "string", description: "Institutional owner type (Private Individual, Corporate, State, Municipal)", required: false },
  { name: "building_count", label: "Building Count", type: "number", description: "Number of footprint structures", required: false },
  { name: "observation_date", label: "Observation Date", type: "date", description: "ISO 8601 timestamp of data capture", required: true },
  { name: "source_count", label: "Source Count", type: "number", description: "Number of overlapping source observations", required: true },
  { name: "geometry_source", label: "Primary Geometry Source", type: "string", description: "Source authority providing highest precision vector", required: true },
  { name: "quality_score", label: "Readiness Quality Score", type: "number", description: "Calculated readiness index percentage", required: true },
];

export interface SchemaMapping {
  id: string;
  sourceName: string;
  sourceField: string;
  canonicalField: string;
  sourceType: string;
  canonicalType: string;
  confidence: number; // 0 to 100
  compatibility: CompatibilityState;
  status: "Mapped" | "Review" | "Unmapped";
  signals: string[];
}

export interface MetadataComparisonItem {
  attribute: string;
  municipalValue: string;
  registryValue: string;
  surveyValue: string;
  planningValue: string;
  status: "MATCH" | "DIFFERENT" | "MISSING" | "NEEDS REVIEW";
  normalizedTarget: string;
}

export interface CRSProfile {
  datasetId: string;
  sourceName: string;
  sourceCrs: string;
  targetCrs: string;
  transformationName: string;
  units: string;
  status: "READY FOR TRANSFORMATION" | "REQUIRES REVIEW";
}

export interface CRSValidationCheck {
  id: string;
  label: string;
  status: "PASS" | "WARNING" | "FAIL";
  explanation: string;
}

export interface TransformationPreview {
  sampleFeatureId: string;
  originalCrs: string;
  transformedCrs: string;
  originalCoords: [number, number]; // [e.g. 715420.12, 3165210.45]
  transformedCoords: [number, number]; // [e.g. 77.2024, 28.6012]
  method: string;
  estimatedAccuracyMeters: number;
}

export interface AttributeMappingRule {
  field: string;
  originalValue: string;
  canonicalValue: string;
  category: string;
  status: "STANDARDIZED" | "UNMAPPED";
}

export interface HarmonizationIssue {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  dataset: string;
  field: string;
  description: string;
  suggestedAction: string;
  status: IssueStatus;
}

export interface HarmonizationReadiness {
  crsCompatibility: number;
  schemaCompatibility: number;
  metadataCompleteness: number;
  geometryValidity: number;
  attributeCompatibility: number;
  overallScore: number;
  status: "READY FOR ENTITY MATCHING" | "REQUIRES REVIEW";
}

// ---------------------------------------------------------------------------
// Synthetic Demo Data & Generators
// ---------------------------------------------------------------------------

const INITIAL_DATASETS: HarmonizationDataset[] = [
  {
    id: "MUNI-GIS-WARD18",
    sourceName: "Municipal GIS",
    assetName: "municipal_parcels.geojson",
    format: "GeoJSON",
    crs: "EPSG:4326",
    featureCount: 18240,
    geometryType: "Polygon",
    observationDate: "2024-04-12",
    qualityScore: 94,
    selected: true,
  },
  {
    id: "REGISTRY-PROP-014",
    sourceName: "Property Registry",
    assetName: "registry_parcels.geojson",
    format: "GeoJSON / Tabular",
    crs: "EPSG:4326",
    featureCount: 14500,
    geometryType: "Polygon",
    observationDate: "2025-11-04",
    qualityScore: 92,
    selected: true,
  },
  {
    id: "SURVEY-2025-SP2291",
    sourceName: "Survey Dataset",
    assetName: "survey_boundaries.geojson",
    format: "GeoJSON",
    crs: "EPSG:32643",
    featureCount: 3820,
    geometryType: "Polygon",
    observationDate: "2025-11-12",
    qualityScore: 98,
    selected: true,
  },
  {
    id: "PLANNING-ZONE-2025",
    sourceName: "Planning Dataset",
    assetName: "master_plan_zones.shp",
    format: "Shapefile",
    crs: "EPSG:32643",
    featureCount: 4200,
    geometryType: "MultiPolygon",
    observationDate: "2025-06-18",
    qualityScore: 86,
    selected: false,
  },
];

const INITIAL_MAPPINGS: SchemaMapping[] = [
  {
    id: "MAP-01",
    sourceName: "Municipal GIS",
    sourceField: "parcel_id",
    canonicalField: "canonical_parcel_id",
    sourceType: "string",
    canonicalType: "string",
    confidence: 98,
    compatibility: "EXACT MATCH",
    status: "Mapped",
    signals: ["Exact identifier pattern", "Indexed key in municipal schema"],
  },
  {
    id: "MAP-02",
    sourceName: "Property Registry",
    sourceField: "property_id",
    canonicalField: "canonical_parcel_id",
    sourceType: "string",
    canonicalType: "string",
    confidence: 96,
    compatibility: "SEMANTIC MATCH",
    status: "Mapped",
    signals: ["Similar semantic token 'id'", "Matched parcel lookup index"],
  },
  {
    id: "MAP-03",
    sourceName: "Survey Dataset",
    sourceField: "survey_parcel_no",
    canonicalField: "canonical_parcel_id",
    sourceType: "string",
    canonicalType: "string",
    confidence: 89,
    compatibility: "SEMANTIC MATCH",
    status: "Review",
    signals: ["Parcel prefix match", "Field survey control ID"],
  },
  {
    id: "MAP-04",
    sourceName: "Municipal GIS",
    sourceField: "land_use",
    canonicalField: "land_use",
    sourceType: "string",
    canonicalType: "string",
    confidence: 100,
    compatibility: "EXACT MATCH",
    status: "Mapped",
    signals: ["Matching field name", "Zoning vocabulary aligned"],
  },
  {
    id: "MAP-05",
    sourceName: "Property Registry",
    sourceField: "property_category",
    canonicalField: "land_use",
    sourceType: "string",
    canonicalType: "string",
    confidence: 88,
    compatibility: "SEMANTIC MATCH",
    status: "Mapped",
    signals: ["Vocabulary mapping match (RES -> Residential)", "Compatible enumeration"],
  },
  {
    id: "MAP-06",
    sourceName: "Municipal GIS",
    sourceField: "area_sqm",
    canonicalField: "area_sqm",
    sourceType: "number",
    canonicalType: "number",
    confidence: 99,
    compatibility: "EXACT MATCH",
    status: "Mapped",
    signals: ["Unit declared in meters²", "Numeric type match"],
  },
  {
    id: "MAP-07",
    sourceName: "Property Registry",
    sourceField: "deed_area_sqm",
    canonicalField: "area_sqm",
    sourceType: "number",
    canonicalType: "number",
    confidence: 94,
    compatibility: "SEMANTIC MATCH",
    status: "Mapped",
    signals: ["Area measurement deed field", "Numeric type match"],
  },
  {
    id: "MAP-08",
    sourceName: "Survey Dataset",
    sourceField: "measured_area_sqm",
    canonicalField: "area_sqm",
    sourceType: "number",
    canonicalType: "number",
    confidence: 95,
    compatibility: "SEMANTIC MATCH",
    status: "Mapped",
    signals: ["Field GNSS boundary calculation", "Numeric type match"],
  },
];

const INITIAL_ISSUES: HarmonizationIssue[] = [
  {
    id: "ISS-01",
    title: "Coordinate Reference System Mismatch",
    severity: "HIGH",
    dataset: "Survey Dataset (SP-2291)",
    field: "geometry",
    description: "Dataset is projected in UTM Zone 43N (EPSG:32643), requiring reprojection to target WGS 84 (EPSG:4326).",
    suggestedAction: "Apply PROJ datum shift transformation (UTM 43N → WGS84).",
    status: "OPEN",
  },
  {
    id: "ISS-02",
    title: "Field Name Inconsistency",
    severity: "MEDIUM",
    dataset: "Property Registry",
    field: "property_id",
    description: "Property Registry uses 'property_id' while Municipal GIS uses 'parcel_id'.",
    suggestedAction: "Map both fields to 'canonical_parcel_id'.",
    status: "OPEN",
  },
  {
    id: "ISS-03",
    title: "Attribute Vocabulary Difference",
    severity: "LOW",
    dataset: "Property Registry",
    field: "property_category",
    description: "Uses abbreviated codes ('RES', 'COM') instead of full canonical titles ('Residential', 'Commercial').",
    suggestedAction: "Apply attribute standardization dictionary.",
    status: "OPEN",
  },
  {
    id: "ISS-04",
    title: "Missing Property Status Field",
    severity: "LOW",
    dataset: "Survey Dataset",
    field: "property_status",
    description: "Survey points do not record tax or legal operational status.",
    suggestedAction: "Inherit property_status from Sub-Registrar registry observation.",
    status: "OPEN",
  },
];

let datasetsStore: HarmonizationDataset[] = [...INITIAL_DATASETS];
let mappingsStore: SchemaMapping[] = [...INITIAL_MAPPINGS];
let issuesStore: HarmonizationIssue[] = [...INITIAL_ISSUES];

// ---------------------------------------------------------------------------
// API Methods
// ---------------------------------------------------------------------------

export async function getHarmonizationDatasets(): Promise<HarmonizationDataset[]> {
  return [...datasetsStore];
}

export async function updateDatasetSelection(id: string, selected: boolean): Promise<HarmonizationDataset[]> {
  datasetsStore = datasetsStore.map((d) => (d.id === id ? { ...d, selected } : d));
  return [...datasetsStore];
}

export async function selectAllDatasets(selected: boolean): Promise<HarmonizationDataset[]> {
  datasetsStore = datasetsStore.map((d) => ({ ...d, selected }));
  return [...datasetsStore];
}

export async function getMetadataComparison(): Promise<MetadataComparisonItem[]> {
  return [
    { attribute: "CRS Reference", municipalValue: "EPSG:4326", registryValue: "EPSG:4326", surveyValue: "EPSG:32643", planningValue: "EPSG:32643", status: "NEEDS REVIEW", normalizedTarget: "EPSG:4326 (WGS 84)" },
    { attribute: "Geometry Type", municipalValue: "Polygon", registryValue: "Polygon", surveyValue: "Polygon", planningValue: "MultiPolygon", status: "DIFFERENT", normalizedTarget: "Polygon / MultiPolygon" },
    { attribute: "Observation Date", municipalValue: "2024-04-12", registryValue: "2025-11-04", surveyValue: "2025-11-12", planningValue: "2025-06-18", status: "DIFFERENT", normalizedTarget: "Latest Valid Vintage" },
    { attribute: "Area Units", municipalValue: "m²", registryValue: "m²", surveyValue: "m²", planningValue: "m²", status: "MATCH", normalizedTarget: "Square Meters (m²)" },
    { attribute: "Schema Version", municipalValue: "v2.1", registryValue: "v1.9", surveyValue: "v3.0", planningValue: "v1.0", status: "DIFFERENT", normalizedTarget: "BhuSetu Canonical Schema v1.0" },
    { attribute: "Encoding", municipalValue: "UTF-8", registryValue: "UTF-8", surveyValue: "UTF-8", planningValue: "UTF-8", status: "MATCH", normalizedTarget: "UTF-8" },
  ];
}

export async function getCRSProfiles(): Promise<CRSProfile[]> {
  return [
    { datasetId: "MUNI-GIS-WARD18", sourceName: "Municipal GIS", sourceCrs: "EPSG:4326", targetCrs: "EPSG:4326", transformationName: "Identity Direct Mapping", units: "Degrees", status: "READY FOR TRANSFORMATION" },
    { datasetId: "REGISTRY-PROP-014", sourceName: "Property Registry", sourceCrs: "EPSG:4326", targetCrs: "EPSG:4326", transformationName: "Identity Direct Mapping", units: "Degrees", status: "READY FOR TRANSFORMATION" },
    { datasetId: "SURVEY-2025-SP2291", sourceName: "Survey Dataset", sourceCrs: "EPSG:32643", targetCrs: "EPSG:4326", transformationName: "UTM Zone 43N → WGS 84", units: "Meters → Degrees", status: "READY FOR TRANSFORMATION" },
    { datasetId: "PLANNING-ZONE-2025", sourceName: "Planning Dataset", sourceCrs: "EPSG:32643", targetCrs: "EPSG:4326", transformationName: "UTM Zone 43N → WGS 84", units: "Meters → Degrees", status: "READY FOR TRANSFORMATION" },
  ];
}

export async function getCRSValidationChecks(): Promise<CRSValidationCheck[]> {
  return [
    { id: "VAL-01", label: "CRS Defined", status: "PASS", explanation: "All selected datasets contain valid EPSG code headers." },
    { id: "VAL-02", label: "EPSG Recognized", status: "PASS", explanation: "EPSG:4326 and EPSG:32643 are registered in the spatial reference database." },
    { id: "VAL-03", label: "Axis Order", status: "PASS", explanation: "Axis order confirmed: Longitude/Easting first, Latitude/Northing second." },
    { id: "VAL-04", label: "Units Consistent", status: "WARNING", explanation: "Survey dataset uses meters (UTM 43N); Municipal GIS uses geographic degrees (WGS 84)." },
    { id: "VAL-05", label: "Target CRS Compatible", status: "PASS", explanation: "EPSG:4326 selected as global target reference system." },
    { id: "VAL-06", label: "Transformation Available", status: "PASS", explanation: "PROJ grid shift pipeline available for UTM Zone 43N to WGS 84 conversion." },
  ];
}

export async function getTransformationPreview(): Promise<TransformationPreview> {
  return {
    sampleFeatureId: "PARCEL-DEMO-014",
    originalCrs: "EPSG:32643 (UTM Zone 43N)",
    transformedCrs: "EPSG:4326 (WGS 84)",
    originalCoords: [715420.12, 3165210.45],
    transformedCoords: [77.202418, 28.601245],
    method: "UTM Zone 43N → WGS 84 (PROJ Pipeline Simulation)",
    estimatedAccuracyMeters: 0.05,
  };
}

export async function getSchemaMappings(): Promise<SchemaMapping[]> {
  return [...mappingsStore];
}

export async function suggestSchemaMappings(): Promise<SchemaMapping[]> {
  await recordAuditEvent({
    actorId: "USR-OFFICER-01",
    actorName: "Rajesh Kumar",
    actorRole: "Senior Revenue Officer",
    action: "FIELD_MAPPING_SUGGESTED",
    module: "Harmonization",
    reason: "Generated deterministic system schema suggestions for source parcel fields.",
    metadata: { totalSuggested: mappingsStore.length },
  });

  return [...mappingsStore];
}

export async function updateSchemaMapping(id: string, updates: Partial<SchemaMapping>): Promise<SchemaMapping[]> {
  mappingsStore = mappingsStore.map((m) => (m.id === id ? { ...m, ...updates } : m));
  return [...mappingsStore];
}

export async function getAttributeStandardizationRules(): Promise<AttributeMappingRule[]> {
  return [
    { field: "land_use", originalValue: "RES", canonicalValue: "Residential", category: "Zoning", status: "STANDARDIZED" },
    { field: "land_use", originalValue: "COM", canonicalValue: "Commercial", category: "Zoning", status: "STANDARDIZED" },
    { field: "land_use", originalValue: "IND", canonicalValue: "Industrial", category: "Zoning", status: "STANDARDIZED" },
    { field: "land_use", originalValue: "MIX", canonicalValue: "Mixed Use", category: "Zoning", status: "STANDARDIZED" },
    { field: "property_status", originalValue: "ACTIVE", canonicalValue: "Active", category: "Status", status: "STANDARDIZED" },
    { field: "property_status", originalValue: "PENDING", canonicalValue: "Pending", category: "Status", status: "STANDARDIZED" },
  ];
}

export async function getHarmonizationIssues(): Promise<HarmonizationIssue[]> {
  return [...issuesStore];
}

export async function resolveHarmonizationIssue(id: string): Promise<HarmonizationIssue[]> {
  issuesStore = issuesStore.map((i) => (i.id === id ? { ...i, status: "RESOLVED" } : i));
  return [...issuesStore];
}

export async function calculateHarmonizationReadiness(): Promise<HarmonizationReadiness> {
  return {
    crsCompatibility: 95,
    schemaCompatibility: 88,
    metadataCompleteness: 92,
    geometryValidity: 97,
    attributeCompatibility: 84,
    overallScore: 91.2,
    status: "READY FOR ENTITY MATCHING",
  };
}

/**
 * Execute full simulated Harmonization Demo
 */
export async function runHarmonizationDemo(params: {
  selectedDatasetIds: string[];
  onProgress?: (stage: PipelineStage, percent: number) => void;
}): Promise<{
  readiness: HarmonizationReadiness;
  issues: HarmonizationIssue[];
}> {
  const stages: Array<{ stage: PipelineStage; percent: number; delay: number }> = [
    { stage: "INSPECT", percent: 20, delay: 500 },
    { stage: "STANDARDIZE", percent: 40, delay: 500 },
    { stage: "CRS HARMONIZE", percent: 60, delay: 600 },
    { stage: "SCHEMA MAP", percent: 80, delay: 600 },
    { stage: "QUALITY CHECK", percent: 90, delay: 500 },
    { stage: "READY FOR ENTITY MATCHING", percent: 100, delay: 400 },
  ];

  await recordAuditEvent({
    actorId: "USR-OFFICER-01",
    actorName: "Rajesh Kumar",
    actorRole: "Senior Revenue Officer",
    action: "HARMONIZATION_STARTED",
    module: "Harmonization",
    reason: `Initiated automated data harmonization pipeline for ${params.selectedDatasetIds.length} source datasets.`,
    metadata: { datasets: params.selectedDatasetIds },
  });

  for (const s of stages) {
    params.onProgress?.(s.stage, s.percent);
    await new Promise((r) => setTimeout(r, s.delay));
  }

  // Update issue statuses to resolved for demo
  issuesStore = issuesStore.map((i) => ({ ...i, status: "RESOLVED" as IssueStatus }));

  await recordAuditEvent({
    actorId: "USR-OFFICER-01",
    actorName: "Rajesh Kumar",
    actorRole: "Senior Revenue Officer",
    action: "HARMONIZATION_COMPLETED",
    module: "Harmonization",
    reason: "Harmonization pipeline completed successfully with 91.2% readiness score. Marked READY FOR ENTITY MATCHING.",
    metadata: { overallScore: 91.2 },
  });

  const readiness = await calculateHarmonizationReadiness();
  return {
    readiness,
    issues: issuesStore,
  };
}
