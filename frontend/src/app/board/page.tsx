/**
 * FILE: src/app/board/page.tsx
 * ROUTE: /board
 * PURPOSE: Public customer-facing departure board.
 *          - Green-framed full-screen layout
 *          - Live clock (updates every second)
 *          - Departure table: thumbnail · description · platform · time (AM/PM)
 *          - First upcoming departure highlighted in blue; past ones struck through
 *          - Auto-refreshes data every 30s via useDepartures(autoRefresh=true)
 *          - No authentication required
 */
"use client";
import { useEffect, useState } from "react";
import { useDepartures } from "@/hooks/useDepartures";
import { toAMPM, toMins, nowMins } from "@/lib/utils";

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="mono accent" style={{ fontSize: "1.35rem", letterSpacing: "0.04em" }}>{time}</span>;
}

export default function BoardPage() {
  const { departures, loading } = useDepartures(true);
  const [now, setNow] = useState(nowMins());

  useEffect(() => {
    const id = setInterval(() => setNow(nowMins()), 60_000);
    return () => clearInterval(id);
  }, []);

  let nextFound = false;

  return (
    <div className="board-frame">
      <header style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "2rem" }}>🚉</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Gare Centrale</div>
            <div className="muted mono" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>Live Departures</div>
          </div>
        </div>
        <Clock />
      </header>

      <div style={{ flex: 1, overflowX: "auto", padding: "24px 28px" }}>
        <table className="data-table" style={{ minWidth: 480 }}>
          <thead>
            <tr>
              <th>Train</th>
              <th>Description</th>
              <th>Platform</th>
              <th>Departure</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "48px", color: "var(--muted)" }}>Loading…</td></tr>
            )}
            {!loading && departures.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "48px", color: "var(--muted)" }}>No departures scheduled.</td></tr>
            )}
            {departures.map(dep => {
              const past = toMins(dep.departure) < now;
              const isNext = !past && !nextFound;
              if (isNext) nextFound = true;
              return (
                <tr key={dep.id}>
                  <td style={{ fontSize: "1.8rem", textAlign: "center", width: 60 }}>{dep.thumbnail}</td>
                  <td>{dep.description}</td>
                  <td className="mono" style={{ fontSize: "0.82rem" }}>{dep.platform || "—"}</td>
                  <td>
                    <span className="mono" style={{
                      display: "inline-block", padding: "5px 12px", borderRadius: 7,
                      fontSize: "0.9rem", fontWeight: 500,
                      background: isNext ? "var(--accent)" : "transparent",
                      color: isNext ? "#fff" : past ? "var(--border)" : "var(--accent)",
                      textDecoration: past ? "line-through" : "none",
                    }}>
                      {toAMPM(dep.departure)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
