/**
 * BHOO-MITRA AI — Data Sources & Multi-Source Ingestion API Service
 *
 * Provides strongly-typed models, synthetic geospatial source registries,
 * metadata schemas, asset tables, quality scores, CRS details, and simulated ingestion pipelines.
 *
 * ⚠️ SYNTHETIC DEMONSTRATION DATA — Not real government source registers.
 */

import { recordAuditEvent } from "@/lib/api/audit";
import { fetchWithFallback } from "@/lib/api/client";

export type SourceType = "Government GIS" | "Land Registry" | "Survey" | "Planning" | "Drone Imagery" | "Satellite";
export type FileFormat = "GeoJSON" | "GeoJSON / Tabular" | "Shapefile" | "CSV" | "KML" | "GeoPackage" | "GeoTIFF";
export type SourceStatus = "CONNECTED" | "READY" | "PROCESSING" | "WARNING" | "ERROR" | "DISCONNECTED";
export type ReliabilityLevel = "Very High" | "High" | "Medium" | "Low";
export type GeometryType = "Polygon" | "MultiPolygon" | "Point" | "LineString" | "Tabular (No Geometry)";

export interface SpatialMetadata {
  crs: string; // e.g., "EPSG:4326"
  crsName: string; // "WGS 84 / World Geodetic System"
  targetCrs: string; // "EPSG:4326"
  transformationName: string; // "UTM Zone 43N → WGS84"
  geometryType: GeometryType;
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  coveragePercentage: number; // e.g. 98.5%
  spatialExtentDescription: string;
  accuracyMeters: number; // e.g. 0.05m
}

export interface TemporalMetadata {
  observationDate: string;
  lastUpdated: string;
  dataVintage: string;
  updateFrequency: string; // "Real-time" | "Monthly" | "Annual" | "Ad-hoc"
}

export interface SchemaField {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "geometry";
  nullable: boolean;
  example: string;
  description?: string;
}

export interface QualitySignal {
  completeness: number; // e.g. 94
  geometryValidity: number; // e.g. 97
  attributeCompleteness: number; // e.g. 91
  crsValidity: number; // e.g. 100
  duplicateRate: number; // e.g. 2
  overallQualityScore: number; // Calculated weighted score
  weights: {
    geometry: number; // 30%
    attributes: number; // 25%
    completeness: number; // 20%
    crs: number; // 15%
    duplicates: number; // 10%
  };
}

export interface SourceAsset {
  id: string;
  sourceId: string;
  name: string;
  assetType: string; // "parcels" | "buildings" | "roads" | "attributes"
  format: FileFormat;
  sizeMb: number;
  featureCount: number;
  crs: string;
  lastUpdated: string;
  status: "READY" | "PROCESSING" | "WARNING" | "FAILED";
}

export interface SourceReliability {
  score: number; // Out of 100
  level: ReliabilityLevel;
  historicalConsistency: number;
  geometryQuality: number;
  attributeQuality: number;
  temporalFreshness: number;
  verificationHistoryCount: number;
}

export interface ValidationResult {
  passed: boolean;
  summary: {
    geometry: "PASS" | "FAIL" | "WARNING";
    crs: "PASS" | "FAIL" | "WARNING";
    schema: "PASS" | "FAIL" | "WARNING";
    duplicates: "PASS" | "FAIL" | "WARNING";
    requiredFields: "PASS" | "FAIL" | "WARNING";
    missingAttributes: "PASS" | "FAIL" | "WARNING";
  };
  warnings: Array<{ code: string; message: string; severity: "LOW" | "MEDIUM" | "HIGH" }>;
  errors: Array<{ code: string; message: string; severity: "HIGH" | "CRITICAL" }>;
}

export interface DataSource {
  id: string;
  name: string;
  type: SourceType;
  format: FileFormat;
  status: SourceStatus;
  organization: string;
  contactEmail: string;
  description: string;
  entityCount: number;
  assetCount: number;
  lastUpdated: string;
  spatial: SpatialMetadata;
  temporal: TemporalMetadata;
  quality: QualitySignal;
  reliability: SourceReliability;
  schema: SchemaField[];
  assets: SourceAsset[];
  validation: ValidationResult;
  observedEntityIds: string[];
}

export interface IngestionJob {
  id: string;
  sourceName: string;
  filename: string;
  format: FileFormat;
  progressPercent: number; // 0 to 100
  stage: "QUEUED" | "READING" | "VALIDATING" | "CRS CHECK" | "SCHEMA CHECK" | "QUALITY CHECK" | "READY" | "FAILED";
  statusText: string;
}

// ---------------------------------------------------------------------------
// Synthetic Demonstration Data Store
// ---------------------------------------------------------------------------

