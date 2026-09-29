import {
  LayoutDashboard,
  Database,
  GitMerge,
  Map,
  TriangleAlert,
  FileStack,
  ShieldCheck,
  Layers,
  History,
  FileText,
  Settings,
  Home,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  hint: string;
  badge?: number;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    title: "INTELLIGENCE",
    items: [
      { label: "Overview", to: "/overview", icon: LayoutDashboard, hint: "Platform status and activity" },
      { label: "Data Sources", to: "/data-sources", icon: Database, hint: "Registered record and imagery sources" },
      { label: "Harmonization", to: "/harmonization", icon: GitMerge, hint: "Alignment and reconciliation pipelines" },
      { label: "Entity Matching", to: "/entity-matching", icon: Layers, hint: "Identify, link and disambiguate parcels" },
      { label: "Geospatial Map", to: "/map", icon: Map, hint: "2D/3D spatial workspace" },
    ],
  },
  {
    title: "INVESTIGATION",
    items: [
      { label: "Conflict Explorer", to: "/conflicts", icon: TriangleAlert, hint: "Detected spatial and attribute conflicts", badge: 7 },
      { label: "Evidence Graph", to: "/evidence", icon: FileStack, hint: "Supporting documents and survey records" },
      { label: "3D Intelligence", to: "/intelligence-3d", icon: Map, hint: "3D visualization and analysis" },
    ],
  },
  {
    title: "GOVERNANCE",
    items: [
      { label: "Verification Queue", to: "/verification", icon: ShieldCheck, hint: "Human review queue", badge: 3 },
      { label: "Audit Trail", to: "/audit", icon: History, hint: "Immutable change history" },
    ],
  },
  {
    title: "INSIGHTS",
    items: [
      { label: "Reports & Export", to: "/reports", icon: FileText, hint: "Generate and export reports" },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Settings", to: "/settings", icon: Settings, hint: "Workspace configuration" },
    ],
  },
];

export const flatNavItems: NavItem[] = navGroups.flatMap((g) => g.items);

/** Mobile bottom navigation — 4 primary destinations + menu. */
export const mobileNavItems: NavItem[] = [
  { label: "Home", to: "/overview", icon: Home, hint: "Overview" },
  { label: "Data", to: "/data-sources", icon: Database, hint: "Data sources" },
  { label: "Map", to: "/map", icon: Map, hint: "Geospatial map" },
  {
    label: "Conflicts",
    to: "/conflicts",
    icon: TriangleAlert,
    hint: "Conflicts",
    badge: 7,
  },
];
