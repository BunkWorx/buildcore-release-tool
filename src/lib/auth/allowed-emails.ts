/** Invite-only: comma-separated allowlist in RELEASE_TOOL_ALLOWED_EMAILS. */
export function getAllowedEmails(): Set<string> {
  const raw = process.env.RELEASE_TOOL_ALLOWED_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isEmailAllowed(email: string | null | undefined): boolean {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return false;
  const allowed = getAllowedEmails();
  if (allowed.size === 0) {
    // Misconfiguration: fail closed in production.
    return process.env.NODE_ENV !== "production";
  }
  return allowed.has(normalized);
}
