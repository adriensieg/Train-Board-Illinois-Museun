"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { Departure } from "@/types/departure";

export function useDepartures(autoRefresh = false) {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api.departures.list();
      setDepartures(data);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    if (autoRefresh) {
      const id = setInterval(load, 30_000);
      return () => clearInterval(id);
    }
  }, [load, autoRefresh]);

  return { departures, loading, error, reload: load };
}
