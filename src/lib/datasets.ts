/**
 * Dataset domain model + mock repository.
 * All values are DEMO / ILLUSTRATIVE. Replace `datasetRepository` with real API calls later.
 */
export type SourceType =
  | "revenue" | "municipal" | "imagery" | "drone" | "gnss" | "building" | "utility" | "other";
export type DatasetStatus = "ready" | "processing" | "needs-alignment" | "crs-review" | "queued" | "error";
export type HealthState = "healthy" | "warning" | "review" | "unknown";
export type Authority = "High" | "Medium" | "Low";

export type Dataset = {
  id: string;
  name: string;
  source: string;
  sourceType: SourceType;
  kind: "Vector" | "Raster" | "Tabular";
  format: string;
  crs: string | null;
  geometryType: string;
  recordCount: number | null;
  captureDate: string;
  uploadedAt: string;
  updatedAt: string;
  status: DatasetStatus;
  processingStage: string;
  progress: number;
  authorityLevel: Authority;
  surveyMethod: "GNSS" | "Digitized" | "Remote sensing" | "Administrative";
  spatialAccuracy: string;
  metadataCompleteness: number;
  geometryValidity: number;
  attributeCompleteness: number;
  boundingBox: [number, number, number, number];
  units: string;
  createdBy: string;
  seed: number;
};

export const sourceTypeLabel: Record<SourceType, string> = {
  revenue: "Revenue / Cadastral",
  municipal: "Municipal GIS",
  imagery: "Satellite / Imagery",
  drone: "Drone Survey",
  gnss: "GNSS / Survey",
  building: "Building Data",
  utility: "Utility Data",
  other: "Other",
};

export const statusMeta: Record<DatasetStatus, { label: string; tone: string }> = {
  ready: { label: "Ready", tone: "text-verified" },
  processing: { label: "Processing", tone: "text-primary" },
  "needs-alignment": { label: "Needs alignment", tone: "text-saffron" },
  "crs-review": { label: "CRS review", tone: "text-saffron" },
  queued: { label: "Queued", tone: "text-muted-foreground" },
  error: { label: "Error", tone: "text-conflict" },
};

const h = (hrs: number) => new Date(Date.now() - hrs * 3_600_000).toISOString();

const base = (d: Partial<Dataset> & Pick<Dataset, "id" | "name" | "source" | "sourceType">): Dataset => ({
  kind: "Vector", format: "GeoJSON", crs: "EPSG:4326", geometryType: "Polygon", recordCount: 1000,
  captureDate: "2025-11-02", uploadedAt: h(30), updatedAt: h(2), status: "ready",
  processingStage: "Complete", progress: 100, authorityLevel: "Medium", surveyMethod: "Digitized",
  spatialAccuracy: "±2.5 m", metadataCompleteness: 80, geometryValidity: 97, attributeCompleteness: 90,
  boundingBox: [77.52, 12.9, 77.66, 13.02], units: "degrees", createdBy: "A. Raghavan (demo)", seed: 1,
  ...d,
});

let store: Dataset[] = [
  base({ id: "ds-01", name: "Parcel Records", source: "Revenue Department (sample)", sourceType: "revenue", recordCount: 12480, authorityLevel: "High", surveyMethod: "Administrative", geometryValidity: 98.7, attributeCompleteness: 94.2, metadataCompleteness: 62, seed: 3 }),
  base({ id: "ds-02", name: "Property Boundaries — Ward 18", source: "Municipal GIS (sample)", sourceType: "municipal", format: "Shapefile", crs: "EPSG:32643", units: "metres", updatedAt: h(26), recordCount: 8920, status: "needs-alignment", processingStage: "Spatial alignment", progress: 72, geometryValidity: 93.1, attributeCompleteness: 88, seed: 7 }),
  base({ id: "ds-03", name: "Orthomosaic — Zone 4", source: "Drone Survey (sample)", sourceType: "drone", kind: "Raster", format: "GeoTIFF", crs: "EPSG:32643", units: "metres", geometryType: "Raster grid", recordCount: null, updatedAt: h(3), status: "processing", processingStage: "Geometry extraction", progress: 38, surveyMethod: "Remote sensing", spatialAccuracy: "±0.1 m", authorityLevel: "Medium", seed: 11 }),
  base({ id: "ds-04", name: "Control Points 2025", source: "GNSS Survey Unit (sample)", sourceType: "gnss", format: "CSV", geometryType: "Point", recordCount: 642, surveyMethod: "GNSS", spatialAccuracy: "±0.02 m", authorityLevel: "High", seed: 5 }),
  base({ id: "ds-05", name: "Building Footprints", source: "Building Data (sample)", sourceType: "building", format: "GeoPackage", recordCount: 21304, surveyMethod: "Remote sensing", authorityLevel: "Low", geometryValidity: 89.4, seed: 9 }),
  base({ id: "ds-06", name: "Legacy Village Map", source: "Cadastral Archive (sample)", sourceType: "revenue", format: "DXF (CAD)", crs: null, units: "unknown", recordCount: 1180, status: "crs-review", processingStage: "Spatial reference", progress: 20, metadataCompleteness: 31, seed: 13 }),
  base({ id: "ds-07", name: "Water Mains", source: "Utility Networks (sample)", sourceType: "utility", geometryType: "LineString", recordCount: 3310, status: "queued", processingStage: "Queued", progress: 0, seed: 17 }),
];

export const datasetRepository = {
  async list(): Promise<Dataset[]> { return store; },
  async get(id: string) { return store.find((d) => d.id === id) ?? null; },
  async add(d: Dataset) { store = [d, ...store]; return d; },
};

export function health(d: Dataset): { key: string; label: string; state: HealthState; value: string }[] {
  const pct = (v: number): HealthState => (v >= 95 ? "healthy" : v >= 85 ? "warning" : "review");
  const ageDays = (Date.now() - new Date(d.captureDate).getTime()) / 86_400_000;
  return [
    { key: "geo", label: "Geometry", state: pct(d.geometryValidity), value: `${d.geometryValidity}%` },
    { key: "attr", label: "Attributes", state: pct(d.attributeCompleteness), value: `${d.attributeCompleteness}%` },
    { key: "crs", label: "CRS", state: d.crs ? "healthy" : "review", value: d.crs ? "Declared" : "Needs confirmation" },
    { key: "meta", label: "Metadata", state: d.metadataCompleteness >= 80 ? "healthy" : d.metadataCompleteness >= 50 ? "warning" : "review", value: d.metadataCompleteness >= 80 ? "Complete" : "Partial" },
    { key: "time", label: "Temporal freshness", state: isNaN(ageDays) ? "unknown" : ageDays < 365 ? "healthy" : "warning", value: isNaN(ageDays) ? "Unknown" : `${Math.round(ageDays)} days` },
  ];
}

export const healthTone: Record<HealthState, string> = {
  healthy: "bg-verified", warning: "bg-saffron", review: "bg-conflict", unknown: "bg-muted-foreground",
};
export const healthLabel: Record<HealthState, string> = {
  healthy: "Healthy", warning: "Warning", review: "Needs review", unknown: "Unknown",
};

export function relTime(iso: string) {
  const hrs = (Date.now() - new Date(iso).getTime()) / 3_600_000;
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${Math.round(hrs)}h ago`;
  if (hrs < 48) return "Yesterday";
  return `${Math.round(hrs / 24)}d ago`;
}