const SYNTHETIC_SOURCES: DataSource[] = [
  {
    id: "MUNI-GIS-WARD18",
    name: "Municipal GIS Ward 18",
    type: "Government GIS",
    format: "GeoJSON",
    status: "CONNECTED",
    organization: "Delhi Municipal Corporation (DMC) GIS Cell",
    contactEmail: "gis-cell@dmc.gov.in",
    description: "Official municipal spatial parcel register digitized from Ward 18 cadastral map sheets and utility survey layers.",
    entityCount: 18240,
    assetCount: 3,
    lastUpdated: "2026-09-24T16:20:00Z",
    spatial: {
      crs: "EPSG:4326",
      crsName: "WGS 84 / World Geodetic System 1984",
      targetCrs: "EPSG:4326",
      transformationName: "Identity / WGS84 Direct Mapping",
      geometryType: "Polygon",
      bbox: [77.201, 28.599, 77.205, 28.604],
      coveragePercentage: 98.5,
      spatialExtentDescription: "Delhi Ward 18 Commercial & Mixed Residential Sector",
      accuracyMeters: 0.25,
    },
    temporal: {
      observationDate: "2024-04-12",
      lastUpdated: "2026-09-24T16:20:00Z",
      dataVintage: "FY 2024-25 Revision",
      updateFrequency: "Monthly",
    },
    quality: {
      completeness: 94,
      geometryValidity: 97,
      attributeCompleteness: 91,
      crsValidity: 100,
      duplicateRate: 2,
      overallQualityScore: 94.2,
      weights: { geometry: 0.3, attributes: 0.25, completeness: 0.2, crs: 0.15, duplicates: 0.1 },
    },
    reliability: {
      score: 92,
      level: "High",
      historicalConsistency: 95,
      geometryQuality: 92,
      attributeQuality: 89,
      temporalFreshness: 90,
      verificationHistoryCount: 420,
    },
    schema: [
      { name: "parcel_id", type: "string", nullable: false, example: "P-10482", description: "Municipal tax parcel ID" },
      { name: "land_use", type: "string", nullable: true, example: "Residential - Mixed", description: "Zoning category" },
      { name: "area_sqm", type: "number", nullable: false, example: "2430.0", description: "Digitized polygon area" },
      { name: "ward_no", type: "string", nullable: false, example: "Ward 18", description: "Administrative ward" },
      { name: "tax_status", type: "string", nullable: true, example: "Paid FY 2024-25", description: "Property tax status" },
    ],
    assets: [
      { id: "AST-MUNI-01", sourceId: "MUNI-GIS-WARD18", name: "municipal_parcels.geojson", assetType: "parcels", format: "GeoJSON", sizeMb: 14.8, featureCount: 18240, crs: "EPSG:4326", lastUpdated: "2026-09-24", status: "READY" },
      { id: "AST-MUNI-02", sourceId: "MUNI-GIS-WARD18", name: "municipal_buildings.geojson", assetType: "buildings", format: "GeoJSON", sizeMb: 32.4, featureCount: 24100, crs: "EPSG:4326", lastUpdated: "2026-09-20", status: "READY" },
      { id: "AST-MUNI-03", sourceId: "MUNI-GIS-WARD18", name: "municipal_roads.geojson", assetType: "roads", format: "GeoJSON", sizeMb: 8.2, featureCount: 1450, crs: "EPSG:4326", lastUpdated: "2026-08-15", status: "READY" },
    ],
    validation: {
      passed: true,
      summary: { geometry: "PASS", crs: "PASS", schema: "WARNING", duplicates: "PASS", requiredFields: "PASS", missingAttributes: "WARNING" },
      warnings: [{ code: "ATTR_NULL_TAX", message: "Tax status field contains 6% null attributes.", severity: "LOW" }],
      errors: [],
    },
    observedEntityIds: ["PARCEL-DEMO-014", "PARCEL-DEMO-015", "PARCEL-DEMO-016"],
  },
  {
    id: "REGISTRY-PROP-014",
    name: "Property Registry Register",
    type: "Land Registry",
    format: "GeoJSON / Tabular",
    status: "READY",
    organization: "Department of Revenue & Land Records (Sub-Registrar IX)",
    contactEmail: "subregistrar-ix@delhi.gov.in",
    description: "Legal title deeds, conveyance records, and boundary descriptions recorded during legal property transactions.",
    entityCount: 14500,
    assetCount: 2,
    lastUpdated: "2026-09-25T12:15:00Z",
    spatial: {
      crs: "EPSG:4326",
      crsName: "WGS 84 / World Geodetic System 1984",
      targetCrs: "EPSG:4326",
      transformationName: "Identity / WGS84 Direct Mapping",
      geometryType: "Polygon",
      bbox: [77.201, 28.599, 77.205, 28.604],
      coveragePercentage: 94.0,
      spatialExtentDescription: "Sub-Registrar District IX Title Records",
      accuracyMeters: 0.5,
    },
    temporal: {
      observationDate: "2025-11-04",
      lastUpdated: "2026-09-25T12:15:00Z",
      dataVintage: "Current Deed Records",
      updateFrequency: "Real-time",
    },
    quality: {
      completeness: 91,
      geometryValidity: 89,
      attributeCompleteness: 98,
      crsValidity: 100,
      duplicateRate: 1,
      overallQualityScore: 91.8,
      weights: { geometry: 0.3, attributes: 0.25, completeness: 0.2, crs: 0.15, duplicates: 0.1 },
    },
    reliability: {
      score: 95,
      level: "High",
      historicalConsistency: 96,
      geometryQuality: 88,
      attributeQuality: 98,
      temporalFreshness: 97,
      verificationHistoryCount: 510,
    },
    schema: [
      { name: "deed_no", type: "string", nullable: false, example: "REG-98102", description: "Registered title deed index" },
      { name: "khasra_no", type: "string", nullable: false, example: "482/1", description: "Revenue survey number" },
      { name: "deed_area_sqm", type: "number", nullable: false, example: "2510.0", description: "Area mentioned in conveyance deed" },
      { name: "owner_name", type: "string", nullable: false, example: "Devi Sharan & Sons", description: "Registered owner name" },
    ],
    assets: [
      { id: "AST-REG-01", sourceId: "REGISTRY-PROP-014", name: "registry_parcels.geojson", assetType: "parcels", format: "GeoJSON", sizeMb: 18.4, featureCount: 14500, crs: "EPSG:4326", lastUpdated: "2026-09-25", status: "READY" },
      { id: "AST-REG-02", sourceId: "REGISTRY-PROP-014", name: "property_attributes.csv", assetType: "attributes", format: "CSV", sizeMb: 6.1, featureCount: 14500, crs: "EPSG:4326", lastUpdated: "2026-09-25", status: "READY" },
    ],
    validation: {
      passed: true,
      summary: { geometry: "WARNING", crs: "PASS", schema: "PASS", duplicates: "PASS", requiredFields: "PASS", missingAttributes: "PASS" },
      warnings: [{ code: "GEOM_SLIGHT_OFFSET", message: "Conveyance boundary offset detected against ground control survey.", severity: "MEDIUM" }],
      errors: [],
    },
    observedEntityIds: ["PARCEL-DEMO-014", "PARCEL-DEMO-015"],
  },
  {
    id: "SURVEY-2025-SP2291",
    name: "Field GNSS Survey SP-2291",
    type: "Survey",
    format: "GeoJSON",
    status: "CONNECTED",
    organization: "State Survey & Land Records Directorate",
    contactEmail: "survey-sp2291@survey.gov.in",
    description: "High-precision ground control differential GNSS field survey points and boundary vectors executed by licensed cadastral surveyors.",
    entityCount: 3820,
    assetCount: 2,
    lastUpdated: "2025-11-12T10:00:00Z",
    spatial: {
      crs: "EPSG:32643",
      crsName: "WGS 84 / UTM Zone 43N",
      targetCrs: "EPSG:4326",
      transformationName: "UTM Zone 43N → WGS84 (PROJ Pipeline)",
      geometryType: "Polygon",
      bbox: [77.2018, 28.6006, 77.2031, 28.6019],
      coveragePercentage: 99.8,
      spatialExtentDescription: "Field Survey Control SP-2291 Cadastral Perimeter",
      accuracyMeters: 0.02,
    },
    temporal: {
      observationDate: "2025-11-12",
      lastUpdated: "2025-11-12T10:00:00Z",
      dataVintage: "Post-Re-measurement Survey",
      updateFrequency: "Ad-hoc",
    },
    quality: {
      completeness: 99,
      geometryValidity: 99,
      attributeCompleteness: 95,
      crsValidity: 100,
      duplicateRate: 0,
      overallQualityScore: 98.4,
      weights: { geometry: 0.3, attributes: 0.25, completeness: 0.2, crs: 0.15, duplicates: 0.1 },
    },
    reliability: {
      score: 98,
      level: "Very High",
      historicalConsistency: 99,
      geometryQuality: 99,
      attributeQuality: 95,
      temporalFreshness: 94,
      verificationHistoryCount: 680,
    },
    schema: [
      { name: "point_id", type: "string", nullable: false, example: "CP-01", description: "GNSS Control Point ID" },
      { name: "gnss_northing", type: "number", nullable: false, example: "3165210.45", description: "UTM Northing" },
      { name: "gnss_easting", type: "number", nullable: false, example: "715420.12", description: "UTM Easting" },
      { name: "measured_area_sqm", type: "number", nullable: false, example: "2465.0", description: "Field measured boundary area" },
    ],
    assets: [
      { id: "AST-SURV-01", sourceId: "SURVEY-2025-SP2291", name: "survey_boundaries.geojson", assetType: "parcels", format: "GeoJSON", sizeMb: 8.4, featureCount: 3820, crs: "EPSG:32643", lastUpdated: "2025-11-12", status: "READY" },
      { id: "AST-SURV-02", sourceId: "SURVEY-2025-SP2291", name: "survey_points.geojson", assetType: "points", format: "GeoJSON", sizeMb: 2.1, featureCount: 15280, crs: "EPSG:32643", lastUpdated: "2025-11-12", status: "READY" },
    ],
    validation: {
      passed: true,
      summary: { geometry: "PASS", crs: "PASS", schema: "PASS", duplicates: "PASS", requiredFields: "PASS", missingAttributes: "PASS" },
      warnings: [],
      errors: [],
    },
    observedEntityIds: ["PARCEL-DEMO-014"],
  },
  {
    id: "PLANNING-ZONE-2025",
    name: "Master Planning Zoning Dataset",
    type: "Planning",
    format: "Shapefile",
    status: "WARNING",
    organization: "Delhi Development Authority (DDA) Planning Wing",
    contactEmail: "planning@dda.gov.in",
    description: "Master plan 2041 land use allocation, setback buffer requirements, and infrastructure right-of-way zones.",
    entityCount: 4200,
    assetCount: 1,
    lastUpdated: "2025-06-18T14:30:00Z",
    spatial: {
      crs: "EPSG:32643",
      crsName: "WGS 84 / UTM Zone 43N",
      targetCrs: "EPSG:4326",
      transformationName: "UTM Zone 43N → WGS84",
      geometryType: "MultiPolygon",
      bbox: [77.195, 28.590, 77.210, 28.610],
      coveragePercentage: 92.0,
      spatialExtentDescription: "Zone D Master Plan Boundary",
      accuracyMeters: 1.0,
    },
    temporal: {
      observationDate: "2025-06-18",
      lastUpdated: "2025-06-18T14:30:00Z",
      dataVintage: "Master Plan 2041 Gazette",
      updateFrequency: "Annual",
    },
    quality: {
      completeness: 88,
      geometryValidity: 85,
      attributeCompleteness: 86,
      crsValidity: 100,
      duplicateRate: 3,
      overallQualityScore: 86.5,
      weights: { geometry: 0.3, attributes: 0.25, completeness: 0.2, crs: 0.15, duplicates: 0.1 },
    },
    reliability: {
      score: 82,
      level: "Medium",
      historicalConsistency: 85,
      geometryQuality: 82,
      attributeQuality: 84,
      temporalFreshness: 78,
      verificationHistoryCount: 180,
    },
    schema: [
      { name: "zone_code", type: "string", nullable: false, example: "C-2", description: "Master plan zone code" },
      { name: "far_limit", type: "number", nullable: false, example: "3.5", description: "Floor Area Ratio limit" },
      { name: "setback_m", type: "number", nullable: true, example: "6.0", description: "Front setback requirement" },
    ],
    assets: [
      { id: "AST-PLAN-01", sourceId: "PLANNING-ZONE-2025", name: "master_plan_zones.shp", assetType: "parcels", format: "Shapefile", sizeMb: 24.6, featureCount: 4200, crs: "EPSG:32643", lastUpdated: "2025-06-18", status: "WARNING" },
    ],
    validation: {
      passed: false,
      summary: { geometry: "WARNING", crs: "PASS", schema: "WARNING", duplicates: "WARNING", requiredFields: "PASS", missingAttributes: "WARNING" },
      warnings: [
        { code: "GEOM_SELF_INTERSECT", message: "14 self-intersecting polygons detected in Shapefile asset.", severity: "HIGH" },
        { code: "ATTR_MISSING_SETBACK", message: "Front setback field null for 12% features.", severity: "MEDIUM" },
      ],
      errors: [],
    },
    observedEntityIds: ["PARCEL-DEMO-014"],
  },
  {
    id: "NAKSHA-DRONE-ORI-2026",
    name: "NAKSHA High-Res Drone Orthorectified Imagery (ORI)",
    type: "Drone Imagery",
    format: "GeoTIFF",
    status: "CONNECTED",
    organization: "Survey of India (NAKSHA Mission Directorate)",
    contactEmail: "drone-ops@naksha.gov.in",
    description: "Sub-5cm Ground Sampling Distance (GSD) ultra-high-resolution multispectral orthorectified imagery captured via Trimble UX5 & senseFly eBee fixed-wing UAVs with CORS RTK positioning.",
    entityCount: 32400,
    assetCount: 4,
    lastUpdated: "2026-03-15T08:30:00Z",
    spatial: {
      crs: "EPSG:32643",
      crsName: "WGS 84 / UTM Zone 43N",
      targetCrs: "EPSG:4326",
      transformationName: "UTM Zone 43N → WGS84 (High-precision Helmert)",
      geometryType: "Polygon",
      bbox: [77.190, 28.580, 77.220, 28.620],
      coveragePercentage: 99.9,
      spatialExtentDescription: "Urban Core NAKSHA Pilot Sector (Ward 18 & Surrounding Sectors)",
      accuracyMeters: 0.03,
    },
    temporal: {
      observationDate: "2026-03-15",
      lastUpdated: "2026-03-15T08:30:00Z",
      dataVintage: "Q1 2026 Aerial Survey",
      updateFrequency: "Monthly",
    },
    quality: {
      completeness: 99,
      geometryValidity: 100,
      attributeCompleteness: 98,
      crsValidity: 100,
      duplicateRate: 0,
      overallQualityScore: 99.2,
      weights: { geometry: 0.3, attributes: 0.25, completeness: 0.2, crs: 0.15, duplicates: 0.1 },
    },
    reliability: {
      score: 99,
      level: "Very High",
      historicalConsistency: 99,
      geometryQuality: 100,
      attributeQuality: 98,
      temporalFreshness: 99,
      verificationHistoryCount: 940,
    },
    schema: [
      { name: "tile_id", type: "string", nullable: false, example: "TILE-DEL-43N-08", description: "Standard 1km x 1km grid tile ID" },
      { name: "gsd_meters", type: "number", nullable: false, example: "0.045", description: "Ground Sampling Distance in meters" },
      { name: "flight_altitude_m", type: "number", nullable: false, example: "120.0", description: "Mean flight AGL altitude" },
      { name: "sensor_model", type: "string", nullable: false, example: "Sony RX1R II Full-Frame", description: "Aerial camera sensor" },
      { name: "cors_base_ref", type: "string", nullable: false, example: "CORS-DELHI-01", description: "Continuous Operating Reference Station ID" },
    ],
    assets: [
      { id: "AST-ORI-01", sourceId: "NAKSHA-DRONE-ORI-2026", name: "ortho_mosaic_rgb_ward18.tif", assetType: "parcels", format: "GeoTIFF", sizeMb: 340.5, featureCount: 32400, crs: "EPSG:32643", lastUpdated: "2026-03-15", status: "READY" },
      { id: "AST-ORI-02", sourceId: "NAKSHA-DRONE-ORI-2026", name: "ortho_boundary_polygons.geojson", assetType: "parcels", format: "GeoJSON", sizeMb: 24.2, featureCount: 18240, crs: "EPSG:32643", lastUpdated: "2026-03-15", status: "READY" },
    ],
    validation: {
      passed: true,
      summary: { geometry: "PASS", crs: "PASS", schema: "PASS", duplicates: "PASS", requiredFields: "PASS", missingAttributes: "PASS" },
      warnings: [],
      errors: [],
    },
    observedEntityIds: ["PARCEL-DEMO-014", "PARCEL-DEMO-015", "PARCEL-DEMO-016"],
  },
  {
    id: "NAKSHA-DSM-DTM-2026",
    name: "Digital Surface & Terrain Elevation Model (DSM/DTM)",
    type: "Survey",
    format: "GeoTIFF",
    status: "CONNECTED",
    organization: "National Remote Sensing Centre (NRSC) / Survey of India",
    contactEmail: "elevation@nrsc.gov.in",
    description: "High-density photogrammetric 3D point cloud, Digital Surface Model (DSM) and bare-earth Digital Terrain Model (DTM) providing true ground elevation and building heights.",
    entityCount: 28900,
    assetCount: 2,
    lastUpdated: "2026-03-10T14:00:00Z",
    spatial: {
      crs: "EPSG:32643",
      crsName: "WGS 84 / UTM Zone 43N",
      targetCrs: "EPSG:4326",
      transformationName: "UTM Zone 43N → WGS84",
      geometryType: "Polygon",
      bbox: [77.190, 28.580, 77.220, 28.620],
      coveragePercentage: 99.4,
      spatialExtentDescription: "Metropolitan 3D Topographic Elevation Coverage",
      accuracyMeters: 0.05,
    },
    temporal: {
      observationDate: "2026-03-10",
      lastUpdated: "2026-03-10T14:00:00Z",
      dataVintage: "March 2026 Elevation Model",
      updateFrequency: "Quarterly",
    },
    quality: {
      completeness: 98,
      geometryValidity: 99,
      attributeCompleteness: 97,
      crsValidity: 100,
      duplicateRate: 0,
      overallQualityScore: 98.6,
      weights: { geometry: 0.3, attributes: 0.25, completeness: 0.2, crs: 0.15, duplicates: 0.1 },
    },
    reliability: {
      score: 98,
      level: "Very High",
      historicalConsistency: 99,
      geometryQuality: 99,
      attributeQuality: 96,
      temporalFreshness: 98,
      verificationHistoryCount: 560,
    },
    schema: [
      { name: "grid_id", type: "string", nullable: false, example: "DSM-43N-201", description: "Elevation grid tile code" },
      { name: "z_min_meters", type: "number", nullable: false, example: "212.4", description: "Minimum ground elevation MSL" },
      { name: "z_max_meters", type: "number", nullable: false, example: "268.8", description: "Maximum surface height MSL" },
      { name: "vertical_datum", type: "string", nullable: false, example: "EGM96", description: "Vertical geoid reference datum" },
    ],
    assets: [
      { id: "AST-DSM-01", sourceId: "NAKSHA-DSM-DTM-2026", name: "dsm_surface_model.tif", assetType: "attributes", format: "GeoTIFF", sizeMb: 280.0, featureCount: 28900, crs: "EPSG:32643", lastUpdated: "2026-03-10", status: "READY" },
      { id: "AST-DTM-02", sourceId: "NAKSHA-DSM-DTM-2026", name: "dtm_bare_earth.tif", assetType: "attributes", format: "GeoTIFF", sizeMb: 195.0, featureCount: 28900, crs: "EPSG:32643", lastUpdated: "2026-03-10", status: "READY" },
    ],
    validation: {
      passed: true,
      summary: { geometry: "PASS", crs: "PASS", schema: "PASS", duplicates: "PASS", requiredFields: "PASS", missingAttributes: "PASS" },
      warnings: [],
      errors: [],
    },
    observedEntityIds: ["PARCEL-DEMO-014", "PARCEL-DEMO-015"],
  },
  {
    id: "NAKSHA-UTILITIES-NET",
    name: "Municipal Utility Network (Water, Power, Sewage)",
    type: "Government GIS",
    format: "GeoJSON",
    status: "CONNECTED",
    organization: "Urban Water Supply & Electricity Distribution Board",
    contactEmail: "utility-gis@cityutilities.gov.in",
    description: "Subsurface and overhead urban utility network assets including potable water pipelines, underground high-voltage conduits, stormwater drains, and gas distribution mains.",
    entityCount: 15400,
    assetCount: 3,
    lastUpdated: "2026-02-28T11:00:00Z",
    spatial: {
      crs: "EPSG:4326",
      crsName: "WGS 84 / World Geodetic System 1984",
      targetCrs: "EPSG:4326",
      transformationName: "Identity / WGS84 Direct Mapping",
      geometryType: "LineString",
      bbox: [77.198, 28.595, 77.215, 28.615],
      coveragePercentage: 96.5,
      spatialExtentDescription: "Municipal Utility Corridor Alignment",
      accuracyMeters: 0.15,
    },
    temporal: {
      observationDate: "2026-02-28",
      lastUpdated: "2026-02-28T11:00:00Z",
      dataVintage: "FY 2025-26 Utility GIS",
      updateFrequency: "Monthly",
    },
    quality: {
      completeness: 95,
      geometryValidity: 96,
      attributeCompleteness: 94,
      crsValidity: 100,
      duplicateRate: 1,
      overallQualityScore: 95.4,
      weights: { geometry: 0.3, attributes: 0.25, completeness: 0.2, crs: 0.15, duplicates: 0.1 },
    },
    reliability: {
      score: 93,
      level: "High",
      historicalConsistency: 94,
      geometryQuality: 95,
      attributeQuality: 92,
      temporalFreshness: 94,
      verificationHistoryCount: 380,
    },
    schema: [
      { name: "utility_id", type: "string", nullable: false, example: "UTIL-WTR-891", description: "Utility pipeline asset identifier" },
      { name: "utility_type", type: "string", nullable: false, example: "Potable Water Main", description: "Service type" },
      { name: "depth_m", type: "number", nullable: false, example: "1.8", description: "Subsurface burial depth in meters" },
      { name: "easement_buffer_m", type: "number", nullable: false, example: "2.5", description: "Statutory right-of-way buffer" },
    ],
    assets: [
      { id: "AST-UTIL-01", sourceId: "NAKSHA-UTILITIES-NET", name: "water_supply_lines.geojson", assetType: "roads", format: "GeoJSON", sizeMb: 12.8, featureCount: 6800, crs: "EPSG:4326", lastUpdated: "2026-02-28", status: "READY" },
      { id: "AST-UTIL-02", sourceId: "NAKSHA-UTILITIES-NET", name: "power_conduits.geojson", assetType: "roads", format: "GeoJSON", sizeMb: 9.4, featureCount: 5200, crs: "EPSG:4326", lastUpdated: "2026-02-28", status: "READY" },
    ],
    validation: {
      passed: true,
      summary: { geometry: "PASS", crs: "PASS", schema: "PASS", duplicates: "PASS", requiredFields: "PASS", missingAttributes: "PASS" },
      warnings: [],
      errors: [],
    },
    observedEntityIds: ["PARCEL-DEMO-014", "PARCEL-DEMO-015"],
  },
  {
    id: "NAKSHA-GEOAI-FOOTPRINTS",
    name: "GeoAI Feature-Extracted Building Footprints & 3D Heights",
    type: "Government GIS",
    format: "GeoJSON",
    status: "READY",
    organization: "GeoAI Deep Learning Laboratory (Bhoo-Mitra Engine)",
    contactEmail: "geoai-models@bhoomitra.gov.in",
    description: "Deep learning transformer-based computer vision extraction from 0.05m Drone ORI and DSM models, inferring exact roofline vectors, storeys, and built-up areas.",
    entityCount: 24100,
    assetCount: 2,
    lastUpdated: "2026-03-20T16:00:00Z",
    spatial: {
      crs: "EPSG:4326",
      crsName: "WGS 84 / World Geodetic System 1984",
      targetCrs: "EPSG:4326",
      transformationName: "Direct Inference Space",
      geometryType: "Polygon",
      bbox: [77.195, 28.585, 77.218, 28.618],
      coveragePercentage: 99.7,
      spatialExtentDescription: "Automated Urban 3D Building Extrusion Layer",
      accuracyMeters: 0.08,
    },
    temporal: {
      observationDate: "2026-03-20",
      lastUpdated: "2026-03-20T16:00:00Z",
      dataVintage: "AI Segmentation v4.2",
      updateFrequency: "Monthly",
    },
    quality: {
      completeness: 98,
      geometryValidity: 99,
      attributeCompleteness: 96,
      crsValidity: 100,
      duplicateRate: 0,
      overallQualityScore: 98.1,
      weights: { geometry: 0.3, attributes: 0.25, completeness: 0.2, crs: 0.15, duplicates: 0.1 },
    },
    reliability: {
      score: 97,
      level: "Very High",
      historicalConsistency: 98,
      geometryQuality: 98,
      attributeQuality: 96,
      temporalFreshness: 99,
      verificationHistoryCount: 720,
    },
    schema: [
      { name: "building_id", type: "string", nullable: false, example: "B-10482", description: "Auto-generated 3D building identifier" },
      { name: "height_m", type: "number", nullable: false, example: "18.5", description: "Inferred building elevation height" },
      { name: "floor_count", type: "number", nullable: false, example: "5", description: "Estimated vertical storeys" },
      { name: "roof_type", type: "string", nullable: false, example: "Flat Concrete Reinforced", description: "Roof classification" },
      { name: "ai_confidence", type: "number", nullable: false, example: "0.96", description: "Model segmentation confidence" },
    ],
    assets: [
      { id: "AST-BLDG-01", sourceId: "NAKSHA-GEOAI-FOOTPRINTS", name: "geoai_building_footprints.geojson", assetType: "buildings", format: "GeoJSON", sizeMb: 28.6, featureCount: 24100, crs: "EPSG:4326", lastUpdated: "2026-03-20", status: "READY" },
    ],
    validation: {
      passed: true,
      summary: { geometry: "PASS", crs: "PASS", schema: "PASS", duplicates: "PASS", requiredFields: "PASS", missingAttributes: "PASS" },
      warnings: [],
      errors: [],
    },
    observedEntityIds: ["PARCEL-DEMO-014", "PARCEL-DEMO-015"],
  },
];

