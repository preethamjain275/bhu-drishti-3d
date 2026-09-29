import React from "react";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActiveLayers {
  municipal: boolean;
  registry: boolean;
  survey: boolean;
  buildings?: boolean;
  conflicts?: boolean;
}

interface LayerControlProps {
  activeLayers: ActiveLayers;
  onChange: (layers: ActiveLayers) => void;
  className?: string;
}

export function LayerControl({ activeLayers, onChange, className }: LayerControlProps) {
  const toggleLayer = (key: keyof ActiveLayers) => {
     onChange({ ...activeLayers, [key]: !activeLayers[key] });
  };

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-md border border-border bg-background/80 backdrop-blur-md shadow-md", className)}>
       <div className="bg-surface/50 px-3 py-2 border-b border-border flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-ivory">MAP LAYERS</span>
       </div>
       <div className="p-2 flex flex-col gap-1">
          <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded cursor-pointer transition-colors">
             <input 
                type="checkbox" 
                checked={activeLayers.municipal} 
                onChange={() => toggleLayer("municipal")}
                className="accent-[var(--cyan)]"
             />
             <span className="text-xs text-muted-foreground flex-1">Municipal GIS</span>
             <div className="w-3 h-3 rounded-sm bg-[#00ffff]/20 border border-[#00ffff]" />
          </label>
          <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded cursor-pointer transition-colors">
             <input 
                type="checkbox" 
                checked={activeLayers.registry} 
                onChange={() => toggleLayer("registry")}
                className="accent-[var(--cyan)]"
             />
             <span className="text-xs text-muted-foreground flex-1">Property Registry</span>
             <div className="w-3 h-3 rounded-sm bg-[#a78bfa]/20 border border-[#a78bfa] border-dashed" />
          </label>
          <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded cursor-pointer transition-colors">
             <input 
                type="checkbox" 
                checked={activeLayers.survey} 
                onChange={() => toggleLayer("survey")}
                className="accent-[var(--cyan)]"
             />
             <span className="text-xs text-muted-foreground flex-1">Survey</span>
             <div className="w-3 h-3 rounded-sm bg-[#fbbf24]/20 border border-[#fbbf24] border-dotted" />
          </label>
          
          <div className="h-px bg-border my-1" />
          
          <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded cursor-pointer transition-colors opacity-50">
             <input 
                type="checkbox" 
                checked={false} 
                disabled
                className="accent-[var(--cyan)]"
             />
             <span className="text-xs text-muted-foreground flex-1">Buildings</span>
          </label>
          <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded cursor-pointer transition-colors opacity-50">
             <input 
                type="checkbox" 
                checked={false} 
                disabled
                className="accent-[var(--cyan)]"
             />
             <span className="text-xs text-muted-foreground flex-1">Conflict Areas</span>
          </label>
       </div>
    </div>
  );
}
