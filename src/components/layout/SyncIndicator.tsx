"use client";

import { useEffect, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

type Status = "connecting" | "live" | "reconnecting" | "offline";

/** Realtime connection indicator.
 *
 *  Opens a Supabase Realtime channel on mount and tracks its state. Every
 *  postgres_changes broadcast (on any tracked table) bumps "lastSyncAt", so
 *  the "Ns ago" label reflects the real time since the last server-pushed
 *  event — not just page load. */
export function SyncIndicator() {
  const [status, setStatus] = useState<Status>("connecting");
  const [lastSyncAt, setLastSyncAt] = useState(Date.now());
  const [, force] = useState(0);
  const channelRef = useRef<ReturnType<ReturnType<typeof supabaseBrowser>["channel"]> | null>(null);

  // Re-render every second so "Ns ago" stays current
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const sb = supabaseBrowser();
    const channel = sb
      .channel("sync-indicator")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => setLastSyncAt(Date.now()))
      .on("postgres_changes", { event: "*", schema: "public", table: "tickets" }, () => setLastSyncAt(Date.now()))
      .on("postgres_changes", { event: "*", schema: "public", table: "feedback_items" }, () => setLastSyncAt(Date.now()))
      .on("postgres_changes", { event: "*", schema: "public", table: "test_cases" }, () => setLastSyncAt(Date.now()))
      .on("postgres_changes", { event: "*", schema: "public", table: "activity_events" }, () => setLastSyncAt(Date.now()))
      .subscribe((s) => {
        if (s === "SUBSCRIBED") setStatus("live");
        else if (s === "CHANNEL_ERROR" || s === "TIMED_OUT") setStatus("reconnecting");
        else if (s === "CLOSED") setStatus("offline");
      });
    channelRef.current = channel;
    return () => {
      sb.removeChannel(channel);
    };
  }, []);

  const secondsAgo = Math.max(0, Math.floor((Date.now() - lastSyncAt) / 1000));
  const label =
    secondsAgo < 5
      ? "just now"
      : secondsAgo < 60
        ? `${secondsAgo}s ago`
        : `${Math.floor(secondsAgo / 60)}m ago`;

  const palette = (() => {
    if (status === "live") return { bg: "var(--bc-success-50)", border: "var(--bc-success-100)", text: "var(--bc-success-700)", dot: "var(--bc-success-600)" };
    if (status === "reconnecting") return { bg: "var(--bc-warning-50)", border: "var(--bc-warning-100)", text: "var(--bc-warning-700)", dot: "var(--bc-warning-600)" };
    if (status === "offline") return { bg: "var(--bc-danger-50)", border: "var(--bc-danger-100)", text: "var(--bc-danger-700)", dot: "var(--bc-danger-600)" };
    return { bg: "var(--bc-slate-100)", border: "var(--bc-border)", text: "var(--bc-slate-600)", dot: "var(--bc-slate-500)" };
  })();

  const statusLabel = status === "live" ? "Live" : status === "reconnecting" ? "Reconnecting" : status === "offline" ? "Offline" : "Connecting";

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
      style={{ background: palette.bg, borderColor: palette.border, color: palette.text }}
      title={`Supabase Realtime · ${statusLabel} · last event ${label}`}
    >
      <span className="relative inline-block h-2 w-2 rounded-full" style={{ background: palette.dot }}>
        <span
          className="absolute inset-[-2px] animate-[syncPulse_2.4s_ease-out_infinite] rounded-full opacity-0"
          style={{ background: palette.dot }}
        />
      </span>
      <span>{statusLabel}</span>
      <span className="font-medium opacity-75">· {label}</span>
    </div>
  );
}
