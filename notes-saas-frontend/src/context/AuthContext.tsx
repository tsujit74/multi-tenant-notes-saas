"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  login as loginFn,
  logout as logoutFn,
  getUserFromToken,
  isTokenExpired,
} from "@/lib/auth";

export interface User {
  id: number;
  email: string;
  role: "admin" | "member";
  tenantId: number;
  plan: "free" | "pro";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !isTokenExpired(token)) {
      const storedUser = getUserFromToken(token);
      if (storedUser) {
        setUser({
          id: storedUser.id,
          email: storedUser.email,
          role: storedUser.role.toLowerCase() as User["role"],
          tenantId: storedUser.tenantId,
          plan: storedUser.plan,
        });
      }
    } else {
      localStorage.removeItem("token");
      setUser(null);
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  async function login(email: string, password: string) {
    const { token, user } = await loginFn(email, password);
    if (!token || !user) throw new Error("Login failed");

    localStorage.setItem("token", token);
    setUser({
      id: user.id,
      email: user.email,
      role: user.role.toLowerCase() as User["role"],
      tenantId: user.tenantId,
      plan: user.plan,
    });
  }

  function logout() {
    logoutFn();
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
