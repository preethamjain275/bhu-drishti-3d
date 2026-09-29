/**
 * BHOO-MITRA AI — Evidence Intelligence Demo Data
 *
 * ⚠️  SYNTHETIC DEMONSTRATION DATA — NOT REAL GOVERNMENT RECORDS ⚠️
 *
 * This module provides the synthetic evidence dataset and graph models for Prompt 7.
 * All identifiers, hashes, assets, and scores are fictitious demonstration values.
 */

export type EvidenceType =
  | "SOURCE_RECORD"
  | "GEOMETRY_OBSERVATION"
  | "ATTRIBUTE_OBSERVATION"
  | "TEMPORAL_OBSERVATION"
  | "SURVEY_OBSERVATION"
  | "SPATIAL_RELATIONSHIP"
  | "QUALITY_SIGNAL"
  | "VERIFICATION_RECORD";

export interface QualitySignal {
  name: string;
  score: number; // 0-100
  rating: "HIGH" | "MEDIUM" | "LOW";
  details: string;
}

export interface CustodyStep {
  stage: string;
  timestamp: string;
  agent: string;
}

export interface ProvenanceChain {
  sourceName: string;
  sourceType: string;
  assetName: string;
  observationId: string;
  ingestionDate: string;
  checksum: string;
  processingStatus: "VALID_DEMO_EVIDENCE" | "UNVERIFIED" | "ARCHIVED";
  custodyChain: CustodyStep[];
}

export interface EvidenceReliability {
  sourceQuality: number; // 0-100
  observationConfidence: number; // 0-100
  temporalFreshness: number; // 0-100
  crossSourceAgreement: number; // 0-100
  overallStrength: number; // 0-100
}

export interface ConflictEvidence {
  id: string;
  conflictId: string;
  entityId: string;
  sourceId: string;
  sourceName: string;
  evidenceType: EvidenceType;
  title: string;
  description: string;
  observationDate: string;
  ingestionDate: string;
  coordinates: [number, number]; // [lng, lat]
  geometryReference?: {
    areaM2: number;
    perimeterM: number;
    vertexCount: number;
    featureId: string;
  };
  attributeReference?: Record<string, string>;
  confidence: number; // 0-100
  reliability: EvidenceReliability;
  provenance: ProvenanceChain;
  qualitySignals: QualitySignal[];
  whyMatters: string;
  relatedEvidenceIds: string[];
  status: "VALID_DEMO_EVIDENCE" | "INCOMPLETE_EVIDENCE" | "ARCHIVED";
}

export interface SourceReliabilityProfile {
  id: string;
  name: string;
  shortName: string;
  badgeColor: string;
  geometryQuality: number;
  attributeCompleteness: number;
  temporalFreshness: number;
  overallQuality: number;
  activeEvidenceCount: number;
  description: string;
}

// ---------------------------------------------------------------------------
// Source Reliability Profiles
// ---------------------------------------------------------------------------

export const SOURCE_QUALITY_PROFILES: SourceReliabilityProfile[] = [
  {
    id: "municipal",
    name: "Municipal GIS System",
    shortName: "Municipal GIS",
    badgeColor: "#06b6d4",
    geometryQuality: 92,
    attributeCompleteness: 89,
    temporalFreshness: 84,
    overallQuality: 88,
    activeEvidenceCount: 6,
    description: "Official ward-level GIS polygons vectorized from approved town planning schemes.",
  },
  {
    id: "registry",
    name: "Property Registration & Revenue Ledger",
    shortName: "Property Registry",
    badgeColor: "#f59e0b",
    geometryQuality: 86,
    attributeCompleteness: 94,
    temporalFreshness: 91,
    overallQuality: 90,
    activeEvidenceCount: 6,
    description: "Deed conveyance records, registered sale certificates, and mutation references.",
  },
  {
    id: "survey",
    name: "High-Resolution Aerial Drone & Field Survey",
    shortName: "Drone Survey",
    badgeColor: "#10b981",
    geometryQuality: 97,
    attributeCompleteness: 90,
    temporalFreshness: 95,
    overallQuality: 94,
    activeEvidenceCount: 6,
    description: "Sub-5cm Ground Sample Distance (GSD) photogrammetric orthomosaic and RTK-GNSS.",
  },
];

// ---------------------------------------------------------------------------
// 18 Rich Synthetic Evidence Records
// ---------------------------------------------------------------------------

