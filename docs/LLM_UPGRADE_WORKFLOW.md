# LLM upgrade workflow

Use the in-app LLM Upgrade Console or `llm/UPGRADE_PROMPT.md` to brief any coding model.

## Flow

1. Fill the repo URL, Vercel URL, target branch, target version, goal, constraints, and test plan in the app.
2. Generate the LLM upgrade brief.
3. Paste the brief into Codex, Cursor, Claude, ChatGPT, Gemini, or another coding LLM.
4. Let the LLM edit a Git branch.
5. Run `npm test`.
6. Push to GitHub.
7. Test the Vercel preview deployment.
8. Merge to production.

## What the LLM must preserve

- iPhone fallback controls.
- Plain textareas for manual copy.
- Four-field Suno output structure.
- Artist-safe prompt generation.
- Library export/import.
- No browser-side secrets.
