"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { AuthStatus } from "@/types/departure";

export function useAuth(requireAuth = false) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.auth.me()
      .then(setStatus)
      .catch(() => setStatus({ authenticated: false, user: null }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && requireAuth && !status?.authenticated) {
      router.replace("/auth/login");
    }
  }, [loading, requireAuth, status, router]);

  const logout = async () => {
    await api.auth.logout();
    router.replace("/auth/login");
  };

  return { status, loading, logout };
}