export const SYNTHETIC_EVIDENCE: ConflictEvidence[] = [
  {
    id: "EVIDENCE-DEMO-001",
    conflictId: "CONFLICT-DEMO-001",
    entityId: "PARCEL-DEMO-014",
    sourceId: "municipal",
    sourceName: "Municipal GIS",
    evidenceType: "GEOMETRY_OBSERVATION",
    title: "Municipal Cadastral Vector Polygon",
    description: "Digitized cadastral parcel polygon from Municipal Master Plan Layer (Ward 14). Reports 2,430 m² parcel envelope with northern setback offset.",
    observationDate: "2024-06-12",
    ingestionDate: "2026-08-10",
    coordinates: [77.2018, 28.6012],
    geometryReference: {
      areaM2: 2430,
      perimeterM: 198.4,
      vertexCount: 4,
      featureId: "MUNI-GEO-014",
    },
    confidence: 94,
    reliability: {
      sourceQuality: 92,
      observationConfidence: 94,
      temporalFreshness: 84,
      crossSourceAgreement: 86,
      overallStrength: 89,
    },
    provenance: {
      sourceName: "Municipal GIS",
      sourceType: "Vector Cadastre (GeoJSON)",
      assetName: "municipal_parcels_ward14_demo.geojson",
      observationId: "OBS-DEMO-014-MUNI",
      ingestionDate: "2026-08-10 10:14 IST",
      checksum: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "Extracted from Municipal WFS", timestamp: "2026-08-10 10:14", agent: "Spatial Ingestion Connector" },
        { stage: "Reprojected to EPSG:7760", timestamp: "2026-08-10 10:15", agent: "CRS Normalizer" },
        { stage: "Indexed for Harmonization", timestamp: "2026-08-10 10:16", agent: "Entity Matcher" },
      ],
    },
    qualitySignals: [
      { name: "Geometry Completeness", score: 95, rating: "HIGH", details: "Closed polygon with valid topological ring" },
      { name: "Attribute Completeness", score: 88, rating: "HIGH", details: "Municipal ID, land use, and ward tags populated" },
      { name: "Positional Accuracy", score: 82, rating: "MEDIUM", details: "Derived from scanned raster vectorization (±1.5m tolerance)" },
      { name: "Temporal Freshness", score: 80, rating: "MEDIUM", details: "Last synchronized June 2024" },
    ],
    whyMatters: "Constitutes the official local municipal baseline for tax assessments and building permissions, but lags behind recent conveyance deed acquisitions.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-002", "EVIDENCE-DEMO-003"],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-002",
    conflictId: "CONFLICT-DEMO-001",
    entityId: "PARCEL-DEMO-014",
    sourceId: "registry",
    sourceName: "Property Registry",
    evidenceType: "SOURCE_RECORD",
    title: "Registered Conveyance Deed & Schedule Plan",
    description: "Registered sale deed plan (Doc No. REG-9912/2025) describing 2,510 m² commercial holding with modified northern access corridor easement.",
    observationDate: "2025-01-18",
    ingestionDate: "2026-08-15",
    coordinates: [77.2018, 28.6012],
    attributeReference: {
      deedNumber: "REG-9912/2025",
      registeredArea: "2,510 m²",
      propertyClass: "Commercial",
      ownerRef: "DL-IND-082",
    },
    confidence: 96,
    reliability: {
      sourceQuality: 90,
      observationConfidence: 96,
      temporalFreshness: 91,
      crossSourceAgreement: 88,
      overallStrength: 91,
    },
    provenance: {
      sourceName: "Property Registry",
      sourceType: "Structured OCR & Cadastral Deed Annexure",
      assetName: "registry_conveyance_reg9912_demo.pdf",
      observationId: "OBS-DEMO-014-REG",
      ingestionDate: "2026-08-15 14:22 IST",
      checksum: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "Ingested via Land Registry API", timestamp: "2026-08-15 14:22", agent: "Registry Ingestion Service" },
        { stage: "OCR & Metadata Extraction", timestamp: "2026-08-15 14:23", agent: "Doc Parser" },
      ],
    },
    qualitySignals: [
      { name: "Legal Authority", score: 98, rating: "HIGH", details: "Registered government conveyance deed under Registration Act" },
      { name: "Attribute Integrity", score: 95, rating: "HIGH", details: "All stamp duty, valuation, and ownership schedules present" },
      { name: "Geometric Precision", score: 78, rating: "MEDIUM", details: "Deed plan is schematic without absolute GNSS coordinates" },
    ],
    whyMatters: "Provides authoritative legal title and deed area of 2,510 m², establishing legal basis for the property boundary extension.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-001", "EVIDENCE-DEMO-003"],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-003",
    conflictId: "CONFLICT-DEMO-001",
    entityId: "PARCEL-DEMO-014",
    sourceId: "survey",
    sourceName: "Drone Survey",
    evidenceType: "SURVEY_OBSERVATION",
    title: "High-Resolution Drone Orthomosaic Boundary",
    description: "RTK-referenced photogrammetric boundary extraction (GSD: 3.2cm/px). Delineates physical compound wall enclosing 2,465 m².",
    observationDate: "2025-11-04",
    ingestionDate: "2026-09-01",
    coordinates: [77.2018, 28.6012],
    geometryReference: {
      areaM2: 2465,
      perimeterM: 203.2,
      vertexCount: 6,
      featureId: "SURV-ORTHO-014",
    },
    confidence: 98,
    reliability: {
      sourceQuality: 97,
      observationConfidence: 98,
      temporalFreshness: 95,
      crossSourceAgreement: 92,
      overallStrength: 96,
    },
    provenance: {
      sourceName: "Drone Survey",
      sourceType: "GeoTIFF Orthomosaic & RTK Survey Vector",
      assetName: "drone_survey_ward14_flight08_demo.tif",
      observationId: "OBS-DEMO-014-SURV",
      ingestionDate: "2026-09-01 09:45 IST",
      checksum: "sha256:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "UAV Flight Execution (RTK Fixed)", timestamp: "2025-11-04 11:30", agent: "Survey Directorate UAV Crew" },
        { stage: "Photogrammetry Bundle Adjustment", timestamp: "2025-11-05 16:00", agent: "GIS Processing Pipeline" },
        { stage: "Vector Boundary Extraction", timestamp: "2026-09-01 09:45", agent: "AI Feature Extractor" },
      ],
    },
    qualitySignals: [
      { name: "Positional Accuracy", score: 99, rating: "HIGH", details: "RTK-GNSS control points verified (RMS error < 2.4cm)" },
      { name: "Visual Clarity", score: 98, rating: "HIGH", details: "Sub-5cm orthomosaic with crisp perimeter wall edges" },
      { name: "Temporal Freshness", score: 95, rating: "HIGH", details: "Recent aerial capture from late 2025" },
    ],
    whyMatters: "Establishes undeniable physical ground truth that compound masonry wall encloses 2,465 m² with 6 distinct vertex corner stones.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-001", "EVIDENCE-DEMO-002"],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-004",
    conflictId: "CONFLICT-DEMO-002",
    entityId: "PARCEL-DEMO-002",
    sourceId: "registry",
    sourceName: "Property Registry",
    evidenceType: "SPATIAL_RELATIONSHIP",
    title: "Registered Deed Title Conflict Record",
    description: "Conveyance deed registration from 2024 claims eastern 118 m² passage overlapping with adjoining registered title for PARCEL-DEMO-003.",
    observationDate: "2024-08-15",
    ingestionDate: "2026-08-20",
    coordinates: [77.202, 28.6005],
    attributeReference: {
      overlapArea: "118 m²",
      conflictingEntity: "PARCEL-DEMO-003",
      deedReference: "REG-2024-8812",
    },
    confidence: 98,
    reliability: {
      sourceQuality: 90,
      observationConfidence: 98,
      temporalFreshness: 91,
      crossSourceAgreement: 94,
      overallStrength: 93,
    },
    provenance: {
      sourceName: "Property Registry",
      sourceType: "Cadastral Deed Ledger",
      assetName: "registry_overlap_log_ward12_demo.json",
      observationId: "OBS-DEMO-002-TOP",
      ingestionDate: "2026-08-20 11:10 IST",
      checksum: "sha256:3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "Ingested via Registry Sync", timestamp: "2026-08-20 11:10", agent: "Topology Connector" },
      ],
    },
    qualitySignals: [
      { name: "Topological Verification", score: 99, rating: "HIGH", details: "Intersection polygon geometry verified by PostGIS ST_Intersection" },
      { name: "Legal Document Linkage", score: 95, rating: "HIGH", details: "Dual deed references identified in registration ledger" },
    ],
    whyMatters: "Direct evidence of double-allocation under Registration Act requiring title rectification.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-005"],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-005",
    conflictId: "CONFLICT-DEMO-002",
    entityId: "PARCEL-DEMO-002",
    sourceId: "municipal",
    sourceName: "Municipal GIS",
    evidenceType: "QUALITY_SIGNAL",
    title: "Dual Municipal Tax Assessment Notice",
    description: "Municipal tax roll records show both property owners billed for the identical 118 m² commercial frontage.",
    observationDate: "2025-03-31",
    ingestionDate: "2026-08-22",
    coordinates: [77.202, 28.6005],
    confidence: 95,
    reliability: {
      sourceQuality: 88,
      observationConfidence: 95,
      temporalFreshness: 86,
      crossSourceAgreement: 90,
      overallStrength: 90,
    },
    provenance: {
      sourceName: "Municipal GIS",
      sourceType: "Tax Assessment Register",
      assetName: "municipal_tax_roll_ward12_demo.csv",
      observationId: "OBS-DEMO-002-TAX",
      ingestionDate: "2026-08-22 16:30 IST",
      checksum: "sha256:2c6ee2ea130a098d3609108e038a8b11e0e3b307d69c290f5f696c32290f9cb6",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "Extracted from Municipal Tax DB", timestamp: "2026-08-22 16:30", agent: "Fiscal Data Ingest" },
      ],
    },
    qualitySignals: [
      { name: "Audit Trail Completeness", score: 94, rating: "HIGH", details: "Includes assessment receipt numbers and property IDs" },
    ],
    whyMatters: "Confirms that administrative overlap exists at both tax and title levels.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-004"],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-006",
    conflictId: "CONFLICT-DEMO-003",
    entityId: "PARCEL-DEMO-005",
    sourceId: "survey",
    sourceName: "Drone Survey",
    evidenceType: "ATTRIBUTE_OBSERVATION",
    title: "Multispectral Satellite & Drone Built-Up Index",
    description: "Multispectral classification (NDVI < 0.11, NDBI > 0.84) confirming active 1,800 m² industrial warehouse constructed on land classified as agricultural in revenue records.",
    observationDate: "2026-01-20",
    ingestionDate: "2026-09-05",
    coordinates: [77.2022, 28.602],
    confidence: 96,
    reliability: {
      sourceQuality: 97,
      observationConfidence: 96,
      temporalFreshness: 96,
      crossSourceAgreement: 92,
      overallStrength: 95,
    },
    provenance: {
      sourceName: "Drone Survey",
      sourceType: "Multispectral Remote Sensing",
      assetName: "multispectral_landuse_ward15_demo.tif",
      observationId: "OBS-DEMO-005-SAT",
      ingestionDate: "2026-09-05 15:40 IST",
      checksum: "sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "Remote Sensing Image Ingestion", timestamp: "2026-09-05 15:40", agent: "Earth Observation Pipeline" },
      ],
    },
    qualitySignals: [
      { name: "Spectral Accuracy", score: 96, rating: "HIGH", details: "Calibrated surface reflectance validated against ground targets" },
    ],
    whyMatters: "Empirical proof of non-agricultural land use for revenue conversion regularization.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-007"],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-007",
    conflictId: "CONFLICT-DEMO-003",
    entityId: "PARCEL-DEMO-005",
    sourceId: "municipal",
    sourceName: "Municipal GIS",
    evidenceType: "SOURCE_RECORD",
    title: "Municipal Industrial License #ML-2023-909",
    description: "Municipal trade and factory operating license issued for light industrial manufacturing in Zone IND-2.",
    observationDate: "2023-09-14",
    ingestionDate: "2026-08-25",
    coordinates: [77.2022, 28.602],
    confidence: 93,
    reliability: {
      sourceQuality: 90,
      observationConfidence: 93,
      temporalFreshness: 86,
      crossSourceAgreement: 90,
      overallStrength: 90,
    },
    provenance: {
      sourceName: "Municipal GIS",
      sourceType: "Municipal Trade License Store",
      assetName: "factory_license_ml909_demo.pdf",
      observationId: "OBS-DEMO-005-LIC",
      ingestionDate: "2026-08-25 12:00 IST",
      checksum: "sha256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "License Document Parsing", timestamp: "2026-08-25 12:00", agent: "Trade Registry Connector" },
      ],
    },
    qualitySignals: [
      { name: "Statutory Validity", score: 95, rating: "HIGH", details: "Issued under Municipal Corporation Act Section 342" },
    ],
    whyMatters: "Demonstrates municipal government recognized industrial status despite state revenue ledger staying agricultural.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-006"],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-008",
    conflictId: "CONFLICT-DEMO-004",
    entityId: "PARCEL-DEMO-001",
    sourceId: "municipal",
    sourceName: "Municipal GIS",
    evidenceType: "SOURCE_RECORD",
    title: "Gazette Notification Road Reservation Annexure",
    description: "Official statutory road widening notification (GZ-2018-04) recording voluntary 80 m² front strip cession by property owner.",
    observationDate: "2018-04-10",
    ingestionDate: "2026-08-11",
    coordinates: [77.2005, 28.6005],
    confidence: 92,
    reliability: {
      sourceQuality: 94,
      observationConfidence: 92,
      temporalFreshness: 76,
      crossSourceAgreement: 88,
      overallStrength: 87,
    },
    provenance: {
      sourceName: "Municipal GIS",
      sourceType: "Gazette Archive",
      assetName: "gazette_road_widening_2018_demo.pdf",
      observationId: "OBS-DEMO-001-GAZ",
      ingestionDate: "2026-08-11 09:15 IST",
      checksum: "sha256:59b76a7ced55c9118c7d6928e18471c12d4a66a1a8c7b8dfa344933a3528b809",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "Town Planning Archive Sync", timestamp: "2026-08-11 09:15", agent: "Gazette Ingestion Script" },
      ],
    },
    qualitySignals: [
      { name: "Statutory Authority", score: 99, rating: "HIGH", details: "Published in official state gazette" },
    ],
    whyMatters: "Directly explains the 80 m² difference between 1,280 m² registry deed and 1,200 m² current GIS polygon.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-009"],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-009",
    conflictId: "CONFLICT-DEMO-004",
    entityId: "PARCEL-DEMO-001",
    sourceId: "survey",
    sourceName: "Drone Survey",
    evidenceType: "GEOMETRY_OBSERVATION",
    title: "Post-Widening Curb Line Survey",
    description: "Drone survey mapping shows active pedestrian sidewalk built on the 80 m² strip with new compound wall built at 1,202 m² boundary.",
    observationDate: "2026-06-15",
    ingestionDate: "2026-09-02",
    coordinates: [77.2005, 28.6005],
    confidence: 97,
    reliability: {
      sourceQuality: 97,
      observationConfidence: 97,
      temporalFreshness: 98,
      crossSourceAgreement: 95,
      overallStrength: 97,
    },
    provenance: {
      sourceName: "Drone Survey",
      sourceType: "Vectorized Orthophoto",
      assetName: "survey_northsector_2026_demo.geojson",
      observationId: "OBS-DEMO-001-SURV",
      ingestionDate: "2026-09-02 10:00 IST",
      checksum: "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "Survey Vector Verification", timestamp: "2026-09-02 10:00", agent: "GIS Field Engine" },
      ],
    },
    qualitySignals: [
      { name: "Ground Verification", score: 99, rating: "HIGH", details: "Curb line and sidewalk verified on-ground" },
    ],
    whyMatters: "Validates that physical boundary matches the 1,200 m² municipal polygon after statutory road widening.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-008"],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-010",
    conflictId: "CONFLICT-DEMO-005",
    entityId: "PARCEL-DEMO-008",
    sourceId: "registry",
    sourceName: "Property Registry",
    evidenceType: "TEMPORAL_OBSERVATION",
    title: "Subdivision Deed Annexure #SUB-2023-441",
    description: "Registered family partition deed splitting parent parcel 8 into Plot 8A (1,050 m²) and Plot 8B (1,050 m²).",
    observationDate: "2023-11-20",
    ingestionDate: "2026-08-18",
    coordinates: [77.2035, 28.6025],
    confidence: 94,
    reliability: {
      sourceQuality: 90,
      observationConfidence: 94,
      temporalFreshness: 88,
      crossSourceAgreement: 92,
      overallStrength: 91,
    },
    provenance: {
      sourceName: "Property Registry",
      sourceType: "Deed Partition Register",
      assetName: "subdivision_deed_8ab_demo.pdf",
      observationId: "OBS-DEMO-008-SUB",
      ingestionDate: "2026-08-18 11:30 IST",
      checksum: "sha256:d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "Partition Deed Extraction", timestamp: "2026-08-18 11:30", agent: "Registry Linker" },
      ],
    },
    qualitySignals: [
      { name: "Legal Document Authenticity", score: 96, rating: "HIGH", details: "Duly registered partition with tax clearance" },
    ],
    whyMatters: "Proves that parent parcel was legally subdivided in 2023, while Municipal GIS retained undivided 2019 polygon.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-011"],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-011",
    conflictId: "CONFLICT-DEMO-005",
    entityId: "PARCEL-DEMO-008",
    sourceId: "survey",
    sourceName: "Drone Survey",
    evidenceType: "SURVEY_OBSERVATION",
    title: "Drone Imagery Confirming Dual Residential Units",
    description: "Drone imagery showing two distinct independent residential buildings separated by 2m boundary wall and separate access gates.",
    observationDate: "2026-08-02",
    ingestionDate: "2026-09-03",
    coordinates: [77.2035, 28.6025],
    confidence: 98,
    reliability: {
      sourceQuality: 97,
      observationConfidence: 98,
      temporalFreshness: 99,
      crossSourceAgreement: 95,
      overallStrength: 97,
    },
    provenance: {
      sourceName: "Drone Survey",
      sourceType: "Orthomosaic Imagery",
      assetName: "drone_subdivision_ward16_demo.tif",
      observationId: "OBS-DEMO-008-IMG",
      ingestionDate: "2026-09-03 14:15 IST",
      checksum: "sha256:4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "Feature Extraction & Partition Detection", timestamp: "2026-09-03 14:15", agent: "Computer Vision Module" },
      ],
    },
    qualitySignals: [
      { name: "Visual Corroboration", score: 99, rating: "HIGH", details: "Clear visual partition wall with distinct rooftop footprints" },
    ],
    whyMatters: "Provides visual ground truth validating the 2023 subdivision deed.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-010"],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-012",
    conflictId: "CONFLICT-DEMO-007",
    entityId: "PARCEL-DEMO-022",
    sourceId: "survey",
    sourceName: "Drone Survey",
    evidenceType: "GEOMETRY_OBSERVATION",
    title: "L-Shaped Boundary Survey Vector",
    description: "Photogrammetric survey identifying 6-vertex L-shaped parcel geometry where a 95 m² corner cutout accommodates a public electrical transformer.",
    observationDate: "2026-07-20",
    ingestionDate: "2026-09-04",
    coordinates: [77.2028, 28.6015],
    confidence: 96,
    reliability: {
      sourceQuality: 97,
      observationConfidence: 96,
      temporalFreshness: 97,
      crossSourceAgreement: 90,
      overallStrength: 95,
    },
    provenance: {
      sourceName: "Drone Survey",
      sourceType: "Survey Vector Feature",
      assetName: "survey_eastgate_ward13_demo.geojson",
      observationId: "OBS-DEMO-022-SURV",
      ingestionDate: "2026-09-04 16:30 IST",
      checksum: "sha256:4b43b0aee35624cd95b910189b3dc2312fa64e3a0937a092ffc929a5927d49ee",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "Survey Vectorization", timestamp: "2026-09-04 16:30", agent: "GIS Processing" },
      ],
    },
    qualitySignals: [
      { name: "Geometric Fidelity", score: 97, rating: "HIGH", details: "All 6 vertices surveyed with RTK-GNSS" },
    ],
    whyMatters: "Proves that physical parcel is L-shaped due to electricity transformer acquisition.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-013"],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-013",
    conflictId: "CONFLICT-DEMO-007",
    entityId: "PARCEL-DEMO-022",
    sourceId: "registry",
    sourceName: "Property Registry",
    evidenceType: "SOURCE_RECORD",
    title: "Electricity Board Easement Deed Transfer",
    description: "Registered easement agreement from 2021 transferring 95 m² corner to State Power Distribution Corp.",
    observationDate: "2021-05-14",
    ingestionDate: "2026-08-20",
    coordinates: [77.2028, 28.6015],
    confidence: 95,
    reliability: {
      sourceQuality: 90,
      observationConfidence: 95,
      temporalFreshness: 82,
      crossSourceAgreement: 94,
      overallStrength: 90,
    },
    provenance: {
      sourceName: "Property Registry",
      sourceType: "Utility Easement Register",
      assetName: "easement_powercorp_2021_demo.pdf",
      observationId: "OBS-DEMO-022-ELEC",
      ingestionDate: "2026-08-20 15:00 IST",
      checksum: "sha256:fb8e20fc2e4c3f248c60c39bd652f3c1347298ab97b8b4d324bd10093fc27371",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "Utility Deed Ingestion", timestamp: "2026-08-20 15:00", agent: "Doc Registry Pipeline" },
      ],
    },
    qualitySignals: [
      { name: "Legal Document Linkage", score: 97, rating: "HIGH", details: "Signed tripartite deed between owner, municipal authority, and power utility" },
    ],
    whyMatters: "Explains why survey found an L-shaped parcel while base cadastral map retained rectangular outline.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-012"],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-014",
    conflictId: "CONFLICT-DEMO-010",
    entityId: "PARCEL-DEMO-050",
    sourceId: "survey",
    sourceName: "Drone Survey",
    evidenceType: "GEOMETRY_OBSERVATION",
    title: "Airborne LIDAR Flood Buffer Point Cloud",
    description: "High-density airborne LIDAR point cloud (35 pts/m²) revealing 2.4m masonry perimeter wall constructed 5.2m inside statutory 6m stormwater drain reserve.",
    observationDate: "2026-09-10",
    ingestionDate: "2026-09-24",
    coordinates: [77.2032, 28.6019],
    confidence: 99,
    reliability: {
      sourceQuality: 98,
      observationConfidence: 99,
      temporalFreshness: 99,
      crossSourceAgreement: 96,
      overallStrength: 98,
    },
    provenance: {
      sourceName: "Drone Survey",
      sourceType: "Airborne LIDAR Point Cloud (.LAZ)",
      assetName: "lidar_stormwater_buffer_ward15_demo.laz",
      observationId: "OBS-DEMO-050-LIDAR",
      ingestionDate: "2026-09-24 14:00 IST",
      checksum: "sha256:6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "LIDAR Flight Capture", timestamp: "2026-09-10 10:00", agent: "Airborne LIDAR Mission 04" },
        { stage: "Classification & DEM Extraction", timestamp: "2026-09-12 18:00", agent: "Point Cloud Processor" },
        { stage: "Encroachment Vectorization", timestamp: "2026-09-24 14:00", agent: "Hydrology Safety Engine" },
      ],
    },
    qualitySignals: [
      { name: "Elevation & Spatial Accuracy", score: 99, rating: "HIGH", details: "Vertical accuracy ±2.1cm, horizontal accuracy ±3.4cm" },
      { name: "Statutory Environmental Hazard", score: 98, rating: "HIGH", details: "Clear violation of Flood Zone Regulation Section 12" },
    ],
    whyMatters: "High-precision structural proof of encroachment on critical flood-prevention stormwater corridor.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-015"],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-015",
    conflictId: "CONFLICT-DEMO-010",
    entityId: "PARCEL-DEMO-050",
    sourceId: "municipal",
    sourceName: "Municipal GIS",
    evidenceType: "SOURCE_RECORD",
    title: "Master Plan Stormwater Buffer Statutory Layer",
    description: "Official statutory drainage reserve zone layer demarcating mandatory 6.0m buffer along Trunk Drain #4.",
    observationDate: "2022-01-15",
    ingestionDate: "2026-08-05",
    coordinates: [77.2032, 28.6019],
    confidence: 96,
    reliability: {
      sourceQuality: 95,
      observationConfidence: 96,
      temporalFreshness: 88,
      crossSourceAgreement: 95,
      overallStrength: 94,
    },
    provenance: {
      sourceName: "Municipal GIS",
      sourceType: "Statutory Master Plan Buffer Vector",
      assetName: "masterplan_drain_buffers_2022_demo.geojson",
      observationId: "OBS-DEMO-050-MUNI",
      ingestionDate: "2026-08-05 11:00 IST",
      checksum: "sha256:d82c4eb52614e52e4077fa7772f51bbd82716ce2a06b4bee9d1e8e3e38f4c830",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "Master Plan Statutory Ingestion", timestamp: "2026-08-05 11:00", agent: "Urban Planning Connector" },
      ],
    },
    qualitySignals: [
      { name: "Statutory Binding Power", score: 99, rating: "HIGH", details: "Approved by State Urban Development Authority" },
    ],
    whyMatters: "Defines the non-negotiable legal setback line that the current compound wall violates.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-014"],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-016",
    conflictId: "CONFLICT-DEMO-008",
    entityId: "PARCEL-DEMO-031",
    sourceId: "registry",
    sourceName: "Property Registry",
    evidenceType: "ATTRIBUTE_OBSERVATION",
    title: "Scanned Deed Ledger Page (Vol 442 Pg 88)",
    description: "High-resolution scanned image of physical 1998 deed volume 442 page 88 showing handwritten survey number '112/3A', confirming digitization typo '112/3B'.",
    observationDate: "1998-04-12",
    ingestionDate: "2026-08-28",
    coordinates: [77.2016, 28.6008],
    confidence: 95,
    reliability: {
      sourceQuality: 92,
      observationConfidence: 95,
      temporalFreshness: 80,
      crossSourceAgreement: 96,
      overallStrength: 91,
    },
    provenance: {
      sourceName: "Property Registry",
      sourceType: "High-Res Historical Deed Scan",
      assetName: "deed_vol442_pg88_scan_demo.jpg",
      observationId: "OBS-DEMO-031-SCAN",
      ingestionDate: "2026-08-28 14:45 IST",
      checksum: "sha256:01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "Deed Book Archival Scan (600 DPI)", timestamp: "2026-08-28 14:45", agent: "Archival Scanning Crew" },
        { stage: "Human Verification of Handwritten Entry", timestamp: "2026-08-28 16:00", agent: "Registry Archivist" },
      ],
    },
    qualitySignals: [
      { name: "Primary Source Authenticity", score: 99, rating: "HIGH", details: "Physical deed ledger entry with sub-registrar stamp" },
    ],
    whyMatters: "Conclusively resolves the attribute mismatch as a clerk transcription typo during the 2020 digital indexing drive.",
    relatedEvidenceIds: [],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-017",
    conflictId: "CONFLICT-DEMO-012",
    entityId: "PARCEL-DEMO-064",
    sourceId: "municipal",
    sourceName: "Municipal GIS",
    evidenceType: "VERIFICATION_RECORD",
    title: "Land Acquisition Award Order #RO-2023-887",
    description: "Formal land acquisition compensation award order documenting 120 m² public strip acquisition and completed compensation disbursement.",
    observationDate: "2023-09-10",
    ingestionDate: "2026-08-14",
    coordinates: [77.2014, 28.6016],
    confidence: 97,
    reliability: {
      sourceQuality: 96,
      observationConfidence: 97,
      temporalFreshness: 90,
      crossSourceAgreement: 95,
      overallStrength: 95,
    },
    provenance: {
      sourceName: "Municipal GIS",
      sourceType: "Statutory Land Acquisition Order",
      assetName: "award_order_ro887_demo.pdf",
      observationId: "OBS-DEMO-064-AWD",
      ingestionDate: "2026-08-14 10:30 IST",
      checksum: "sha256:1a1dc91c907325c69271ddf0c944bc72e008d5113d09a0a09e0a969b821dd448",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "Acquisition Order Indexing", timestamp: "2026-08-14 10:30", agent: "Legal Ingestion Pipeline" },
      ],
    },
    qualitySignals: [
      { name: "Legal Binding Authority", score: 99, rating: "HIGH", details: "Signed by Competent Authority / Land Acquisition Officer" },
    ],
    whyMatters: "Provides complete administrative foundation to verify and approve the reduced 1,480 m² parcel boundary.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-018"],
    status: "VALID_DEMO_EVIDENCE",
  },
  {
    id: "EVIDENCE-DEMO-018",
    conflictId: "CONFLICT-DEMO-012",
    entityId: "PARCEL-DEMO-064",
    sourceId: "survey",
    sourceName: "Drone Survey",
    evidenceType: "VERIFICATION_RECORD",
    title: "Final Boundary Demarcation Survey Sheet",
    description: "Field survey demarcation certificate confirming new boundary markers installed at 1,480 m² perimeter following road widening.",
    observationDate: "2026-07-18",
    ingestionDate: "2026-09-02",
    coordinates: [77.2014, 28.6016],
    confidence: 98,
    reliability: {
      sourceQuality: 97,
      observationConfidence: 98,
      temporalFreshness: 98,
      crossSourceAgreement: 97,
      overallStrength: 98,
    },
    provenance: {
      sourceName: "Drone Survey",
      sourceType: "Survey Demarcation Certificate",
      assetName: "demarcation_cert_64_demo.pdf",
      observationId: "OBS-DEMO-064-DEMARC",
      ingestionDate: "2026-09-02 11:20 IST",
      checksum: "sha256:e6c27631643f56157f000dfb1fbb899c45ce35c4993314bed476abb08b4115e9",
      processingStatus: "VALID_DEMO_EVIDENCE",
      custodyChain: [
        { stage: "Demarcation Certificate Verification", timestamp: "2026-09-02 11:20", agent: "Survey Head Office" },
      ],
    },
    qualitySignals: [
      { name: "Field Surveyor Seal", score: 99, rating: "HIGH", details: "Signed and sealed by Licensed Cadastral Surveyor" },
    ],
    whyMatters: "Final supporting evidence required for human reviewer to accept unified 1,480 m² boundary in Verification module.",
    relatedEvidenceIds: ["EVIDENCE-DEMO-017"],
    status: "VALID_DEMO_EVIDENCE",
  },
];

