"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth(true);

  return (
    <div className="admin-layout">
      {/* Desktop sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">🚆 TrainBoard</div>
        <nav className="sidebar-nav">
          <Link href="/admin/board" className="sidebar-link active">Departures</Link>
          <Link href="/" className="sidebar-link" target="_blank">Live Board</Link>
        </nav>
        <form onSubmit={e => { e.preventDefault(); logout(); }} style={{ padding: "12px 10px" }}>
          <button className="btn btn-danger" type="submit" style={{ width: "100%", justifyContent: "center" }}>
            Sign Out
          </button>
        </form>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        <Link href="/admin/board" className="active">Departures</Link>
        <Link href="/" target="_blank">Live Board</Link>
        <a href="#" onClick={e => { e.preventDefault(); logout(); }}>Sign Out</a>
      </nav>

      <main className="admin-main">{children}</main>
    </div>
  );
}
