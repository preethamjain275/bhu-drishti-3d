/**
 * BHOO-MITRA AI — Auth Types & RBAC Definitions
 */

export type UserRole =
  | "ADMIN"
  | "DATA_OFFICER"
  | "GIS_ANALYST"
  | "REVIEWER"
  | "AUDITOR"
  | "VIEWER";

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  roles: UserRole[];
  permissions: string[];
  created_at?: string;
  last_login_at?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authMode: "database" | "demo";
}

export interface DemoAccount {
  label: string;
  email: string;
  role: UserRole;
  description: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: "Administrator",
    email: "admin@bhoomitra.demo",
    role: "ADMIN",
    description: "Full system administration, user management, and configuration access.",
  },
  {
    label: "Data Officer",
    email: "data.officer@bhoomitra.demo",
    role: "DATA_OFFICER",
    description: "Data ingestion, format inspection, CRS harmonization, and source control.",
  },
  {
    label: "GIS Analyst",
    email: "analyst@bhoomitra.demo",
    role: "GIS_ANALYST",
    description: "Spatial entity matching, conflict investigation, IoU metrics, evidence graphing.",
  },
  {
    label: "Senior Reviewer",
    email: "reviewer@bhoomitra.demo",
    role: "REVIEWER",
    description: "Human verification workspace, recommendation decisions (Approve/Reject/Modify).",
  },
  {
    label: "Chief Auditor",
    email: "auditor@bhoomitra.demo",
    role: "AUDITOR",
    description: "Read-only access to audit trail, provenance timeline, and governance reports.",
  },
  {
    label: "Public Viewer",
    email: "viewer@bhoomitra.demo",
    role: "VIEWER",
    description: "Read-only dashboard analytical view with restricted editing controls.",
  },
];
