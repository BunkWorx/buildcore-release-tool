/** Shared-password gate has no real auth; UI label comes from env until proper login exists. */
export function releaseToolDisplayUser() {
  const name = process.env.NEXT_PUBLIC_RELEASE_TOOL_DISPLAY_NAME?.trim() || "";
  const role =
    process.env.NEXT_PUBLIC_RELEASE_TOOL_DISPLAY_ROLE?.trim() ||
    "BuildCore team";
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "BC";
  return { name, role, initials };
}

export function welcomeHeading(name: string) {
  return name ? `Welcome back, ${name}` : "Welcome back";
}
