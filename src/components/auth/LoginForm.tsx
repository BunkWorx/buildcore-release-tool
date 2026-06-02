"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "@/app/login/actions";

const ERROR_MESSAGES: Record<string, string> = {
  missing_credentials: "Enter your email and password.",
  not_invited: "This account is not invited to the release tool. Contact BuildCore engineering.",
  sign_in_failed: "Sign-in failed. Check your email and password.",
};

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const errorKey = searchParams.get("error") ?? "";
  const errorMessage =
    ERROR_MESSAGES[errorKey] ??
    (errorKey && !ERROR_MESSAGES[errorKey] ? decodeURIComponent(errorKey) : "");

  return (
    <form
      action={signIn}
      className="w-[400px] max-w-full rounded-2xl border bg-white p-8 shadow-md"
      style={{ borderColor: "var(--bc-border)" }}
    >
      <div className="mb-6">
        <h3 className="m-0 text-base font-bold">BuildCore Release Tool</h3>
        <p className="mt-1 text-xs text-slate-500">
          Sign in with your invited BuildCore account.
        </p>
      </div>

      <input type="hidden" name="next" value={next} />

      <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-400">
        Email
      </label>
      <input
        type="email"
        name="email"
        required
        autoFocus
        autoComplete="email"
        className="mb-4 w-full rounded-lg border bg-slate-50 px-3 py-2.5 text-sm outline-none focus:bg-white"
        style={{ borderColor: "var(--bc-border)" }}
      />

      <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-400">
        Password
      </label>
      <input
        type="password"
        name="password"
        required
        autoComplete="current-password"
        className="w-full rounded-lg border bg-slate-50 px-3 py-2.5 text-sm outline-none focus:bg-white"
        style={{ borderColor: "var(--bc-border)" }}
      />

      {errorMessage && (
        <p className="mt-3 text-[12px] font-medium text-red-700">{errorMessage}</p>
      )}

      <button
        type="submit"
        className="mt-5 w-full rounded-lg py-2.5 text-sm font-semibold text-white"
        style={{ background: "var(--bc-brand-600)" }}
      >
        Sign in
      </button>

      <p className="mt-6 text-center text-[11px] text-slate-400">
        Invite-only. Does not use the bid-sheet-v2 production database.
      </p>
    </form>
  );
}
