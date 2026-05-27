"use client";

import { useState } from "react";
import { Check, Plus, Trash2, Ticket, MessageSquare, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { MOCK_TASKS } from "@/lib/mock";
import type { Task } from "@/lib/types";

const DUE_LABEL: Record<NonNullable<Task["due"]>, { label: string; cls: string }> = {
  today:     { label: "Today",     cls: "bg-danger-50 text-danger-700" },
  this_week: { label: "This week", cls: "bg-warning-50 text-warning-700" },
};

/** Client-side My tasks card. Holds tasks in component state until Phase 5
    swaps the source for Supabase. The shape matches the Supabase `tasks`
    table so the swap is mechanical. */
export function MyTasks() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [showDone, setShowDone] = useState(false);
  const [draft, setDraft] = useState("");

  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  const visible = showDone ? tasks : open;

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setTasks((prev) => [
      {
        id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: draft.trim(),
        done: false,
        linkType: null,
        linkRef: null,
        linkProjectId: null,
        linkProjectName: null,
        due: null,
      },
      ...prev,
    ]);
    setDraft("");
  };

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <div
      className="mb-6 overflow-hidden rounded-[var(--bc-radius)] border border-[var(--bc-border)] shadow-[var(--bc-shadow-xs)]"
      style={{ background: "linear-gradient(180deg, #fff 0%, var(--bc-brand-50) 200%)" }}
    >
      <div className="flex items-center justify-between border-b border-[var(--bc-border)] px-5 py-4">
        <h3 className="m-0 flex items-center gap-2 text-base">
          <Check size={18} className="text-brand-600" />
          My tasks
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
            {open.length} open
          </span>
        </h3>
        <button
          type="button"
          onClick={() => setShowDone((s) => !s)}
          className={cn(
            "rounded-md px-2.5 py-1 text-[12.5px] font-medium hover:bg-slate-100",
            showDone ? "text-brand-700" : "text-slate-500",
          )}
        >
          {showDone ? "Hide done" : `Show done (${done.length})`}
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="px-5 py-6 text-center text-[13px] text-slate-400">
          You&rsquo;re clear. Capture something below or star an item somewhere else.
        </div>
      ) : (
        visible.map((t) => (
          <TaskRow key={t.id} task={t} onToggle={() => toggle(t.id)} onRemove={() => remove(t.id)} />
        ))
      )}

      <form
        onSubmit={add}
        className="flex items-center gap-2.5 border-t border-[var(--bc-border)] bg-slate-50 px-5 py-3"
      >
        <Plus size={16} className="text-slate-400" />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a task for yourself... (press Enter)"
          className="flex-1 rounded-lg border border-[var(--bc-border)] bg-white px-3 py-1.5 text-[13.5px] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        {draft.trim() && (
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-[12.5px] font-semibold text-white"
          >
            Add
          </button>
        )}
      </form>
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  onRemove,
}: {
  task: Task;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const due = task.due ? DUE_LABEL[task.due] : null;
  const linkIcon =
    task.linkType === "ticket" ? Ticket : task.linkType === "feedback" ? MessageSquare : LinkIcon;
  const LinkIco = linkIcon;

  return (
    <div
      className={cn(
        "group grid grid-cols-[22px_1fr_auto] items-center gap-3 border-b border-slate-100 px-5 py-2.5 last:border-b-0 hover:bg-slate-50",
        task.done && "opacity-100",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex h-[18px] w-[18px] items-center justify-center rounded-md border-[1.5px] transition-colors",
          task.done
            ? "border-brand-600 bg-brand-600 text-white"
            : "border-slate-300 text-transparent hover:border-brand-500",
        )}
        aria-label={task.done ? "Mark as not done" : "Mark as done"}
      >
        <Check size={12} />
      </button>

      <div>
        <div
          className={cn(
            "text-[13.5px] font-medium",
            task.done && "text-slate-400 line-through",
          )}
        >
          {task.title}
        </div>
        {(task.linkProjectName || due) && (
          <div className="mt-1 flex items-center gap-2 text-[11.5px] text-slate-400">
            {task.linkProjectName && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-1.5 py-px text-[11px] font-medium text-brand-700">
                <LinkIco size={10} />
                {task.linkRef ? `${task.linkRef} · ${task.linkProjectName}` : task.linkProjectName}
              </span>
            )}
            {due && (
              <span className={cn("rounded-full px-1.5 py-px font-semibold", due.cls)}>
                {due.label}
              </span>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="rounded-md p-1.5 text-slate-300 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100"
        aria-label="Delete task"
        title="Delete task"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