let dataSourcesStore: DataSource[] = [...SYNTHETIC_SOURCES];
let ingestionJobsStore: IngestionJob[] = [
  { id: "JOB-101", sourceName: "Survey Boundaries SP-2291", filename: "survey_boundaries.geojson", format: "GeoJSON", progressPercent: 100, stage: "READY", statusText: "Completed & Ready for Harmonization" },
  { id: "JOB-102", sourceName: "Municipal Buildings Layer", filename: "municipal_buildings.geojson", format: "GeoJSON", progressPercent: 100, stage: "READY", statusText: "Completed & Verified" },
  { id: "JOB-103", sourceName: "Registry Parcels Batch 9", filename: "registry_parcels.geojson", format: "GeoJSON", progressPercent: 82, stage: "QUALITY CHECK", statusText: "Calculating geometry validity metrics…" },
];

// ---------------------------------------------------------------------------
// API Service Functions
// ---------------------------------------------------------------------------

export async function getDataSources(filters?: {
  type?: string;
  status?: string;
  query?: string;
}): Promise<DataSource[]> {
  const queryParams = new URLSearchParams();
  if (filters?.query) queryParams.set("query", filters.query);
  if (filters?.type && filters.type !== "ALL") queryParams.set("source_type", filters.type);
  if (filters?.status && filters.status !== "ALL") queryParams.set("status", filters.status);
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return fetchWithFallback(`/sources${queryString}`, async () => {
    let list = [...dataSourcesStore];
    if (!filters) return list;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.organization.toLowerCase().includes(q) ||
          s.spatial.crs.toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q) ||
          s.format.toLowerCase().includes(q)
      );
    }
    if (filters.type && filters.type !== "ALL") {
      list = list.filter((s) => s.type === filters.type);
    }
    if (filters.status && filters.status !== "ALL") {
      list = list.filter((s) => s.status === filters.status);
    }
    return list;
  });
}

