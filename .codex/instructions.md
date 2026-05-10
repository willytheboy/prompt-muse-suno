# AGENTS.md — Prompt Muse for Suno

This repository is an iPhone-first Suno prompt and lyrics app. Treat it as a static web app deployed through Vercel from GitHub.

## Non-negotiables

- Do not add a service worker until the user explicitly asks and iPhone tap stability is verified.
- Do not expose API keys in browser code. Server secrets belong in Vercel environment variables.
- Keep artist names as private metadata only; Suno-facing prompt fields must use descriptive sonic traits.
- Preserve the four Suno copy fields: Title, Style, Prompt / Lyrics, Negative / Exclude.
- Keep output fields as plain textareas so iPhone users can manually Select All → Copy.
- Preserve library JSON export/import compatibility unless a migration is included.
- Run `npm test` before proposing a commit.

## Preferred workflow

1. Create an upgrade branch.
2. Make the smallest safe change.
3. Run `npm test`.
4. Update docs and changelog.
5. Open a PR.
6. Test the Vercel preview on iPhone Safari before merging.

## Key files

- `index.html` — main app with embedded UI and logic.
- `diagnose.html` — minimal browser interaction diagnostic page.
- `api/polish.js` — Vercel serverless OpenAI polish endpoint.
- `vercel.json` — Vercel routing/header/function configuration.
- `docs/` — project brief and deployment docs.
- `llm/` — prompts and handoff files for coding LLMs.
