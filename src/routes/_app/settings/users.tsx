import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Shield, UserPlus, CheckCircle, XCircle, Key, Lock, Users as UsersIcon } from "lucide-react";
import { API_BASE_URL } from "@/lib/api/client";

export const Route = createFileRoute("/_app/settings/users")({
  head: () => ({
    meta: [
      { title: "User & Role Access Management — Bhu Drishti 3D" },
      { name: "description", content: "RBAC User & Role Management Center" },
    ],
  }),
  component: UserManagementPage,
});

interface UserRecord {
  id: string;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  roles: string[];
  permissions: string[];
  created_at?: string;
  last_login_at?: string;
}

function UserManagementPage() {
  const { user: currentUser, can } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("GIS_ANALYST");
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("bhoomitra_access_token");
      const res = await fetch(`${API_BASE_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch users:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    try {
      const token = localStorage.getItem("bhoomitra_access_token");
      const res = await fetch(`${API_BASE_URL}/api/auth/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          email,
          full_name: fullName,
          password,
          roles: [selectedRole],
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.detail || "Failed to create user");
      }

      setShowCreateModal(false);
      setUsername("");
      setEmail("");
      setFullName("");
      setPassword("");
      fetchUsers();
    } catch (err: any) {
      setCreateError(err.message);
    }
  };

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      const token = localStorage.getItem("bhoomitra_access_token");
      await fetch(`${API_BASE_URL}/api/auth/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !currentActive }),
      });
      fetchUsers();
    } catch (e) {
      console.error("Failed to update user active status", e);
    }
  };

  if (!can("users.read")) {
    return (
      <div className="p-8 text-center text-slate-400">
        <Lock className="mx-auto h-12 w-12 text-amber-500 mb-3" />
        <h2 className="text-lg font-bold text-slate-200">Access Restricted</h2>
        <p className="text-xs mt-1">You require Administrator privileges to view user & role management.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-3">
            <UsersIcon className="h-6 w-6 text-teal-400" />
            User & Role Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Government Decision Support Environment — Role-Based Access Control (RBAC) Governance
          </p>
        </div>

        {can("users.create") && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition"
          >
            <UserPlus className="h-4 w-4" />
            Create User Account
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-mono uppercase text-slate-400">
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Assigned Roles</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last Login</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs text-slate-200 font-mono">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Loading user records...
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <div className="font-semibold text-slate-100">{u.full_name}</div>
                    <div className="text-[11px] text-slate-500">@{u.username} • {u.id}</div>
                  </td>
                  <td className="p-4 text-slate-300">{u.email}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <span key={r} className="px-2 py-0.5 text-[10px] rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    {u.is_active ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                        <CheckCircle className="h-3 w-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-red-500/10 border border-red-500/30 text-red-400 font-bold">
                        <XCircle className="h-3 w-3" /> Disabled
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-400 text-[11px]">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "Never"}
                  </td>
                  <td className="p-4 text-right">
                    {can("users.update") && (
                      <button
                        onClick={() => handleToggleActive(u.id, u.is_active)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                      >
                        {u.is_active ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-teal-400" />
              Create New System User
            </h3>

            {createError && (
              <div className="p-3 rounded bg-red-950/40 border border-red-500/30 text-xs text-red-300">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Assigned Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-slate-100"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="DATA_OFFICER">DATA_OFFICER</option>
                  <option value="GIS_ANALYST">GIS_ANALYST</option>
                  <option value="REVIEWER">REVIEWER</option>
                  <option value="AUDITOR">AUDITOR</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-teal-500 text-slate-950 font-bold hover:bg-teal-400"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
