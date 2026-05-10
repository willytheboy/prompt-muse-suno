# Prompt Muse v14.4 - GitHub to Vercel for Suno

Prompt Muse is an iPhone-first Suno prompt and lyric studio. v14.4 keeps the GitHub/Vercel-ready workflow and adds a visible latest-version label in the app header and diagnostics so users can confirm exactly which build is live.

## What the app creates

- Title
- Style
- Prompt / Lyrics
- Negative / Exclude

It also stores prompts in a searchable local library by genre, style, inspired by, country/place, BPM, favorites, and keyword.

## v14 highlights

- In-app GitHub to Vercel LLM Upgrade Console.
- Ready-to-paste LLM upgrade brief generator.
- Git command scaffold generator.
- `vercel.json` for Vercel.
- GitHub Actions quality workflow.
- PR and issue templates.
- `AGENTS.md` and LLM instruction pack.
- No service worker cache.

## Deploy from GitHub to Vercel

1. Create a GitHub repo.
2. Upload all project files with `index.html` at the root.
3. Import the repo into Vercel.
4. Framework preset: `Other`.
5. Build command: leave blank.
6. Output directory: `.`.
7. Test the Vercel preview on iPhone before merging PRs.

## Scripts

```bash
npm test
npm run verify
npm run brief
```

## Optional AI polish backend

Set these in Vercel only, never in browser code:

```text
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.5
```

## Key files

```text
index.html
diagnose.html
reset-cache.html
vercel.json
AGENTS.md
.github/workflows/quality.yml
llm/UPGRADE_PROMPT.md
docs/DEPLOYMENT_GITHUB_VERCEL.md
```


## v14.3 Vercel deploy fix

This build removes the explicit `functions` block from `vercel.json`. Vercel now auto-detects Node.js functions placed in `/api`, including `/api/polish.js` and `/api/health.js`.

After deployment, test:

```text
https://YOUR-APP.vercel.app/api/health
```

If it returns JSON with `ok: true`, the API folder is deployed correctly.

## v14.4 version label update

This build displays the latest app version in the hero header and diagnostics panel:

```text
Latest app version: v14.5.3
Build: v14.5.3-favorite-marker-fix  -  LyricsFirst  -  ManifestAuthFix
```

Use this visible label to confirm that Vercel is serving the latest GitHub deployment rather than an older cached or protected preview.
