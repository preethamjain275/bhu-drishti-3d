import React from "react";
import { allParcels } from "@/lib/mock/geo-data";
import { StatusBadge, ConfidenceIndicator } from "@/components/ui/bhumitra";
import { Button } from "@/components/ui/button";
import { GitCompare, FileText, AlertTriangle } from "lucide-react";

interface MapInspectorProps {
  parcelId: string | null;
}

export function MapInspector({ parcelId }: MapInspectorProps) {
  if (!parcelId) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center p-6 text-muted-foreground">
         <p className="text-sm">Select a parcel on the map to view its details.</p>
      </div>
    );
  }

  // Find all representations of this parcel
  const features = allParcels.filter(f => f.properties.id === parcelId);
  const primaryFeature = features[0]; // Usually the first one found

  if (!primaryFeature) {
    return <div className="p-4 text-sm text-conflict">Parcel not found.</div>;
  }

  const props = primaryFeature.properties;

  return (
    <div className="space-y-6">
       <div>
          <p className="label-technical text-muted-foreground">PARCEL ID</p>
          <div className="flex items-center gap-2 mt-1">
             <h3 className="text-lg font-mono font-bold text-ivory">{props.id}</h3>
             <StatusBadge label={props.status} variant={props.status === "MATCHED" ? "verified" : props.status === "CONFLICT" ? "conflict" : "warning"} />
          </div>
       </div>

       <div className="space-y-3">
          <h4 className="label-technical text-ivory border-b border-border pb-1">Overview</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
             <div>
                <span className="text-xs text-muted-foreground block">Source</span>
                <span className="font-semibold">{props.source}</span>
             </div>
             <div>
                <span className="text-xs text-muted-foreground block">Survey Reference</span>
                <span className="font-mono text-xs">{props.surveyNumber || "N/A"}</span>
             </div>
             <div>
                <span className="text-xs text-muted-foreground block">Area</span>
                <span>{props.area} m²</span>
             </div>
             <div>
                <span className="text-xs text-muted-foreground block">Land Use</span>
                <span>{props.landUse}</span>
             </div>
             <div>
                <span className="text-xs text-muted-foreground block">Last Updated</span>
                <span className="text-xs">{new Date(props.updatedAt).toLocaleDateString()}</span>
             </div>
          </div>
       </div>

       <div className="space-y-3">
          <h4 className="label-technical text-ivory border-b border-border pb-1">Quality</h4>
          <ConfidenceIndicator score={props.confidence} />
       </div>

       <div className="space-y-3">
          <h4 className="label-technical text-ivory border-b border-border pb-1">Actions</h4>
          <div className="flex flex-col gap-2">
             <Button variant="outline" className="w-full justify-start text-xs"><GitCompare className="mr-2 h-4 w-4" /> Compare Sources</Button>
             <Button variant="outline" className="w-full justify-start text-xs"><FileText className="mr-2 h-4 w-4" /> View Evidence</Button>
             <Button variant="outline" className="w-full justify-start text-xs text-conflict hover:text-conflict hover:bg-conflict/10"><AlertTriangle className="mr-2 h-4 w-4" /> Open Conflict</Button>
          </div>
       </div>
    </div>
  );
}
