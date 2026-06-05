/**
 * FILE: src/app/admin/board/page.tsx
 * ROUTE: /admin/board
 * PURPOSE: Protected departure management UI (requires valid session cookie).
 *          - AdminLayout wraps this page; it calls useAuth(true) which redirects
 *            unauthenticated users to /auth/login before anything renders
 *          - Desktop: data-table with edit/delete per row
 *          - Mobile: card list (table hidden via CSS at <640px)
 *          - "Add Departure" and row ✏️ both open DepartureModal
 *          - Save calls POST /api/departures (add) or PUT /api/departures/:id (edit)
 *          - Delete calls DELETE /api/departures/:id with a confirm() guard
 *          - All outcomes surface via showToast() from Toast.tsx
 */
"use client";
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { DepartureModal } from "@/components/DepartureModal";
import { ToastContainer, showToast } from "@/components/Toast";
import { useDepartures } from "@/hooks/useDepartures";
import { api } from "@/lib/api";
import { toAMPM } from "@/lib/utils";
import type { Departure, DepartureCreate } from "@/types/departure";

export default function AdminBoardPage() {
  const { departures, loading, reload } = useDepartures();
  const [editing, setEditing] = useState<Departure | null | undefined>(undefined); // undefined = modal closed

  const openAdd  = () => setEditing(null);
  const openEdit = (d: Departure) => setEditing(d);
  const close    = () => setEditing(undefined);

  const save = async (data: DepartureCreate) => {
    try {
      if (editing) {
        await api.departures.update(editing.id, data);
        showToast("Departure updated.", "ok");
      } else {
        await api.departures.create(data);
        showToast("Departure added.", "ok");
      }
      await reload();
      close();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Error", "err");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this departure?")) return;
    try {
      await api.departures.remove(id);
      showToast("Departure deleted.", "ok");
      await reload();
    } catch {
      showToast("Delete failed.", "err");
    }
  };

  return (
    <AdminLayout>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Departures</h1>
          <p className="muted" style={{ fontSize: "0.78rem", marginTop: 3 }}>Manage all scheduled departures</p>
        </div>
        <button className="btn" onClick={openAdd}>+ Add Departure</button>
      </div>

      {/* Desktop: table */}
      <div className="table-card" style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Train</th>
              <th>Description</th>
              <th>Platform</th>
              <th>Departure</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>Loading…</td></tr>}
            {!loading && departures.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>No departures yet.</td></tr>}
            {departures.map(d => (
              <tr key={d.id}>
                <td style={{ fontSize: "1.6rem", textAlign: "center", width: 52 }}>{d.thumbnail}</td>
                <td>{d.description}</td>
                <td className="mono" style={{ fontSize: "0.82rem" }}>{d.platform || "—"}</td>
                <td className="mono" style={{ fontWeight: 600, color: "var(--accent)" }}>{toAMPM(d.departure)}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn-icon" onClick={() => openEdit(d)}>✏️</button>
                    <button className="btn-icon del" onClick={() => remove(d.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: card list (shown via CSS at <640px) */}
      <div className="card-list">
        {departures.map(d => (
          <div className="dep-card" key={d.id}>
            <div className="dep-card-emoji">{d.thumbnail}</div>
            <div className="dep-card-body">
              <div className="dep-card-desc">{d.description}</div>
              <div className="dep-card-meta">
                <span className="badge">Plt {d.platform || "—"}</span>
                <span className="dep-card-time">{toAMPM(d.departure)}</span>
              </div>
            </div>
            <div className="dep-card-btns">
              <button className="btn-icon" onClick={() => openEdit(d)}>✏️</button>
              <button className="btn-icon del" onClick={() => remove(d.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {editing !== undefined && (
        <DepartureModal initial={editing} onSave={save} onClose={close} />
      )}

      <ToastContainer />
    </AdminLayout>
  );
}
