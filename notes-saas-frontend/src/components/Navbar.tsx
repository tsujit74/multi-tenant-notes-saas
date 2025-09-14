"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <Link href="/notes" className="font-bold hover:text-gray-300">
          Notes SaaS
        </Link>

        {user && (
          <>
            <Link href="/notes" className="hover:text-gray-300">
              Notes
            </Link>

            {user.role === "admin" && (
              <Link href="/admin" className="hover:text-gray-300">
                Admin
              </Link>
            )}
          </>
        )}
      </div>

      <div>
        {user ? (
          <button
            onClick={logout}
            className="bg-red-600 px-4 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        ) : (
          <Link href="/login" className="hover:text-gray-300">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