export async function getDataSource(sourceId: string): Promise<DataSource | null> {
  return fetchWithFallback(`/sources/${sourceId}`, async () => {
    const found = dataSourcesStore.find((s) => s.id === sourceId);
    return found ? { ...found } : null;
  });
}

export async function getSourceAssets(sourceId: string): Promise<SourceAsset[]> {
  return fetchWithFallback(`/sources/${sourceId}/assets`, async () => {
    const src = await getDataSource(sourceId);
    return src ? [...src.assets] : [];
  });
}

export async function getSourceSchema(sourceId: string): Promise<SchemaField[]> {
  return fetchWithFallback(`/sources/${sourceId}/schema`, async () => {
    const src = await getDataSource(sourceId);
    return src ? [...src.schema] : [];
  });
}

export async function getSourceQuality(sourceId: string): Promise<QualitySignal | null> {
  return fetchWithFallback(`/sources/${sourceId}/quality`, async () => {
    const src = await getDataSource(sourceId);
    return src ? { ...src.quality } : null;
  });
}

export async function getSourceReliability(sourceId: string): Promise<SourceReliability | null> {
  return fetchWithFallback(`/sources/${sourceId}/reliability`, async () => {
    const src = await getDataSource(sourceId);
    return src ? { ...src.reliability } : null;
  });
}

