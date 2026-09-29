import { createFileRoute } from "@tanstack/react-router";
import GeoWorkspace from "@/components/map/GeoWorkspace";

export const Route = createFileRoute("/_app/map")({
  validateSearch: (search: Record<string, unknown>) => search,
  head: () => ({
    meta: [
      { title: "Geospatial Workspace — Bhu Drishti 3D" },
      { name: "description", content: "Explore parcels, buildings, survey points and terrain across sources in 2D and 3D." },
      { property: "og:title", content: "Geospatial Workspace — Bhu Drishti 3D" },
      { property: "og:description", content: "Compare how different sources represent the same land." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  return <GeoWorkspace />;
}
