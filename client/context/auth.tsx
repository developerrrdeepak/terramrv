import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, saveToken, clearToken } from "@/lib/auth";
import type { AuthUser, AuthResponse } from "@shared/api";

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => void;
  setToken: (t: string) => void;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await api<{ user: AuthUser }>("/api/auth/me");
      setUser(data.user);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const setToken = (t: string) => {
    saveToken(t);
    refresh();
  };

  const signOut = () => {
    clearToken();
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, signOut, setToken, refresh }), [user, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used in AuthProvider");
  return v;
}
