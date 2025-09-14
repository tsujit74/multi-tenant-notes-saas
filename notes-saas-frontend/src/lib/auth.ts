import api from "./api";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number;
  email: string;
  role: "admin" | "member";
  plan: "free" | "pro";
  tenantId: number;
  exp: number;
}

interface LoginResponse {
  token: string;
}


export async function login(email: string, password: string) {
  try {
    const res = await api.post<LoginResponse>("/auth/login", { email, password });

    const { token } = res.data || {};
    if (!token) {
      throw new Error("Login failed: No token returned from server");
    }

  
    const user = getUserFromToken(token);
    if (!user) {
      throw new Error("Login failed: Invalid token");
    }

    localStorage.setItem("token", token);
    return { token, user };
  } catch (err: any) {
   
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }

  
    if (err.message === "Network Error") {
      throw new Error("Unable to connect to server. Please check your internet.");
    }

    
    throw new Error("Login failed. Please try again.");
  }
}

export function logout() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  } catch (err) {
    console.error("Error during logout:", err);
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
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}
