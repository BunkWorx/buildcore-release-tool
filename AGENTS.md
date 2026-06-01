<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## BuildCore Linear And Tracker Bridge

- Before meaningful work, run `~/buildcore-daily-tracker/bin/linear-agent context --team BC --limit 12`, then `~/buildcore-daily-tracker/bin/inbox`.
- Linear is the live task brain for agents. The daily tracker is the readable log and Evan/Tyler message queue.
- Before stopping, append a Linear receipt with `~/buildcore-daily-tracker/bin/linear-agent complete <BC-ID> --done "..." --verified "..." --left "..."`.
- If a release-tool change affects Evan or Tyler, send a tracker message before stopping. Anything asking for testing, review, approval, a decision, or Quality Assurance must be `question` or `urgent`, not `fyi`.
- Pushes to `main` dispatch to `BunkWorx/buildcore-daily-tracker`, where the bridge writes a durable message, creates a GitHub Issue notification, sends email for action-needed items, and creates a Linear bridge issue when configured.

Required repository secret in this repo:

- `BUILDCORE_TRACKER_PUSH_TOKEN`, a GitHub token allowed to dispatch workflows in `BunkWorx/buildcore-daily-tracker`.
