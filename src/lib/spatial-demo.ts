/**
 * Illustrative spatial dataset (demo). Replace with a spatial API later —
 * every consumer only uses `spatialRepository`.
 */
import type { FeatureCollection, Polygon, Point, LineString } from "geojson";

export const CENTER: [number, number] = [77.5946, 12.9716];

export type LayerId =
  | "ward" | "revenue" | "municipal" | "buildings" | "roads" | "survey" | "diff";

export type LayerDef = {
  id: LayerId; group: string; name: string; source: string; kind: string;
  confidence: "High" | "Medium" | "Low"; updated: string; color: string;
};

export const layerDefs: LayerDef[] = [
  { id: "ward", group: "Administrative", name: "Ward boundary", source: "Municipal GIS (sample)", kind: "Polygon", confidence: "Medium", updated: "2025-10-12", color: "--ivory" },
  { id: "revenue", group: "Land", name: "Revenue parcels", source: "Revenue Department (sample)", kind: "Polygon", confidence: "High", updated: "2025-11-02", color: "--teal" },
  { id: "municipal", group: "Land", name: "Municipal parcels", source: "Municipal GIS (sample)", kind: "Polygon", confidence: "Medium", updated: "2025-09-20", color: "--saffron" },
  { id: "diff", group: "Land", name: "Spatial differences", source: "Derived by BhuSetu", kind: "Polygon", confidence: "Medium", updated: "Today", color: "--conflict" },
  { id: "buildings", group: "Built Environment", name: "Building footprints", source: "Building Data (sample)", kind: "Polygon", confidence: "Low", updated: "2025-06-01", color: "--cyan" },
  { id: "roads", group: "Built Environment", name: "Road network", source: "Municipal GIS (sample)", kind: "LineString", confidence: "Medium", updated: "2025-08-14", color: "--ivory" },
  { id: "survey", group: "Survey", name: "GNSS control points", source: "GNSS Survey Unit (sample)", kind: "Point", confidence: "High", updated: "2025-11-18", color: "--verified" },
];

const D = 0.0016; // parcel size in degrees (~175 m)
const COLS = 6, ROWS = 5;
const ox = CENTER[0] - (COLS * D) / 2, oy = CENTER[1] - (ROWS * D) / 2;

function rect(x: number, y: number, w: number, h: number, dx = 0, dy = 0): Polygon {
  return { type: "Polygon", coordinates: [[[x + dx, y + dy], [x + w + dx, y + dy], [x + w + dx, y + h + dy], [x + dx, y + h + dy], [x + dx, y + dy]]] };
}
const rnd = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;

export type ParcelProps = {
  id: string; area: number; landUse: string; owner: string; survey: string; conf: number;
};

function build() {
  const revenue: FeatureCollection<Polygon, ParcelProps> = { type: "FeatureCollection", features: [] };
  const municipal: FeatureCollection<Polygon, ParcelProps & { shift: number }> = { type: "FeatureCollection", features: [] };
  const diff: FeatureCollection<Polygon, { id: string; shift: number }> = { type: "FeatureCollection", features: [] };
  const buildings: FeatureCollection<Polygon, { id: string; height: number }> = { type: "FeatureCollection", features: [] };
  const uses = ["Residential", "Commercial", "Mixed use", "Institutional"];
  let n = 0;
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r < ROWS; r++) {
      n++;
      const id = `P-${10470 + n}`;
      const x = ox + c * D, y = oy + r * D, w = D * 0.96;
      const props: ParcelProps = { id, area: Math.round(2800 + rnd(n) * 1600), landUse: uses[n % 4]!, owner: "Redacted (demo)", survey: n % 3 ? "Administrative" : "GNSS", conf: Math.round(70 + rnd(n + 3) * 28) };
      revenue.features.push({ type: "Feature", id: n, properties: props, geometry: rect(x, y, w, w) });
      const shifted = n % 4 === 0;
      const s = shifted ? D * 0.12 : D * 0.01;
      municipal.features.push({ type: "Feature", id: n, properties: { ...props, area: Math.round(props.area * (shifted ? 1.08 : 1)), shift: Math.round((s / D) * 175 * 10) / 10 }, geometry: rect(x, y, w, w, s, s * 0.5) });
      if (shifted) diff.features.push({ type: "Feature", properties: { id, shift: Math.round(D * 0.12 / D * 175) }, geometry: rect(x + w, y, s, w + s * 0.5) });
      for (let b = 0; b < 2; b++)
        buildings.features.push({ type: "Feature", properties: { id: `B-${n}-${b}`, height: Math.round(8 + rnd(n * 7 + b) * 40) }, geometry: rect(x + D * (0.12 + b * 0.42), y + D * 0.2, D * 0.3, D * 0.45) });
    }
  const roads: FeatureCollection<LineString> = { type: "FeatureCollection", features: [] };
  for (let c = 0; c <= COLS; c++) roads.features.push({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [[ox + c * D - D * 0.02, oy - D * 0.5], [ox + c * D - D * 0.02, oy + ROWS * D + D * 0.5]] } });
  for (let r = 0; r <= ROWS; r++) roads.features.push({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [[ox - D * 0.5, oy + r * D - D * 0.02], [ox + COLS * D + D * 0.5, oy + r * D - D * 0.02]] } });
  const survey: FeatureCollection<Point, { id: string; accuracy: string }> = { type: "FeatureCollection", features: Array.from({ length: 14 }, (_, i) => ({ type: "Feature", properties: { id: `GCP-${200 + i}`, accuracy: "±0.02 m" }, geometry: { type: "Point", coordinates: [ox + rnd(i + 40) * COLS * D, oy + rnd(i + 90) * ROWS * D] } })) };
  const ward: FeatureCollection<Polygon> = { type: "FeatureCollection", features: [{ type: "Feature", properties: { name: "Ward 18 (demo)" }, geometry: rect(ox - D * 0.6, oy - D * 0.6, COLS * D + D * 1.2, ROWS * D + D * 1.2) }] };
  return { revenue, municipal, diff, buildings, roads, survey, ward };
}

const data = build();
export const spatialRepository = {
  async layers() { return data; },
  findParcel(id: string) { return data.revenue.features.find((f) => f.properties.id.toLowerCase() === id.toLowerCase().trim()) ?? null; },
  municipalFor(id: string) { return data.municipal.features.find((f) => f.properties.id === id) ?? null; },
};
