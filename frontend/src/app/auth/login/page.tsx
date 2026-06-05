/**
 * FILE: src/app/auth/login/page.tsx
 * ROUTE: /auth/login
 * PURPOSE: TOTP login gate for the admin panel.
 *          - 6-digit numeric input, auto-submits when complete (no button press needed)
 *          - POSTs code to POST /api/auth/login; on success backend sets httpOnly session cookie
 *          - On success: redirects to /admin/board
 *          - On failure: clears input, shows inline error, re-focuses
 *          - Countdown timer shows remaining seconds in the current 30s TOTP window
 *          - Link to /auth/setup for first-time users
 */
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

function Timer() {
  const [sec, setSec] = useState(30);
  useEffect(() => {
    const tick = () => setSec(30 - (Math.floor(Date.now() / 1000) % 30));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const pct = (sec / 30) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, fontSize: "0.75rem", color: "#4a5568", fontFamily: "var(--font-mono)" }}>
      <span>Code valid for</span>
      <div style={{ flex: 1, height: 3, background: "#1e2d3d", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: sec <= 5 ? "#ff4d6d" : "#00e5ff", borderRadius: 2, transition: "width 1s linear, background 0.3s" }} />
      </div>
      <span>{sec}s</span>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleChange = async (val: string) => {
    setCode(val);
    if (val.length === 6) {
      setLoading(true);
      setError(null);
      try {
        await api.auth.login(val);
        router.replace("/admin/board");
      } catch {
        setError("Invalid code — try again.");
        setCode("");
        setLoading(false);
        inputRef.current?.focus();
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f14", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backgroundImage: "linear-gradient(#1e2d3d 1px,transparent 1px),linear-gradient(90deg,#1e2d3d 1px,transparent 1px)", backgroundSize: "40px 40px" }}>
      <div style={{ background: "#111720", border: "1px solid #1e2d3d", borderRadius: 4, padding: "2.5rem 3rem", width: "100%", maxWidth: 440, boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#00e5ff", fontFamily: "var(--font-mono)", marginBottom: 6 }}>[ TrainBoard Admin ]</p>
        <h1 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#fff", marginBottom: 4 }}>Authenticate</h1>
        <p style={{ fontSize: "0.85rem", color: "#4a5568", fontFamily: "var(--font-mono)", marginBottom: "1.5rem" }}>Enter the 6-digit code from your app</p>

        {error && (
          <div style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.35)", color: "#ff4d6d", borderRadius: 3, padding: "0.75rem 1rem", fontSize: "0.82rem", fontFamily: "var(--font-mono)", marginBottom: "1.25rem" }}>
            ✗ {error}
          </div>
        )}

        <Timer />

        <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#4a5568", marginBottom: 8, fontFamily: "var(--font-mono)" }}>
          One-Time Password
        </label>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          value={code}
          onChange={e => handleChange(e.target.value.replace(/\D/g, ""))}
          disabled={loading}
          placeholder="000000"
          style={{ width: "100%", background: "#0b0f14", border: "1px solid #1e2d3d", borderRadius: 3, padding: "0.85rem 1rem", fontSize: "1.8rem", fontFamily: "var(--font-mono)", color: "#00e5ff", letterSpacing: "0.4em", textAlign: "center", outline: "none" }}
        />

        <a href="/auth/setup" style={{ display: "inline-block", marginTop: "1.5rem", fontSize: "0.8rem", color: "#4a5568", fontFamily: "var(--font-mono)", textDecoration: "none" }}>
          ↗ First time? Scan QR setup
        </a>
      </div>
    </div>
  );
}
