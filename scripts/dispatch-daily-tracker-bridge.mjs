#!/usr/bin/env node
/**
 * Notify buildcore-daily-tracker when buildcore-release-tool changes land.
 */

import { execFileSync } from 'node:child_process';

function env(name) {
  return process.env[name]?.trim() || '';
}

function required(name) {
  const value = env(name);
  if (!value) {
    console.error(`dispatch-daily-tracker-bridge: ${name} is required`);
    process.exit(1);
  }
  return value;
}

function ghJson(args) {
  const token = required('BUILDCORE_TRACKER_PUSH_TOKEN');
  const out = execFileSync('gh', args, {
    encoding: 'utf8',
    env: { ...process.env, GH_TOKEN: token },
  });
  return JSON.parse(out || '{}');
}

function gh(args, input) {
  const token = required('BUILDCORE_TRACKER_PUSH_TOKEN');
  execFileSync('gh', args, {
    input,
    stdio: ['pipe', 'inherit', 'inherit'],
    encoding: 'utf8',
    env: { ...process.env, GH_TOKEN: token },
  });
}

function isDryRun() {
  return env('DRY_RUN') === '1' || env('DRY_RUN').toLowerCase() === 'true';
}

function main() {
  const repo = env('GITHUB_REPOSITORY') || 'BunkWorx/buildcore-release-tool';
  const sha = required('AFTER_SHA');
  const before = env('BEFORE_SHA') || '';
  const sender = env('GITHUB_ACTOR') || 'tyler';

  let files = [];
  if (before && before !== '0000000000000000000000000000000000000000') {
    const diff = ghJson([
      'api',
      `repos/${repo}/compare/${before}...${sha}`,
      '--jq',
      '[.files[]?.filename]',
    ]);
    files = Array.isArray(diff) ? diff : [];
  }

  const commit = ghJson(['api', `repos/${repo}/commits/${sha}`, '--jq', '{message: .commit.message, html_url}']);
  const message = (commit.message || '').split('\n')[0];
  const commitUrl = commit.html_url || `https://github.com/${repo}/commit/${sha}`;
  const compareUrl =
    before && before !== '0000000000000000000000000000000000000000'
      ? `https://github.com/${repo}/compare/${before}...${sha}`
      : commitUrl;

  const payload = {
    event_type: 'tyler-repo-bridge',
    client_payload: {
      repo,
      branch: 'main',
      commit: sha,
      commit_url: commitUrl,
      compare_url: compareUrl,
      message,
      sender,
      priority: 'fyi',
      action_required: false,
      files: files.slice(0, 20),
    },
  };

  if (isDryRun()) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  gh(
    [
      'api',
      'repos/BunkWorx/buildcore-daily-tracker/dispatches',
      '--method',
      'POST',
      '--input',
      '-',
    ],
    JSON.stringify(payload),
  );

  console.log(`dispatch-daily-tracker-bridge: notified daily tracker for ${repo}@${sha.slice(0, 7)}`);
}

main();
