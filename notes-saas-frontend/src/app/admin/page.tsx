"use client";

import { useEffect, useState } from "react";
import RoleGuard from "@/components/RoleGaurd";
import api from "@/lib/api";

// Types for tenant and users
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

// Axios response type
interface TenantResponse {
  tenant: Tenant;
  users: User[];
}

export default function AdminDashboard() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tenant data
  async function fetchTenantData() {
    try {
      const res = await api.get<TenantResponse>("/tenants/me");
      setTenant(res.data.tenant);
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to load tenant data", err);
    } finally {
      setLoading(false);
    }
  }

  // Toggle plan
  async function togglePlan() {
    if (!tenant) return;
    try {
      if (tenant.plan === "free") {
        await api.post(`/tenants/${tenant.slug}/upgrade`);
        alert("Plan upgraded to Pro!");
      } else {
        await api.post(`/tenants/${tenant.slug}/downgrade`);
        alert("Plan downgraded to Free!");
      }
      fetchTenantData(); // Refresh tenant info
    } catch (err) {
      console.error("Plan change failed", err);
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
            <button
              onClick={togglePlan}
              className={`mt-3 px-4 py-2 rounded text-white ${
                tenant.plan === "free"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {tenant.plan === "free" ? "Upgrade to Pro" : "Downgrade to Free"}
            </button>
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
