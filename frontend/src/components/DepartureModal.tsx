"use client";
import { useState, useEffect } from "react";
import type { Departure, DepartureCreate } from "@/types/departure";

interface Props {
  initial?: Departure | null;
  onSave: (data: DepartureCreate) => Promise<void>;
  onClose: () => void;
}

const empty: DepartureCreate = { thumbnail: "", description: "", platform: "", departure: "" };

export function DepartureModal({ initial, onSave, onClose }: Props) {
  const [form, setForm] = useState<DepartureCreate>(initial ? { ...initial } : empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(initial ? { ...initial } : empty); }, [initial]);

  const set = (k: keyof DepartureCreate, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel">
        <div className="modal-head">
          <h2>{initial ? "Edit Departure" : "Add Departure"}</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="field">
              <label>Emoji / Thumbnail</label>
              <input value={form.thumbnail} onChange={e => set("thumbnail", e.target.value)} placeholder="🚄" maxLength={4} required />
            </div>
            <div className="field">
              <label>Description</label>
              <input value={form.description} onChange={e => set("description", e.target.value)} placeholder="e.g. TGV Duplex – Paris Gare de Lyon" required />
            </div>
            <div className="field">
              <label>Platform</label>
              <input value={form.platform} onChange={e => set("platform", e.target.value)} placeholder="e.g. 4A or Depot Street" />
            </div>
            <div className="field">
              <label>Departure time</label>
              <input type="time" value={form.departure} onChange={e => set("departure", e.target.value)} required />
            </div>
          </div>
          <div className="modal-foot">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn" disabled={saving}>{saving ? "Saving…" : initial ? "Save Changes" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
