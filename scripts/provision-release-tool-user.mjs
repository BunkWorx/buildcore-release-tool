#!/usr/bin/env node
/**
 * Create or update an invite-only release-tool user (Supabase Auth + profile).
 *
 *   DEST_SERVICE=... RELEASE_TOOL_ALLOWED_EMAILS=... \
 *   node scripts/provision-release-tool-user.mjs evan@mybuildcore.com "TempPass123!" "Evan Edge" "Engineering"
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://duullaauybtjnsotebvc.supabase.co";
const serviceKey = process.env.DEST_SERVICE || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceKey) {
  console.error("Set SUPABASE_SERVICE_ROLE_KEY or DEST_SERVICE");
  process.exit(1);
}

const [email, password, displayName, roleLabel = "Member"] = process.argv.slice(2);
if (!email || !password || !displayName) {
  console.error(
    "Usage: node scripts/provision-release-tool-user.mjs <email> <password> <display_name> [role_label]",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const normalized = email.trim().toLowerCase();

const { data: existing } = await admin.auth.admin.listUsers({ perPage: 1000 });
const found = existing?.users?.find((u) => u.email?.toLowerCase() === normalized);

let userId = found?.id;
if (!userId) {
  const { data, error } = await admin.auth.admin.createUser({
    email: normalized,
    password,
    email_confirm: true,
    user_metadata: { full_name: displayName, role_label: roleLabel },
  });
  if (error) {
    console.error("createUser failed:", error.message);
    process.exit(1);
  }
  userId = data.user.id;
  console.log("created auth user", normalized);
} else {
  const { error } = await admin.auth.admin.updateUserById(userId, {
    password,
    user_metadata: { full_name: displayName, role_label: roleLabel },
  });
  if (error) {
    console.error("updateUser failed:", error.message);
    process.exit(1);
  }
  console.log("updated auth user", normalized);
}

const { error: profileErr } = await admin.from("release_tool_profiles").upsert({
  id: userId,
  email: normalized,
  display_name: displayName,
  role_label: roleLabel,
});
if (profileErr) {
  console.error("profile upsert failed:", profileErr.message);
  process.exit(1);
}

console.log("profile ready for", displayName);
