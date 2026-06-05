/**
 * FILE: src/app/auth/setup/page.tsx
 * ROUTE: /auth/setup
 * PURPOSE: One-time TOTP provisioning screen.
 *          - Calls GET /api/auth/setup to receive { qr_b64, secret }
 *          - Renders QR code as a base64 PNG for scanning with Google Authenticator / Aegis / Raivo
 *          - Also shows the raw base32 secret for manual entry if camera is unavailable
 *          - No authentication required (intentional — needed before first login)
 *          - After scanning, user clicks "Go to Login" → /auth/login
 */
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function SetupPage() {
  const [data, setData] = useState<{ qr_b64: string; secret: string } | null>(null);

  useEffect(() => { api.auth.setup().then(setData); }, []);

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh", background: "#0b0f14",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    backgroundImage: "linear-gradient(#1e2d3d 1px,transparent 1px),linear-gradient(90deg,#1e2d3d 1px,transparent 1px)",
    backgroundSize: "40px 40px",
  };
  const cardStyle: React.CSSProperties = {
    background: "#111720", border: "1px solid #1e2d3d", borderRadius: 4,
    padding: "2.5rem 3rem", width: "100%", maxWidth: 520,
    textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#00e5ff", fontFamily: "var(--font-mono)", marginBottom: 6 }}>[ TrainBoard Admin ]</p>
        <h1 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#fff", marginBottom: 4 }}>First-Time Setup</h1>
        <p style={{ fontSize: "0.85rem", color: "#4a5568", fontFamily: "var(--font-mono)", marginBottom: "1.5rem" }}>Configure your authenticator app</p>

        <ol style={{ listStyle: "none", textAlign: "left", margin: "1rem 0", counterReset: "step" }}>
          {[
            "Install Google Authenticator, Aegis (Android) or Raivo (iOS)",
            "Tap + → Scan a QR code",
            "Point your camera at the QR code below",
            "Hit Go to Login and enter the 6-digit code",
          ].map((step, i) => (
            <li key={i} style={{ padding: "0.5rem 0 0.5rem 2.2rem", position: "relative", borderBottom: "1px solid #1e2d3d", fontSize: "0.85rem", color: "#cdd9e5" }}>
              <span style={{ position: "absolute", left: 0, top: "0.5rem", width: "1.4rem", height: "1.4rem", background: "#00e5ff", color: "#000", borderRadius: "50%", fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        {data ? (
          <>
            <div style={{ display: "flex", justifyContent: "center", margin: "1.5rem 0 0.5rem" }}>
              <div style={{ background: "#fff", borderRadius: 4, padding: 12, display: "inline-block" }}>
                <img src={`data:image/png;base64,${data.qr_b64}`} alt="TOTP QR Code" style={{ display: "block", width: 180, height: 180 }} />
              </div>
            </div>
            <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a5568", fontFamily: "var(--font-mono)", marginBottom: 6 }}>
              Manual entry secret
            </p>
            <div style={{ background: "#0b0f14", border: "1px solid #1e2d3d", borderRadius: 3, padding: "0.75rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "#00e5ff", wordBreak: "break-all", letterSpacing: "0.05em" }}>
              {data.secret}
            </div>
          </>
        ) : (
          <p style={{ color: "#4a5568", fontFamily: "var(--font-mono)", marginTop: "2rem" }}>Loading QR code…</p>
        )}

        <a
          href="/auth/login"
          style={{ display: "block", marginTop: "2rem", padding: "0.9rem", background: "#00e5ff", color: "#000", borderRadius: 3, fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}
        >
          Go to Login →
        </a>
      </div>
    </div>
  );
}
