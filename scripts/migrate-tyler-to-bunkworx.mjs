#!/usr/bin/env node
/**
 * Re-sync the release-tool data from Tyler's legacy Supabase project into the
 * canonical BunkWorx project, preserving every row id.
 *
 *   legacy  fbrdhbxfkxywzokbdznv  (Tyler personal, source — read)
 *      -->  duullaauybtjnsotebvc  (BunkWorx org, dest — write, canonical)
 *
 * The original copy ran on 2026-06-02 (8 projects + full roadmap/tickets).
 * This script is idempotent: it UPSERTS by primary key, so re-running it
 * re-syncs any drift without duplicating rows. It does NOT delete rows that
 * exist only in the dest unless you pass --truncate.
 *
 * Auth (no values are hardcoded):
 *   SOURCE_KEY    legacy project key (anon is enough if anon RLS allows read;
 *                 service role is more reliable) — REQUIRED
 *   DEST_SERVICE  BunkWorx project service-role key — REQUIRED
 *   SOURCE_URL    default https://fbrdhbxfkxywzokbdznv.supabase.co
 *   DEST_URL      default https://duullaauybtjnsotebvc.supabase.co
 *
 * Usage:
 *   SOURCE_KEY=... DEST_SERVICE=... node scripts/migrate-tyler-to-bunkworx.mjs
 *   ... --dry-run            # count source rows per table, write nothing
 *   ... --only=projects,tickets
 *   ... --truncate           # DELETE dest rows in each table first (dangerous)
 *
 * release_tool_profiles is intentionally skipped: profiles are tied to
 * auth.users, which differ per Supabase project, so they are provisioned per
 * environment (see scripts/provision-release-tool-user.mjs), not copied.
 */

import { createClient } from "@supabase/supabase-js";

const SOURCE_URL =
  process.env.SOURCE_URL || "https://fbrdhbxfkxywzokbdznv.supabase.co";
const DEST_URL =
  process.env.DEST_URL || "https://duullaauybtjnsotebvc.supabase.co";
const SOURCE_KEY = process.env.SOURCE_KEY;
const DEST_SERVICE = process.env.DEST_SERVICE;

const DRY_RUN = process.argv.includes("--dry-run");
const TRUNCATE = process.argv.includes("--truncate");
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const ONLY = onlyArg ? onlyArg.slice("--only=".length).split(",").map((s) => s.trim()) : null;

// Parent tables first so child foreign keys resolve. Tables that still fail on
// the first pass (because of an ordering surprise) are retried automatically.
const TABLES = [
  { name: "projects", conflict: "id" },
  { name: "features", conflict: "id" },
  { name: "lifecycle_phases", conflict: "id" },
  { name: "feedback_items", conflict: "id" },
  { name: "ideas", conflict: "id" },
  { name: "tasks", conflict: "id" },
  { name: "pending_updates", conflict: "id" },
  { name: "activity_events", conflict: "id" },
  { name: "tickets", conflict: "id" },
  { name: "phase_items", conflict: "id" },
  { name: "test_cases", conflict: "id" },
  { name: "feature_tickets", conflict: "feature_id,ticket_id" },
  { name: "ticket_activity", conflict: "id" },
  { name: "ticket_acceptance", conflict: "id" },
  { name: "ticket_files", conflict: "id" },
];

const PAGE = 1000; // source read page size
const BATCH = 500; // dest upsert batch size

if (!SOURCE_KEY || !DEST_SERVICE) {
  console.error("Set SOURCE_KEY (legacy project) and DEST_SERVICE (BunkWorx service role).");
  process.exit(1);
}

const source = createClient(SOURCE_URL, SOURCE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const dest = createClient(DEST_URL, DEST_SERVICE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function readAll(table) {
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await source
      .from(table)
      .select("*")
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`read ${table}: ${error.message}`);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) break;
  }
  return rows;
}

async function countSource(table) {
  const { count, error } = await source
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) throw new Error(`count ${table}: ${error.message}`);
  return count ?? 0;
}

async function writeTable({ name, conflict }) {
  const rows = await readAll(name);
  if (rows.length === 0) {
    console.log(`  ${name}: source empty, nothing to copy`);
    return { rows: 0 };
  }
  if (TRUNCATE) {
    // Delete-all via an always-true filter (id is not null on every row).
    const { error } = await dest.from(name).delete().not("id", "is", null);
    if (error && !/column .*id.* does not exist/i.test(error.message)) {
      throw new Error(`truncate ${name}: ${error.message}`);
    }
  }
  for (let i = 0; i < rows.length; i += BATCH) {
    const slice = rows.slice(i, i + BATCH);
    const { error } = await dest
      .from(name)
      .upsert(slice, { onConflict: conflict, ignoreDuplicates: false });
    if (error) throw new Error(`upsert ${name} [${i}-${i + slice.length}]: ${error.message}`);
  }
  console.log(`  ${name}: ${rows.length} row(s) upserted (onConflict ${conflict})`);
  return { rows: rows.length };
}

async function main() {
  const targets = TABLES.filter((t) => !ONLY || ONLY.includes(t.name));
  console.log(
    `migrate-tyler-to-bunkworx: ${DRY_RUN ? "DRY RUN" : "LIVE"}${TRUNCATE ? " + TRUNCATE" : ""}`,
  );
  console.log(`  source: ${SOURCE_URL}`);
  console.log(`  dest:   ${DEST_URL}`);
  console.log(`  tables: ${targets.map((t) => t.name).join(", ")}`);
  console.log("");

  if (DRY_RUN) {
    let total = 0;
    for (const t of targets) {
      try {
        const c = await countSource(t.name);
        total += c;
        console.log(`  ${t.name}: ${c} source row(s)`);
      } catch (err) {
        console.error(`  ${t.name}: ${err.message}`);
      }
    }
    console.log(`\nDry run complete. ${total} total source row(s) across ${targets.length} table(s).`);
    return;
  }

  // Up to 3 passes so a child whose parent sorted later still lands.
  let pending = [...targets];
  const failures = [];
  for (let pass = 1; pass <= 3 && pending.length; pass += 1) {
    console.log(`Pass ${pass} (${pending.length} table(s)):`);
    const retry = [];
    for (const t of pending) {
      try {
        await writeTable(t);
      } catch (err) {
        console.error(`  ${t.name}: ${err.message} (will retry if passes remain)`);
        retry.push(t);
        failures.push({ table: t.name, error: err.message, pass });
      }
    }
    pending = retry;
  }

  console.log("");
  if (pending.length === 0) {
    console.log("Done. All tables synced.");
  } else {
    console.error(`Done with errors. Unresolved tables: ${pending.map((t) => t.name).join(", ")}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("migrate-tyler-to-bunkworx: fatal", err);
  process.exit(1);
});
