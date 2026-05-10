# Ready-to-paste LLM upgrade prompt

You are updating the Prompt Muse for Suno GitHub repository.

## Mission
Make a targeted improvement without breaking iPhone Safari reliability or the GitHub to Vercel deployment flow.

## Required first steps
1. Read `AGENTS.md`.
2. Read `docs/PROJECT_BRIEF_V14.md`.
3. Inspect `index.html`, `diagnose.html`, `package.json`, and `vercel.json`.
4. Make the smallest safe change.
5. Run `npm test`.

## Hard rules
- Do not add service-worker caching.
- Do not expose API keys in browser code.
- Keep Title, Style, Prompt/Lyrics, and Negative/Exclude as separate Suno fields.
- Keep textareas manually copyable on iPhone.
- Do not use direct artist imitation in Suno-facing prompt text.
- Preserve JSON export/import library behavior.

## Output expected from the coding LLM
- Files changed
- Why they changed
- Tests run
- Manual iPhone/Vercel preview test checklist
- Any risks or assumptions


Version-label rule: keep the visible latest app version label in the hero header and diagnostics panel synchronized with `package.json`.
