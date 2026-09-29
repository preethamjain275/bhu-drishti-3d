import React, { useState } from "react";
import { GitCommit, ZoomIn, ZoomOut, RotateCcw, Info, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NodeItem {
  id: string;
  label: string;
  type: "source" | "observation" | "candidate" | "conflict" | "evidence";
  detail: string;
  x: number;
  y: number;
}

interface EdgeItem {
  from: string;
  to: string;
}

export const EntityRelationshipGraph: React.FC<{
  observationId: string;
  candidateId: string;
  onSelectNode?: (nodeId: string) => void;
}> = ({ observationId, candidateId, onSelectNode }) => {
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string>(candidateId);

  const nodes: NodeItem[] = [
    { id: "SRC-MUNI", label: "Municipal GIS", type: "source", detail: "Delhi Municipal Ward 18", x: 60, y: 80 },
    { id: observationId, label: observationId, type: "observation", detail: "2,430 m² Spatial Vector", x: 220, y: 80 },
    { id: candidateId, label: candidateId, type: "candidate", detail: "Parcel PARCEL-DEMO-014", x: 420, y: 150 },
    { id: "CF-1042", label: "CF-1042 (Conflict)", type: "conflict", detail: "Boundary Offset 80 m²", x: 220, y: 220 },
    { id: "EVID-DEED-98102", label: "EVID-DEED (Evidence)", type: "evidence", detail: "Title Deed Index #98102", x: 600, y: 150 },
  ];

  const edges: EdgeItem[] = [
    { from: "SRC-MUNI", to: observationId },
    { from: observationId, to: candidateId },
    { from: observationId, to: "CF-1042" },
    { from: candidateId, to: "EVID-DEED-98102" },
  ];

  const getNodeColor = (type: NodeItem["type"]) => {
    switch (type) {
      case "source":
        return { fill: "#0f172a", stroke: "#38bdf8", text: "#38bdf8" };
      case "observation":
        return { fill: "#082f49", stroke: "#06b6d4", text: "#22d3ee" };
      case "candidate":
        return { fill: "#3b0764", stroke: "#c084fc", text: "#e9d5ff" };
      case "conflict":
        return { fill: "#450a0a", stroke: "#f87171", text: "#fca5a5" };
      case "evidence":
        return { fill: "#064e3b", stroke: "#34d399", text: "#6ee7b7" };
    }
  };

  const handleNodeClick = (node: NodeItem) => {
    setSelectedNode(node.id);
    if (onSelectNode) onSelectNode(node.id);
  };

  return (
    <div className="panel-surface rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-200 font-semibold">
          <GitCommit className="h-4 w-4 text-purple-400" />
          <span>ENTITY PROVENANCE & RELATIONSHIP GRAPH</span>
        </div>

        <div className="flex items-center gap-1 font-mono text-xs">
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400" onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}>
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400" onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}>
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400" onClick={() => setZoom(1)}>
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-900/60 h-64 flex items-center justify-center">
        <svg
          className="w-full h-full"
          viewBox="0 0 720 300"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
        >
          {/* Edges */}
          {edges.map((edge, i) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;
            return (
              <line
                key={i}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="#475569"
                strokeWidth={1.5}
                strokeDasharray="4 2"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const colors = getNodeColor(node.type);
            const isSelected = selectedNode === node.id;
            return (
              <g
                key={node.id}
                onClick={() => handleNodeClick(node)}
                className="cursor-pointer transition-transform hover:scale-105"
                transform={`translate(${node.x}, ${node.y})`}
              >
                <rect
                  x="-65"
                  y="-22"
                  width="130"
                  height="44"
                  rx="8"
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="shadow-md"
                />
                <text
                  textAnchor="middle"
                  y="-4"
                  fill={colors.text}
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.label}
                </text>
                <text
                  textAnchor="middle"
                  y="12"
                  fill="#94a3b8"
                  fontSize="8"
                  fontFamily="sans-serif"
                >
                  {node.type.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded bg-slate-950/80 px-2.5 py-1 text-[10px] font-mono text-slate-400 border border-slate-800">
          <span className="flex items-center gap-1 text-cyan-300"><span className="h-2 w-2 rounded-full bg-cyan-400" /> Source/Obs</span>
          <span className="flex items-center gap-1 text-purple-300"><span className="h-2 w-2 rounded-full bg-purple-400" /> Candidate</span>
          <span className="flex items-center gap-1 text-rose-300"><span className="h-2 w-2 rounded-full bg-rose-400" /> Conflict</span>
          <span className="flex items-center gap-1 text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Evidence</span>
        </div>
      </div>
    </div>
  );
};
