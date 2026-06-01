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

  execFileSync(
    'gh',
    [
      'api',
      'repos/BunkWorx/buildcore-daily-tracker/dispatches',
      '-f',
      'event_type=tyler-repo-bridge',
      '-f',
      `client_payload[repo]=${repo}`,
      '-f',
      'client_payload[branch]=main',
      '-f',
      `client_payload[commit]=${sha}`,
      '-f',
      `client_payload[commit_url]=${commitUrl}`,
      '-f',
      `client_payload[compare_url]=${compareUrl}`,
      '-f',
      `client_payload[message]=${message}`,
      '-f',
      `client_payload[summary]=${message}`,
      '-f',
      `client_payload[sender]=${sender}`,
      '-f',
      `client_payload[files]=${files.slice(0, 20).join(',')}`,
    ],
    { stdio: 'inherit', env: { ...process.env, GH_TOKEN: required('BUILDCORE_TRACKER_PUSH_TOKEN') } },
  );

  console.log(`dispatch-daily-tracker-bridge: notified daily tracker for ${repo}@${sha.slice(0, 7)}`);
}

main();
