"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { api } from "@/services/api";
import { AxiosError } from "axios";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // ✅ Initialize from cookies during state creation — no useEffect needed for this
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const storedUser = Cookies.get("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return Cookies.get("token") || null;
  });

  const [loading, setLoading] = useState(true);

  // ✅ Only use useEffect to sync with external system (Axios headers)
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }

    // Mark loading as done after hydration setup
    setTimeout(() => {
      setLoading(false);
    }, 0);
  }, [token]); // Re-run if token changes (e.g., login/logout)

  async function login(email: string, password: string) {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { user, token } = res.data;

      Cookies.set("token", token);
      Cookies.set("user", JSON.stringify(user));

      setUser(user);
      setToken(token);
      // Effect will auto-sync the header
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.log("Response data:", err.response?.data);
        throw err;
      }
      throw new Error("An unknown error occurred during login");
    }
  }

  function logout() {
    Cookies.remove("token");
    Cookies.remove("user");

    setUser(null);
    setToken(null);
    // Effect will remove header
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        register: async () => {}, // implement later
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
