"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { api } from "@/lib/api";
import type { UserResponse } from "@/lib/types";

interface AuthContextValue {
  user: UserResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, display_name: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (api.isAuthenticated) {
      api.me().then(setUser).catch(() => api.clearToken()).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password);
    setUser(res.user);
  }, []);

  const register = useCallback(async (email: string, display_name: string, password: string) => {
    await api.register({ email, display_name, password });
  }, []);

  const logout = useCallback(() => {
    api.clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}