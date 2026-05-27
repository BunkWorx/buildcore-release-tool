import type { PendingAreaGroup, PendingUpdate, ProjectDetail } from "./types";

/** Convert a list of pending updates into a clean Markdown brief.
    Used by both per-area and all-areas exports. */
function writeItemBody(p: PendingUpdate, lines: string[]) {
  if (p.type === "test_failure") {
    lines.push("### What broke");
    lines.push(p.description || "_(no description provided yet)_");
    lines.push("");
    if (p.steps.length) {
      lines.push("### Steps to reproduce");
      p.steps.forEach((s, j) => lines.push(`${j + 1}. ${s}`));
      lines.push("");
    }
    if (p.expected) {
      lines.push("### Expected outcome");
      lines.push(p.expected);
      lines.push("");
    }
  } else {
    lines.push("### Description");
    lines.push(p.description || "_(no description)_");
    lines.push("");
  }
}

export function areaToMarkdown(project: ProjectDetail, group: PendingAreaGroup): string {
  const today = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];
  const areaName = group.feature ? group.feature.name : "Unassigned";
  lines.push(`# ${areaName} — pending updates`);
  lines.push("");
  lines.push(`- **Repo:** ${project.externalRepo ?? "(repo)"}  `);
  lines.push(`- **Project:** ${project.name}  `);
  lines.push(`- **Area / feature:** ${areaName}  `);
  if (group.feature) {
    if (group.feature.ticketRefs.length > 0) {
      lines.push(`- **Related tickets:** ${group.feature.ticketRefs.join(", ")}  `);
    }
    if (group.feature.description) {
      lines.push(`- **Feature description:** ${group.feature.description}  `);
    }
  }
  lines.push(`- **Item count:** ${group.items.length}  `);
  lines.push(`- **Compiled:** ${today}  `);
  lines.push("");
  lines.push("---");
  lines.push("");
  group.items.forEach((p, i) => {
    const typeLabel = p.type === "test_failure" ? "Test failure" : p.type === "feedback" ? "Feedback" : "Manual update";
    lines.push(`## ${i + 1}. [${typeLabel}] ${p.title}`);
    lines.push("");
    lines.push(`- **Captured:** ${p.createdAt}`);
    lines.push("");
    writeItemBody(p, lines);
    lines.push("---");
    lines.push("");
  });
  return lines.join("\n");
}

export function allAreasToMarkdown(project: ProjectDetail, groups: PendingAreaGroup[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];
  const totalItems = groups.reduce((s, g) => s + g.items.length, 0);
  lines.push(`# Pending updates — ${project.name}`);
  lines.push("");
  lines.push(`- **Repo:** ${project.externalRepo ?? "(repo)"}  `);
  lines.push(`- **Project owner:** ${project.owner ?? "(owner)"}  `);
  lines.push(`- **Target release:** ${project.targetReleaseDate ?? "(date)"}  `);
  lines.push(`- **Compiled:** ${today}  `);
  lines.push(`- **Area count:** ${groups.length}  `);
  lines.push(`- **Total items:** ${totalItems}  `);
  lines.push("");
  lines.push("> One handoff doc per area. Items within an area are bundled into a single doc.");
  lines.push("");
  groups.forEach((g, gi) => {
    const areaName = g.feature ? g.feature.name : "Unassigned";
    lines.push("================================================================");
    lines.push(`# AREA ${gi + 1}: ${areaName}`);
    lines.push("================================================================");
    lines.push("");
    if (g.feature) {
      if (g.feature.ticketRefs.length > 0) {
        lines.push(`- **Related tickets:** ${g.feature.ticketRefs.join(", ")}`);
      }
      if (g.feature.description) {
        lines.push(`- **Feature description:** ${g.feature.description}`);
      }
    }
    lines.push(`- **Items in this area:** ${g.items.length}`);
    lines.push("");
    g.items.forEach((p, i) => {
      const typeLabel = p.type === "test_failure" ? "Test failure" : p.type === "feedback" ? "Feedback" : "Manual update";
      lines.push(`## ${i + 1}. [${typeLabel}] ${p.title}`);
      lines.push("");
      lines.push(`- **Captured:** ${p.createdAt}`);
      lines.push("");
      writeItemBody(p, lines);
      lines.push("---");
      lines.push("");
    });
  });
  return lines.join("\n");
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export function buildAreaHandoffPrompt(project: ProjectDetail, group: PendingAreaGroup): string {
  const today = new Date().toISOString().slice(0, 10);
  const md = areaToMarkdown(project, group);
  const areaName = group.feature ? group.feature.name : "Unassigned items";
  const slug = slugify(areaName);
  return [
    "Apply the @anthropic-skills:engineering-handoff-documentation skill to produce a SINGLE handoff HTML doc for the area below.",
    "",
    `All ${group.items.length} items in this brief belong to the same area / feature and must be bundled into ONE unified handoff:`,
    "",
    `- Repo: **${project.externalRepo ?? "(repo)"}**`,
    `- Project: **${project.name}** (target release ${project.targetReleaseDate ?? "TBD"})`,
    `- Area: **${areaName}**`,
    `- Output file: \`~/buildcore-tyler/handoffs/${today}/${today}-${slug}-handoff.html\``,
    "",
    "Doc structure:",
    '- Title = the area name + "engineering handoff"',
    "- Summary describes the area being updated and why",
    "- Background covers context for ALL items together",
    '- "Required changes" section contains one subsection per item below (preserve the test-failure vs manual labels)',
    '- Acceptance criteria is the **union** of all items\' expected outcomes (derive checkbox items from "Expected outcome" on test failures and from the description on manual items)',
    "- Files likely to touch = union across all items if known",
    '- "Reproduction" subsection consolidates Steps to reproduce from any test-failure items',
    '- **Role and Permission Impact** section is required per the global rule — answer for the area as a whole, even if "No role or permission changes"',
    "- Related tickets list = the feature's ticket refs (already provided)",
    "",
    "Return the final file path when done.",
    "",
    "---",
    "",
    md,
  ].join("\n");
}

export function buildAllAreasHandoffPrompt(project: ProjectDetail, groups: PendingAreaGroup[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const md = allAreasToMarkdown(project, groups);
  return [
    `Apply the @anthropic-skills:engineering-handoff-documentation skill to produce ${groups.length} handoff HTML docs — ONE per area below. Items within an area MUST be bundled into a single doc for that area.`,
    "",
    `- Repo for all docs: **${project.externalRepo ?? "(repo)"}**`,
    `- Project: **${project.name}** (target release ${project.targetReleaseDate ?? "TBD"})`,
    `- Owner: ${project.owner ?? "(owner)"}`,
    `- Output directory: \`~/buildcore-tyler/handoffs/${today}/\``,
    `- File naming per area: \`${today}-<area-slug>-handoff.html\``,
    "",
    "For each area doc:",
    '- Title = area name + "engineering handoff"',
    "- Summary describes the area being updated",
    "- Background covers context for all items in that area",
    '- "Required changes" section: one subsection per item, preserving test-failure vs manual labels',
    "- Acceptance criteria is the **union** of all items' expected outcomes within that area",
    "- Files likely to touch = union across items in the area if known",
    '- "Reproduction" subsection consolidates Steps to reproduce from any test-failure items in the area',
    "- **Role and Permission Impact** section is required per the global rule — answer for the area as a whole",
    "- Related tickets list = the feature's ticket refs (provided per area below)",
    "",
    "Return the file paths for all docs when done so I can review them.",
    "",
    "---",
    "",
    md,
  ].join("\n");
}
