"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface RoleGuardProps {
  allowedRoles: ("admin" | "member")[];
  children: ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login"); // not logged in
      } else if (!allowedRoles.includes(user.role)) {
        router.replace("/notes"); // logged in but role not allowed
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) return <p>Loading...</p>;
  if (!user || !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
