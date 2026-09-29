import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useState } from "react";

interface IntelligenceWorkspaceProps {
  children: ReactNode; // Main GIS/3D View
  inspector?: ReactNode; // Optional right panel
  bottomPanel?: ReactNode; // Optional bottom panel
  className?: string;
  defaultInspectorOpen?: boolean;
}

export function IntelligenceWorkspace({
  children,
  inspector,
  bottomPanel,
  className,
  defaultInspectorOpen = true,
}: IntelligenceWorkspaceProps) {
  const [inspectorOpen, setInspectorOpen] = useState(defaultInspectorOpen);

  return (
    <div className={cn("flex h-full min-h-[480px] w-full overflow-hidden bg-background relative", className)}>
      
      {/* Main Workspace Area (GIS/3D) */}
      <div className="flex flex-1 flex-col min-w-0 relative">
        <main className="flex-1 relative spatial-grid-fine animate-in fade-in duration-300">
           {children}
           
           {/* Inspector Toggle Button (floats on the map if inspector exists and is closed) */}
           {inspector && !inspectorOpen && (
              <button 
                 onClick={() => setInspectorOpen(true)}
                 className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-md border border-border bg-background/80 backdrop-blur shadow-md text-muted-foreground hover:text-ivory transition-colors"
                 title="Open Inspector"
              >
                 <PanelRightOpen className="h-5 w-5" />
              </button>
           )}
        </main>
        
        {/* Bottom Information Panel */}
        {bottomPanel && (
          <div className="h-48 shrink-0 border-t border-border bg-surface/50 backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-300">
             {bottomPanel}
          </div>
        )}
      </div>

      {/* Right Inspector Panel */}
      {inspector && (
        <aside 
           className={cn(
             "border-l border-border bg-surface/50 backdrop-blur-xl transition-all duration-300 flex flex-col z-20 shrink-0",
             inspectorOpen ? "w-[320px] xl:w-[380px]" : "w-0 overflow-hidden border-l-0"
           )}
        >
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
             <span className="font-semibold text-sm text-ivory">Inspector</span>
             <button 
                onClick={() => setInspectorOpen(false)}
                className="text-muted-foreground hover:text-ivory transition-colors"
                title="Close Inspector"
             >
                <PanelRightClose className="h-4 w-4" />
             </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 scrollbar-slim">
             {inspector}
          </div>
        </aside>
      )}
    </div>
  );
}
