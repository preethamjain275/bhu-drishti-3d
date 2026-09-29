import satImg from "@/assets/satellite-view.jpg";

export default function TerrainScene() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      <img
        src={satImg}
        alt="Geospatial land view"
        className="h-full w-full object-cover opacity-40"
      />
      <div className="spatial-grid absolute inset-0 opacity-40" />
    </div>
  );
}
