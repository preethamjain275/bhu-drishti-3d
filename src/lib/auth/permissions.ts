/**
 * BHOO-MITRA AI — Permission Helpers & RBAC Rule Evaluators
 */

import { User, UserRole } from "@/lib/auth/types";

export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  if (user.roles?.includes("ADMIN")) return true;
  return user.permissions?.includes(permission) || false;
}

export function hasRole(user: User | null, role: UserRole): boolean {
  if (!user) return false;
  return user.roles?.includes(role) || false;
}

export function can(user: User | null, permission: string): boolean {
  return hasPermission(user, permission);
}
