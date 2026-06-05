"use client";
import { useEffect, useState } from "react";

interface ToastProps { message: string; type: "ok" | "err"; onDone: () => void; }

export function Toast({ message, type, onDone }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className={`toast ${type}`}>
      {type === "ok" ? "✓" : "✗"} {message}
    </div>
  );
}

interface ToastState { id: number; message: string; type: "ok" | "err"; }
let _push: ((msg: string, type: "ok" | "err") => void) | null = null;
export const showToast = (msg: string, type: "ok" | "err" = "ok") => _push?.(msg, type);

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  _push = (message, type) =>
    setToasts(p => [...p, { id: Date.now(), message, type }]);
  const remove = (id: number) => setToasts(p => p.filter(t => t.id !== id));
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onDone={() => remove(t.id)} />
      ))}
    </div>
  );
}
