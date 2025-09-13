import api from "./api";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  id: number;
  email: string;
  role: "admin" | "member";
  tenantId: number;
  exp: number;
}

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });

  const { token } = res.data;
  if (!token) throw new Error("No token in login response");

  localStorage.setItem("token", token);
  return { token, user: getUserFromToken(token) };
}


export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

export function getUserFromToken(token: string) {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}


export function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<DecodedToken>(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}
