"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/session";
import { isEmailAllowed } from "@/lib/auth/allowed-emails";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/");

  if (!email || !password) {
    redirect("/login?error=missing_credentials");
  }

  if (!isEmailAllowed(email)) {
    redirect("/login?error=not_invited");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    redirect(`/login?error=${encodeURIComponent(error?.message ?? "sign_in_failed")}`);
  }

  await ensureProfile(data.user);
  redirect(next.startsWith("/") ? next : "/");
}
