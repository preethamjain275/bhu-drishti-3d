import React from "react";
import { ExecutiveKPIs } from "@/lib/api/analytics";
import { Database, Layers, ShieldAlert, FileCheck, CheckCircle2, TrendingUp, Sparkles, Building2, MapPin } from "lucide-react";

interface ExecutiveKPIStripProps {
  kpis: ExecutiveKPIs;
  onDrillDown: (target: string) => void;
}

export function ExecutiveKPIStrip({ kpis, onDrillDown }: ExecutiveKPIStripProps) {
  const cards = [
    {
      title: "TOTAL SOURCES",
      value: kpis.totalSources,
      subtext: "4 Active Registry Feeds",
      icon: Database,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/30",
      route: "/sources",
    },
    {
      title: "SOURCE ASSETS",
      value: kpis.sourceAssets,
      subtext: "Vector, DTM & Cadastral",
      icon: Layers,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/30",
      route: "/sources",
    },
    {
      title: "CANONICAL ENTITIES",
      value: kpis.canonicalEntities,
      subtext: "Harmonized Land Parcels",
      icon: MapPin,
      color: "text-teal-400",
      bg: "bg-teal-500/10 border-teal-500/30",
      route: "/entity-matching",
    },
    {
      title: "CONFLICT CASES",
      value: kpis.conflictsCount,
      subtext: "↑ 8.4% vs prev period",
      trend: true,
      icon: ShieldAlert,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/30",
      route: "/conflicts",
    },
    {
      title: "EVIDENCE RECORDS",
      value: kpis.evidenceRecords,
      subtext: "Provable Chain Signals",
      icon: FileCheck,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/30",
      route: "/evidence",
    },
    {
      title: "PENDING REVIEW",
      value: kpis.pendingVerifications,
      subtext: "Human Queue Awaiting",
      icon: Building2,
      color: "text-pink-400",
      bg: "bg-pink-500/10 border-pink-500/30",
      route: "/verification",
    },
    {
      title: "HARMONIZED RECORDS",
      value: kpis.harmonizedRecords,
      subtext: "51% Pipeline Complete",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
      route: "/harmonization",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            onClick={() => onDrillDown(card.route)}
            className={`p-3.5 rounded-2xl border ${card.bg} backdrop-blur-md cursor-pointer hover:scale-102 transition-all shadow-lg font-sans flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 font-bold">
              <span>{card.title}</span>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </div>

            <div className="mt-2 mb-1">
              <div className={`text-2xl font-black font-mono ${card.color}`}>{card.value}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                {card.trend && <TrendingUp className="h-3 w-3 text-amber-400" />}
                {card.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
