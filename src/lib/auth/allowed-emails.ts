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
    // Vercel sometimes ships an empty string for a freshly-added env var.
    // Fail closed, but allow the known BuildCore team emails so login is not
    // blocked by a dashboard/config glitch.
    const fallback = new Set([
      "evan@mybuildcore.com",
      "tyler.woodworth@mybuildcore.com",
      "alex.bilba@mybuildcore.com",
    ]);
    if (process.env.NODE_ENV === "production") {
      return fallback.has(normalized);
    }
    return true;
  }
  return allowed.has(normalized);
}
