"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  X,
  GitBranch,
  Link as LinkIcon,
  Check,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PRIORITY_KIND, TICKET_STAGES } from "@/lib/mock";
import type { TicketDetail } from "@/lib/types";

type Props = {
  ticket: TicketDetail;
  projectId: string;
};

/** Slide-in drawer with the full ticket detail (handoff structure). Closes
    via the X, the overlay, or Escape — each just navigates back to the same
    page without the ?ticket= param so the URL stays clean. */
export function TicketDrawer({ ticket, projectId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Build the close URL: keep tab/feature, drop ticket
  const closeHref = (() => {
    const p = new URLSearchParams(searchParams);
    p.delete("ticket");
    const q = p.toString();
    return `/projects/${projectId}${q ? `?${q}` : ""}`;
  })();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push(closeHref);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [router, closeHref]);

  const stage = TICKET_STAGES.find((s) => s.id === ticket.stage);
  const checkedCount = ticket.acceptance.filter((a) => a.checked).length;
  const totalCriteria = ticket.acceptance.length;

  const close = () => router.push(closeHref);

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-slate-900/35 animate-[fadeIn_150ms_ease-out]"
        onClick={close}
      />
      <div
        className="fixed inset-y-0 right-0 z-[51] flex w-[640px] max-w-[95vw] flex-col bg-white shadow-[-8px_0_24px_rgba(15,23,42,0.12)] animate-[slideIn_220ms_ease-out]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[var(--bc-border)] px-6 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-600">
              {ticket.ref}
            </span>
            {stage && <Badge kind={stage.kind}>{stage.label}</Badge>}
            <Badge kind={PRIORITY_KIND[ticket.priority]} dot={false}>
              {ticket.priority}
            </Badge>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="mb-1 text-xl font-bold">{ticket.title}</h2>
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <GitBranch size={12} />
            {ticket.repo ?? `evanedgeworth/${projectId}`}
            {ticket.branch && (
              <>
                <span className="text-slate-300">·</span>
                <span>branch:</span>
                <code className="font-mono">{ticket.branch}</code>
              </>
            )}
            {ticket.prNumber && (
              <>
                <span className="text-slate-300">·</span>
                <span className="font-semibold text-brand-700">#{ticket.prNumber}</span>
              </>
            )}
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            <MetaField label="Acceptance" value={`${checkedCount} / ${totalCriteria} complete`} />
            <MetaField
              label="Handoff"
              value={
                ticket.handoffDate
                  ? new Date(ticket.handoffDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"
              }
            />
          </div>

          <Section label="Summary">
            <p>{ticket.summary}</p>
          </Section>

          {ticket.background && (
            <Section label="Background">
              <p>{ticket.background}</p>
            </Section>
          )}

          {ticket.userStory && (
            <Section label="User story">
              <p className="border-l-[3px] border-brand-500 pl-3 italic">{ticket.userStory}</p>
            </Section>
          )}

          {ticket.acceptance.length > 0 && (
            <Section label="Acceptance criteria">
              <ul className="list-none p-0">
                {ticket.acceptance.map((c, i) => (
                  <li
                    key={i}
                    className="relative border-b border-slate-100 py-2 pl-6 text-[13.5px] last:border-b-0"
                  >
                    <span
                      className={
                        "absolute left-0 top-[10px] inline-flex h-3.5 w-3.5 items-center justify-center rounded-[4px] border-[1.5px] " +
                        (c.checked
                          ? "border-success-600 bg-success-600 text-white"
                          : "border-slate-300")
                      }
                    >
                      {c.checked && <Check size={10} />}
                    </span>
                    <span className={c.checked ? "text-slate-500" : ""}>{c.text}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {ticket.files.length > 0 && (
            <Section label="Files likely to touch">
              <div className="rounded-lg border border-[var(--bc-border)] bg-slate-50 px-3.5 py-3 font-mono text-xs">
                {ticket.files.map((f, i) => (
                  <div key={i} className="py-0.5 text-slate-500">
                    <code className="font-semibold text-slate-900">{f.path}</code>
                    {f.note && <> — {f.note}</>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {ticket.engineeringNotes && (
            <Section label="Engineering notes">
              <p>{ticket.engineeringNotes}</p>
            </Section>
          )}

          {ticket.rolePermissionImpact && (
            <Section label="Role and permission impact">
              <p>{ticket.rolePermissionImpact}</p>
            </Section>
          )}

          {ticket.activity.length > 0 && (
            <Section label="Activity">
              {ticket.activity.map((a, i) => (
                <div key={i} className="flex items-center gap-2.5 py-1.5 text-[12.5px]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    {a.who.includes("agent") ? <GitBranch size={14} /> : <User size={14} />}
                  </span>
                  <div className="flex-1">
                    <span className="font-semibold">{a.who}</span> {a.what}
                    {a.meta && <span className="text-slate-500"> · {a.meta}</span>}
                  </div>
                  <span className="text-[11.5px] text-slate-400">{a.when}</span>
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-[var(--bc-border)] bg-slate-50 px-6 py-3.5">
          <div className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-400">
            {ticket.handoffFile && (
              <>
                <LinkIcon size={12} />
                {ticket.handoffFile}
              </>
            )}
          </div>
          <div className="flex gap-1.5">
            {ticket.handoffFile && (
              <button className="inline-flex items-center gap-1.5 rounded-md border border-[var(--bc-border)] bg-white px-2.5 py-1.5 text-[12.5px] font-medium hover:bg-slate-50">
                <LinkIcon size={12} />
                Open handoff
              </button>
            )}
            <a
              href={
                ticket.repo && ticket.prNumber
                  ? `https://github.com/${ticket.repo}/pull/${ticket.prNumber}`
                  : ticket.repo
                    ? `https://github.com/${ticket.repo}`
                    : "#"
              }
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--bc-border)] bg-white px-2.5 py-1.5 text-[12.5px] font-medium hover:bg-slate-50"
            >
              <GitBranch size={12} />
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--bc-border)] bg-slate-50 px-3 py-2.5">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className="text-[13px] font-medium">{value}</div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h5 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </h5>
      <div className="text-[13.5px] leading-relaxed">{children}</div>
    </div>
  );
}
