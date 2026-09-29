import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  ThreeDEntity,
  ThreeDParcel,
  ThreeDBuilding,
  LayerVisibilityState,
  VisualMode,
  FloorInfo,
  RoomInfo,
} from "@/lib/maps/cesium/types";
import { CesiumUrbanDigitalTwin } from "@/components/maps/CesiumUrbanDigitalTwin";
import { CesiumLayersPanel } from "@/components/maps/CesiumLayersPanel";
import { CesiumHarmonizationDossier } from "@/components/maps/CesiumHarmonizationDossier";
import { CesiumWorkflowStepper, WorkflowStage } from "@/components/maps/CesiumWorkflowStepper";
import { useMapSync } from "@/lib/map/mapSelectionStore";
import { SelectionSource } from "@/lib/map/mapTypes";
import { MOCK_3D_PARCELS, MOCK_3D_BUILDINGS } from "@/lib/mock/threeD";

export const Route = createFileRoute("/_app/intelligence-3d")({
  validateSearch: (search: Record<string, unknown>) => search,
  head: () => ({
    meta: [
      { title: "3D Urban GIS & Digital Twin — Bhu Drishti 3D" },
      {
        name: "description",
        content:
          "Interactive 3D Urban GIS & Digital Twin — Cutaway Building, Floor & Room Explorer with Bhu Drishti 3D Multi-Source Geospatial Harmonization.",
      },
      { property: "og:title", content: "3D Urban GIS & Digital Twin — Bhu Drishti 3D" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Intelligence3DPage,
});

function Intelligence3DPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  // Workflow Stage State
  const [currentStage, setCurrentStage] = useState<WorkflowStage>("CONFLICT");

  // Selected Building, Parcel, Floor & Room States
  const [selectedBuilding, setSelectedBuilding] = useState<ThreeDBuilding>(MOCK_3D_BUILDINGS[0]!);
  const [selectedParcel, setSelectedParcel] = useState<ThreeDParcel>(MOCK_3D_PARCELS[0]!);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(4);
  const [selectedRoom, setSelectedRoom] = useState<string | null>("4B");
  const [isCutaway, setIsCutaway] = useState<boolean>(true);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);

  // Layer Visibility State matching the exact 8 layers in reference design
  const [layers, setLayers] = useState<LayerVisibilityState>({
    wardBoundary: true,
    revenueParcels: true,
    municipalParcels: true,
    surveyImagery: true,
    spatialDifferences: true,
    buildings3d: true,
    buildingInteriors: true,
    roadNetwork: true,
    terrain: true,
    satelliteImagery: true,
  });

  const handleToggleLayer = (key: keyof LayerVisibilityState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectBuilding = (building: ThreeDBuilding) => {
    setSelectedBuilding(building);
    const matchedParcel = MOCK_3D_PARCELS.find((p) => p.id === building.parcelId) || MOCK_3D_PARCELS[0]!;
    setSelectedParcel(matchedParcel);
    setCurrentStage("BUILDING");
  };

  const handleSelectFloor = (floorNumber: number | null) => {
    setSelectedFloor(floorNumber);
    if (floorNumber !== null) {
      setIsCutaway(true);
    }
  };

  const handleSelectRoom = (roomId: string | null) => {
    setSelectedRoom(roomId);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full bg-slate-950 text-slate-100 overflow-hidden relative font-sans">
      
      {/* Central 3D Scene + Left & Right Floating HUD Panels */}
      <div className="relative flex-1 w-full overflow-hidden flex">
        
        {/* Left Side: Layers Panel */}
        <div className="absolute top-4 left-4 z-20 pointer-events-auto">
          <CesiumLayersPanel
            layers={layers}
            onToggleLayer={handleToggleLayer}
            onZoomIn={() => {}}
            onZoomOut={() => {}}
            onResetNorth={() => {}}
            is3D={is3DMode}
            onToggle3D={() => setIs3DMode(!is3DMode)}
          />
        </div>

        {/* Central 3D Urban GIS & Cutaway Building Digital Twin */}
        <div className="h-full w-full relative z-0">
          <CesiumUrbanDigitalTwin
            selectedBuilding={selectedBuilding}
            selectedParcel={selectedParcel}
            selectedFloor={selectedFloor}
            selectedRoom={selectedRoom}
            onSelectBuilding={handleSelectBuilding}
            onSelectFloor={handleSelectFloor}
            onSelectRoom={handleSelectRoom}
            layers={layers}
            isCutaway={isCutaway}
          />
        </div>

        {/* Right Side: Building Details & Multi-Source Harmonization Dossier */}
        <div className="absolute top-4 right-4 z-20 pointer-events-auto">
          <CesiumHarmonizationDossier
            building={selectedBuilding}
            parcel={selectedParcel}
            selectedFloor={selectedFloor}
            onSelectFloor={handleSelectFloor}
            selectedRoom={selectedRoom}
            onSelectRoom={handleSelectRoom}
            onToggleCutaway={() => setIsCutaway(!isCutaway)}
            isCutaway={isCutaway}
          />
        </div>
      </div>

      {/* Bottom 10-Stage Interactive Workflow Stepper */}
      <div className="shrink-0 z-20">
        <CesiumWorkflowStepper
          currentStage={currentStage}
          onSelectStage={setCurrentStage}
        />
      </div>

    </div>
  );
}
