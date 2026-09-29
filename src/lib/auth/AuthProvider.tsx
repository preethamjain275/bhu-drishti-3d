"use client";

/**
 * BHOO-MITRA AI — React Authentication Context Provider
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole, DEMO_ACCOUNTS } from "@/lib/auth/types";
import { fetchCurrentUser, loginUser, logoutUser, getStoredToken } from "@/lib/auth/auth-client";
import { can, hasPermission, hasRole } from "@/lib/auth/permissions";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  selectDemoAccount: (email: string) => Promise<void>;
  can: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initAuth() {
      const stored = getStoredToken();
      if (stored) {
        setToken(stored);
        const currentUser = await fetchCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await loginUser(email, password);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await logoutUser();
    setUser(null);
    setToken(null);
    setIsLoading(false);
  };

  const selectDemoAccount = async (email: string) => {
    await handleLogin(email, "demo123");
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    selectDemoAccount,
    can: (perm: string) => can(user, perm),
    hasRole: (role: UserRole) => hasRole(user, role),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
