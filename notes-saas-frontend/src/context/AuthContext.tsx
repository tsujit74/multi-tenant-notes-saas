"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  login as loginFn,
  logout as logoutFn,
  getUserFromToken,
  isTokenExpired,
} from "@/lib/auth";

interface User {
  id: number;
  email: string;
  role: "admin" | "member";
  tenantId: number;
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

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isTokenExpired(token)) {
      const storedUser = getUserFromToken(token);
      if (storedUser) setUser(storedUser);
    } else {
      localStorage.removeItem("token"); // cleanup if expired/invalid
    }
    setLoading(false);
  }, []);

  // Login
  async function login(email: string, password: string) {
  try {
    const { token, user } = await loginFn(email, password);
    if (!token) throw new Error("Login failed, no token received");
    localStorage.setItem("token", token);
    setUser(user);
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}


  // Logout
  function logout() {
    logoutFn();
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