export async function getIngestionStatus(): Promise<IngestionJob[]> {
  return fetchWithFallback(`/ingestion/jobs`, async () => {
    return [...ingestionJobsStore];
  });
}

export async function compareSources(sourceIds: string[]): Promise<DataSource[]> {
  return fetchWithFallback(`/sources/compare?ids=${sourceIds.join(",")}`, async () => {
    return dataSourcesStore.filter((s) => sourceIds.includes(s.id));
  });
}

/**
 * Deterministic Simulation of Add Data Source / Demo Ingestion
 */
export async function startDemoIngestion(params: {
  filename: string;
  sourceName: string;
  sourceType: SourceType;
  format: FileFormat;
  crs: string;
  onProgress?: (job: IngestionJob) => void;
}): Promise<DataSource> {
  const jobId = `JOB-${Math.floor(100 + Math.random() * 900)}`;
  const sourceId = `SRC-DEMO-${Math.floor(1000 + Math.random() * 9000)}`;

  let job: IngestionJob = {
    id: jobId,
    sourceName: params.sourceName,
    filename: params.filename,
    format: params.format,
    progressPercent: 10,
    stage: "READING",
    statusText: "Reading file headers and feature counts…",
  };

  ingestionJobsStore.unshift(job);
  params.onProgress?.({ ...job });

  // Step 1: Record start audit event
  await recordAuditEvent({
    actorId: "USR-CURRENT-OFFICER",
    actorName: "Rajesh Kumar",
    actorRole: "Senior Revenue Officer",
    action: "SOURCE_IMPORTED",
    module: "Sources",
    sourceId: sourceId,
    reason: `Initiated ingestion for synthetic dataset: ${params.filename} (${params.format}).`,
    metadata: { filename: params.filename, crs: params.crs },
  });

  const newSource: DataSource = {
    id: sourceId,
    name: params.sourceName,
    type: params.sourceType,
    format: params.format,
    status: "READY",
    organization: "State Remote Sensing & GIS Application Center",
    contactEmail: "ingestion@state-gis.gov.in",
    description: `Synthetic demonstration dataset ${params.filename} ingested via automated GIS validation pipeline.`,
    entityCount: 1240,
    assetCount: 1,
    lastUpdated: new Date().toISOString(),
    spatial: {
      crs: params.crs,
      crsName: params.crs === "EPSG:32643" ? "WGS 84 / UTM Zone 43N" : "WGS 84 / World Geodetic System 1984",
      targetCrs: "EPSG:4326",
      transformationName: params.crs === "EPSG:32643" ? "UTM Zone 43N → WGS84" : "Direct WGS84",
      geometryType: "Polygon",
      bbox: [77.201, 28.599, 77.205, 28.604],
      coveragePercentage: 96.0,
      spatialExtentDescription: "Ingested Spatial Envelope Zone 4",
      accuracyMeters: 0.1,
    },
    temporal: {
      observationDate: new Date().toISOString().split("T")[0]!,
      lastUpdated: new Date().toISOString(),
      dataVintage: "Demographic Ingestion FY2026",
      updateFrequency: "Ad-hoc",
    },
    quality: {
      completeness: 96,
      geometryValidity: 98,
      attributeCompleteness: 94,
      crsValidity: 100,
      duplicateRate: 1,
      overallQualityScore: 96.2,
      weights: { geometry: 0.3, attributes: 0.25, completeness: 0.2, crs: 0.15, duplicates: 0.1 },
    },
    reliability: {
      score: 94,
      level: "High",
      historicalConsistency: 95,
      geometryQuality: 98,
      attributeQuality: 94,
      temporalFreshness: 100,
      verificationHistoryCount: 12,
    },
    schema: [
      { name: "parcel_id", type: "string", nullable: false, example: "P-DEMO-99", description: "Ingested parcel index" },
      { name: "land_use", type: "string", nullable: true, example: "Commercial", description: "Zoning classification" },
      { name: "area", type: "number", nullable: false, example: "1240.5", description: "Calculated area m²" },
    ],
    assets: [
      { id: `AST-${sourceId}`, sourceId: sourceId, name: params.filename, assetType: "parcels", format: params.format, sizeMb: 5.4, featureCount: 1240, crs: params.crs, lastUpdated: new Date().toISOString().split("T")[0]!, status: "READY" },
    ],
    validation: {
      passed: true,
      summary: { geometry: "PASS", crs: "PASS", schema: "PASS", duplicates: "PASS", requiredFields: "PASS", missingAttributes: "PASS" },
      warnings: [],
      errors: [],
    },
    observedEntityIds: ["PARCEL-DEMO-014"],
  };

  dataSourcesStore.unshift(newSource);

  // Finish job
  ingestionJobsStore = ingestionJobsStore.map((j) =>
    j.id === jobId
      ? { ...j, progressPercent: 100, stage: "READY", statusText: "Completed & Ready for Harmonization" }
      : j
  );

  return newSource;
}