// ---------------------------------------------------------------------------
// Evidence Graph Structure & Types
// ---------------------------------------------------------------------------

export type GraphNodeType =
  | "CONFLICT"
  | "ENTITY"
  | "SOURCE"
  | "OBSERVATION"
  | "GEOMETRY"
  | "ATTRIBUTE"
  | "TIMESTAMP"
  | "EVIDENCE"
  | "VERIFICATION";

export interface GraphNode {
  id: string;
  label: string;
  sublabel?: string;
  type: GraphNodeType;
  dataRefId?: string; // Evidence ID, Conflict ID, Entity ID
  color: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  color?: string;
}

export interface EvidenceGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Builds the interactive evidence graph for a selected conflict (or full system).
 */
export function buildEvidenceGraph(targetConflictId?: string): EvidenceGraphData {
  const cId = targetConflictId || "CONFLICT-DEMO-001";
  const evidenceList = SYNTHETIC_EVIDENCE.filter((e) => e.conflictId === cId);

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Root Conflict Node
  nodes.push({
    id: cId,
    label: cId.replace("CONFLICT-DEMO-", "CONFLICT-"),
    sublabel: "Boundary Mismatch",
    type: "CONFLICT",
    dataRefId: cId,
    color: "#ef4444",
  });

  // Entity Node
  const entityId = evidenceList[0]?.entityId || "PARCEL-DEMO-014";
  nodes.push({
    id: entityId,
    label: entityId,
    sublabel: "Target Parcel",
    type: "ENTITY",
    dataRefId: entityId,
    color: "#06b6d4",
  });

  edges.push({
    id: `${cId}->${entityId}`,
    source: cId,
    target: entityId,
    label: "INVOLVES",
    color: "#ef4444",
  });

  // Sources Nodes
  const sources = [
    { id: "SRC-MUNI", label: "Municipal GIS", color: "#06b6d4", type: "SOURCE" as const },
    { id: "SRC-REG", label: "Property Registry", color: "#f59e0b", type: "SOURCE" as const },
    { id: "SRC-SURV", label: "Drone Survey", color: "#10b981", type: "SOURCE" as const },
  ];

  sources.forEach((s) => {
    nodes.push({
      id: s.id,
      label: s.label,
      sublabel: "Authoritative Layer",
      type: s.type,
      color: s.color,
    });

    edges.push({
      id: `${entityId}->${s.id}`,
      source: entityId,
      target: s.id,
      label: "OBSERVED BY",
      color: "#64748b",
    });
  });

  // Evidence and Observation Nodes
  evidenceList.forEach((ev) => {
    const srcNodeId =
      ev.sourceId === "municipal"
        ? "SRC-MUNI"
        : ev.sourceId === "registry"
        ? "SRC-REG"
        : "SRC-SURV";

    nodes.push({
      id: ev.id,
      label: ev.id.replace("EVIDENCE-DEMO-", "EVID-"),
      sublabel: ev.title.slice(0, 20) + "…",
      type: "EVIDENCE",
      dataRefId: ev.id,
      color: ev.sourceId === "municipal" ? "#06b6d4" : ev.sourceId === "registry" ? "#f59e0b" : "#10b981",
    });

    edges.push({
      id: `${srcNodeId}->${ev.id}`,
      source: srcNodeId,
      target: ev.id,
      label: "PROVIDES",
      color: "#94a3b8",
    });

    edges.push({
      id: `${ev.id}->${cId}`,
      source: ev.id,
      target: cId,
      label: "SUPPORTS",
      color: "#ef4444",
    });
  });

  // Verification Node
  nodes.push({
    id: "VERIFY-CANDIDATE",
    label: "Verification Dossier",
    sublabel: "Ready for Review",
    type: "VERIFICATION",
    color: "#10b981",
  });

  edges.push({
    id: `${cId}->VERIFY-CANDIDATE`,
    source: cId,
    target: "VERIFY-CANDIDATE",
    label: "PREPARES FOR",
    color: "#10b981",
  });

  return { nodes, edges };
}
