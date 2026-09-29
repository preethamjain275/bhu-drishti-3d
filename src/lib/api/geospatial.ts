/**
 * BHOO-MITRA AI — Geospatial Processing API Client
 *
 * Interacts with FastAPI backend geospatial processing layer endpoints:
 * - /api/geospatial/inspect
 * - /api/geospatial/validate
 * - /api/geospatial/transform
 * - /api/geospatial/process
 * - /api/geospatial/jobs/{job_id}
 *
 * Provides automatic fallback to synthetic demo calculations when backend is offline.
 */

import { API_BASE_URL } from "@/lib/api/client";

export interface InspectionMetadata {
  file_name: string;
  format: string;
  geometry_type: string;
  feature_count: number;
  crs: string;
  bbox: number[];
  attribute_fields: string[];
  is_raster: boolean;
}

export interface GeometryValidationResult {
  valid: boolean;
  geometry_type: string;
  is_empty: boolean;
  is_null: boolean;
  issues: string[];
  validity_reason: string;
}

export interface CRSTransformationResult {
  original_crs: string;
  target_crs: string;
  status: string;
  timestamp: string;
  original_geometry: any;
  transformed_geometry: any;
}

export interface PipelineJobResult {
  job_id: string;
  status: string;
  progress_percent: number;
  current_stage: string;
  created_at: string;
  completed_at?: string;
  metadata?: InspectionMetadata;
  crs_info?: any;
  quality?: {
    overall_quality_score: number;
    quality_grade: string;
    sub_scores: Record<string, number>;
    signals: Array<{ signal_type: string; score: number; status: string; details: string }>;
  };
  features_summary?: {
    total: number;
    valid: number;
    repaired: number;
  };
}

export async function inspectDataset(filePath?: string, rawDatasetName?: string): Promise<InspectionMetadata> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/geospatial/inspect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_path: filePath, raw_dataset_name: rawDatasetName }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend geospatial inspect unavailable. Using demo fallback.", err);
  }

  // Demo Fallback
  return {
    file_name: rawDatasetName || "Municipal_Cadastral_2024.geojson",
    format: "GeoJSON",
    geometry_type: "Polygon",
    feature_count: 128,
    crs: "EPSG:32643",
    bbox: [77.58, 12.96, 77.62, 13.01],
    attribute_fields: ["survey_parcel_id", "landuse", "prop_status", "survey_area", "owner"],
    is_raster: false,
  };
}

export async function validateGeometry(geometry: any): Promise<GeometryValidationResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/geospatial/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ geometry }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend geospatial validate unavailable. Using demo fallback.", err);
  }

  return {
    valid: true,
    geometry_type: geometry?.type || "Polygon",
    is_empty: false,
    is_null: !geometry,
    issues: [],
    validity_reason: "Valid topology (Demo Fallback)",
  };
}

export async function transformCRS(geometry: any, sourceCrs: string, targetCrs: string = "EPSG:4326"): Promise<CRSTransformationResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/geospatial/transform`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ geometry, source_crs: sourceCrs, target_crs: targetCrs }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend geospatial transform unavailable. Using demo fallback.", err);
  }

  return {
    original_crs: sourceCrs,
    target_crs: targetCrs,
    status: "Successfully transformed (Demo Engine)",
    timestamp: new Date().toISOString(),
    original_geometry: geometry,
    transformed_geometry: geometry,
  };
}

export async function startPipelineJob(sourceId: string, targetCrs: string = "EPSG:4326"): Promise<PipelineJobResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/geospatial/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_id: sourceId, target_crs: targetCrs }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend geospatial pipeline unavailable. Using demo fallback.", err);
  }

  return {
    job_id: `JOB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    status: "Completed",
    progress_percent: 100,
    current_stage: "PostGIS Ready (Demo)",
    created_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    quality: {
      overall_quality_score: 0.94,
      quality_grade: "A",
      sub_scores: { crs_validity: 1.0, geometry_validity: 0.98, attribute_completeness: 0.92, schema_compatibility: 0.90 },
      signals: [
        { signal_type: "CRS_VALIDITY", score: 1.0, status: "PASS", details: "CRS is EPSG:4326" },
        { signal_type: "GEOMETRY_VALIDITY", score: 0.98, status: "PASS", details: "Topologically valid polygons" }
      ]
    },
    features_summary: { total: 128, valid: 125, repaired: 3 }
  };
}
