# Prompt Muse v14 Project Brief — GitHub → Vercel Upgrade Interface

## Purpose

Prompt Muse is an iPhone-first Suno prompt and lyric studio. v14 turns the app into a repository-first product that can be upgraded by any coding LLM through a predictable GitHub branch → pull request → Vercel preview → production merge workflow.

## Product goals

1. Generate Suno-ready prompt bundles with separate Title, Style, Prompt/Lyrics, and Negative/Exclude fields.
2. Preserve artist inspirations as private metadata while converting them into descriptive sonic traits.
3. Save prompts to a searchable local library by genre, style, inspired-by, country/place, BPM, favorites, and keyword.
4. Make upgrades easy from Codex, Cursor, Claude, ChatGPT, Gemini, or another coding LLM.
5. Keep iPhone Safari reliability above feature complexity.

## v14 additions

- GitHub/Vercel-ready repository files.
- `vercel.json` configuration.
- GitHub Actions quality workflow.
- Pull request and issue templates.
- `AGENTS.md` plus Codex/Cursor-friendly instruction files.
- Built-in LLM Upgrade Console in the app.
- Ready-to-paste LLM upgrade brief generator.
- Git command scaffold generator.
- Deployment and release checklists.

## Current architecture

The app is a static web app with embedded logic in `index.html`. This is intentional: previous builds had button, service-worker, and app-shell cache issues on iPhone. v14 continues the v13 InputDrive strategy: generation can happen through native select menus, a range slider, automatic field changes, and plain textareas even if buttons are unreliable.

## Deployment model

GitHub is the source of truth. Vercel imports the GitHub repository and creates preview deployments for branches/PRs and production deployments from the production branch.

## Security model

API keys are never stored in the browser. Optional AI polishing is routed through serverless functions, using environment variables configured in Vercel.
