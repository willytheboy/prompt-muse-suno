# Changelog

## v15.0.0 AI Studio UI
- Rebuilt the front end into a modern AI Studio dashboard.
- Added Settings modal for API endpoint presets, model hint, default instructions, and creative defaults.
- Added server AI endpoint `/api/ai` and Netlify equivalent for composition, polish, and album generation.
- Moved diagnostics into a modal and reduced front-end debug clutter.
- Preserved LyricsFirst, AlbumBuilder, copy dock, library, memory, and GitHub to Vercel workflow.

## v15.2.0 API Status
- Added visible API deployment status in the Studio Status card and AI routing panel.
- Added Check API action that calls /api/health with cache disabled.
- Updated /api/health to report API reachability, build version, Vercel commit, environment, model, and OpenAI key presence as a boolean.

## v15.2.0
- Added LyricsGuard full-lyrics regeneration repair.
- Added dedicated Regenerate full lyrics action and validation status.
- Strengthened AI endpoint instructions to prevent scaffold/instruction output.
