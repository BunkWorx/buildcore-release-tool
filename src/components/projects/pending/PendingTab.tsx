"use client";

import { useState } from "react";
import { Copy, Download, Inbox, Pencil, ChevronRight, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { FEATURE_STATUS_LABEL } from "@/lib/mock";
import {
  allAreasToMarkdown,
  buildAllAreasHandoffPrompt,
  buildAreaHandoffPrompt,
  areaToMarkdown,
} from "@/lib/handoff";
import type { PendingAreaGroup, ProjectDetail } from "@/lib/types";

type Props = {
  project: ProjectDetail;
  groups: PendingAreaGroup[];
};

export function PendingTab({ project, groups }: Props) {
  const [toast, setToast] = useState<string | null>(null);
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());

  const totalItems = groups.reduce((s, g) => s + g.items.length, 0);
  const testFailures = groups.reduce(
    (s, g) => s + g.items.filter((i) => i.type === "test_failure").length,
    0,
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const copy = async (text: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    showToast(msg);
  };

  const download = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const today = new Date().toISOString().slice(0, 10);

  const toggle = (key: string) =>
    setExpandedAreas((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  if (groups.length === 0) {
    return (
      <div className="rounded-[var(--bc-radius)] border border-dashed border-[var(--bc-border)] bg-white px-6 py-16 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Inbox size={22} />
        </div>
        <h3 className="mb-1.5">Nothing pending</h3>
        <p className="text-[12.5px] text-slate-500">
          Mark a test failed on the Testing tab to start the next handoff.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h3>Pending updates</h3>
        <p className="mt-0.5 text-[11.5px] text-slate-400">
          Items captured for your next engineering handoff to Evan.
        </p>
      </div>

      <div className="mb-3 rounded-[var(--bc-radius)] border border-[var(--bc-border)] bg-slate-50 px-4 py-2.5 text-[13px] leading-relaxed text-slate-600">
        <strong className="text-slate-900">Workflow: </strong>
        Each area below produces <strong>one bundled handoff doc</strong> covering all its items.
        Click <strong>Copy handoff prompt</strong> on an area to send just that one to Claude, or{" "}
        <strong>Copy all-areas prompt</strong> above to generate one doc per area in a single pass.
        Output lands in{" "}
        <code className="rounded border border-[var(--bc-border)] bg-white px-1.5 py-px font-mono text-[11.5px]">
          ~/buildcore-tyler/handoffs/
        </code>
        .
      </div>

      <div className="mb-4 flex items-center gap-2.5 rounded-[var(--bc-radius)] border bg-warning-50 px-3.5 py-2.5" style={{ borderColor: "var(--bc-warning-100)" }}>
        <Inbox size={18} style={{ color: "var(--bc-warning-700)" }} />
        <div className="text-[13px] font-medium text-warning-700">
          {totalItems} {totalItems === 1 ? "item" : "items"} ready
          {testFailures > 0 && <> · {testFailures} test {testFailures === 1 ? "failure" : "failures"}</>}
        </div>
        <div className="ml-auto flex gap-1.5">
          <button
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-semibold text-white"
            style={{ background: "var(--bc-brand-600)" }}
            onClick={() =>
              copy(
                buildAllAreasHandoffPrompt(project, groups),
                "All-areas prompt copied — paste into Claude",
              )
            }
          >
            <Copy size={12} />
            Copy all-areas prompt
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--bc-border)] bg-white px-2.5 py-1.5 text-[12.5px] font-medium hover:bg-slate-50"
            onClick={() => copy(allAreasToMarkdown(project, groups), "Copied as Markdown")}
          >
            <Copy size={12} />
            Copy as Markdown
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--bc-border)] bg-white px-2.5 py-1.5 text-[12.5px] font-medium hover:bg-slate-50"
            onClick={() => download(allAreasToMarkdown(project, groups), `${project.id}-pending-${today}.md`)}
          >
            <Download size={12} />
            .md
          </button>
        </div>
      </div>

      {groups.map((group) => {
        const key = group.feature ? group.feature.id : "__unassigned__";
        const expanded = expandedAreas.has(key);
        const areaName = group.feature ? group.feature.name : "Unassigned";
        const featureStatus = group.feature ? FEATURE_STATUS_LABEL[group.feature.status] : null;
        return (
          <div
            key={key}
            className="mb-3 overflow-hidden rounded-[var(--bc-radius)] border border-[var(--bc-border)] bg-white shadow-[var(--bc-shadow-xs)]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--bc-border)] bg-slate-50 px-4 py-3.5">
              <button
                type="button"
                onClick={() => toggle(key)}
                className="flex flex-1 items-center gap-3"
              >
                <ChevronRight
                  size={16}
                  className={"text-slate-400 transition-transform " + (expanded ? "rotate-90" : "")}
                />
                <div className="text-left">
                  <h4 className="m-0 flex items-center gap-2 text-[15px] font-semibold">
                    {areaName}
                    {featureStatus && <Badge kind={featureStatus.kind}>{featureStatus.label}</Badge>}
                  </h4>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11.5px] text-slate-400">
                    <span>
                      {group.items.length} {group.items.length === 1 ? "item" : "items"}
                    </span>
                    {group.feature?.ticketRefs.map((r) => (
                      <span key={r} className="rounded-full border border-[var(--bc-border)] bg-white px-1.5 font-mono text-[10.5px] font-semibold text-slate-500">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
              <div className="flex gap-1.5">
                <button
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-semibold text-white"
                  style={{ background: "var(--bc-brand-600)" }}
                  onClick={() =>
                    copy(
                      buildAreaHandoffPrompt(project, group),
                      `Handoff prompt for ${areaName} copied`,
                    )
                  }
                  title="Copy a Claude prompt that bundles these into a single handoff doc"
                >
                  <Copy size={12} />
                  Copy handoff prompt
                </button>
                <button
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--bc-border)] bg-white px-2.5 py-1.5 text-[12.5px] font-medium hover:bg-slate-50"
                  onClick={() => {
                    const slug = areaName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    download(areaToMarkdown(project, group), `${project.id}-${slug}-${today}.md`);
                  }}
                  title="Download just this area as Markdown"
                >
                  <Download size={12} />
                </button>
              </div>
            </div>

            {expanded && (
              <div className="bg-slate-50 px-4 py-3">
                {group.items.map((p) => (
                  <div
                    key={p.id}
                    className="mb-2.5 overflow-hidden rounded-lg border-l-[4px] bg-white last:mb-0"
                    style={{ borderLeftColor: "var(--bc-danger-600)" }}
                  >
                    <div className="p-4">
                      <h4 className="mb-1 text-[14px] font-semibold">{p.title}</h4>
                      <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11.5px] text-slate-400">
                        <span className="rounded-full bg-slate-100 px-1.5 py-px font-semibold text-slate-600">
                          Test failure
                        </span>
                        {p.featureName && (
                          <span className="rounded-full bg-slate-100 px-1.5 py-px font-semibold text-slate-600">
                            {p.featureName}
                          </span>
                        )}
                        {p.linkedTicketRefs.length > 0 && (
                          <span className="rounded-full bg-slate-100 px-1.5 py-px font-semibold text-slate-600">
                            {p.linkedTicketRefs.join(", ")}
                          </span>
                        )}
                        <span>captured {p.createdAt}</span>
                      </div>
                      <p className="text-[13px] leading-relaxed">{p.description}</p>
                      {p.steps.length > 0 && (
                        <div className="mt-2.5">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Steps to reproduce
                          </div>
                          <ol className="ml-4 mt-1 list-decimal text-[12.5px] text-slate-600">
                            {p.steps.map((s, i) => (
                              <li key={i} className="py-0.5">{s}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full px-4 py-2.5 text-[13px] font-medium text-white shadow-lg" style={{ background: "var(--bc-slate-900)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
