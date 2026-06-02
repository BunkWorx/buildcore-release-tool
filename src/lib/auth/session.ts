import { createClient } from "@/lib/supabase/server";
import { supabaseService } from "@/lib/supabase/server";
import { isEmailAllowed } from "@/lib/auth/allowed-emails";

export type ReleaseToolUser = {
  id: string;
  email: string;
  displayName: string;
  roleLabel: string;
  initials: string;
};

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function displayNameFromEmail(email: string) {
  const local = email.split("@")[0] ?? email;
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export async function ensureProfile(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}) {
  const email = user.email?.trim().toLowerCase();
  if (!email || !isEmailAllowed(email)) return null;

  const meta = user.user_metadata ?? {};
  const displayName =
    (typeof meta.full_name === "string" && meta.full_name.trim()) ||
    (typeof meta.name === "string" && meta.name.trim()) ||
    displayNameFromEmail(email);
  const roleLabel =
    (typeof meta.role_label === "string" && meta.role_label.trim()) || "Member";

  const admin = supabaseService();
  await admin.from("release_tool_profiles").upsert(
    {
      id: user.id,
      email,
      display_name: displayName,
      role_label: roleLabel,
    },
    { onConflict: "id" },
  );

  return { displayName, roleLabel };
}

export async function getReleaseToolUser(): Promise<ReleaseToolUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !isEmailAllowed(user.email)) return null;

  const { data: profile } = await supabase
    .from("release_tool_profiles")
    .select("display_name, role_label, email")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.display_name ??
    (await ensureProfile(user))?.displayName ??
    displayNameFromEmail(user.email);
  const roleLabel = profile?.role_label ?? "Member";

  return {
    id: user.id,
    email: user.email,
    displayName,
    roleLabel,
    initials: initialsFromName(displayName),
  };
}
