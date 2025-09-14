"use client";

import { useEffect, useState } from "react";
import RoleGuard from "@/components/RoleGaurd";
import api from "@/lib/api";

interface Tenant {
  id: number;
  slug: string;
  plan: "free" | "pro";
}

interface User {
  id: number;
  email: string;
  role: "admin" | "member";
}

export default function AdminDashboard() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTenantData() {
    try {
      const res = await api.get("/tenants/me");
      setTenant(res.data.tenant);
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to load tenant data", err);
    } finally {
      setLoading(false);
    }
  }

  async function upgradePlan() {
    if (!tenant) return;
    try {
      await api.post(`/tenants/${tenant.slug}/upgrade`);
      alert("Plan upgraded to Pro!");
      fetchTenantData();
    } catch (err) {
      console.error("Upgrade failed", err);
    }
  }

  useEffect(() => {
    fetchTenantData();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {tenant && (
          <div className="mb-6 border p-4 rounded bg-gray-50">
            <h2 className="font-semibold">Tenant Info</h2>
            <p>Slug: {tenant.slug}</p>
            <p>Plan: {tenant.plan}</p>
            {tenant.plan === "free" && (
              <button
                onClick={upgradePlan}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        )}

        <div>
          <h2 className="font-semibold mb-2">Users</h2>
          <ul className="space-y-2">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex justify-between border p-2 rounded bg-white"
              >
                <span>{u.email}</span>
                <span className="text-gray-600">{u.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </RoleGuard>
  );
}
