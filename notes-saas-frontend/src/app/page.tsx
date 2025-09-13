"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-lg text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome, {user.email}</h1>
          <p className="text-gray-600 mb-4">
            Tenant: <span className="font-medium">{user.tenantId}</span> | Role:{" "}
            <span className="font-medium">{user.role}</span>
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/notes"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Manage Notes
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
