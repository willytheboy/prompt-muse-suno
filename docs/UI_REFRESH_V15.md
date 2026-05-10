# Prompt Muse v15 UI Refresh

v15 converts Prompt Muse from a diagnostic-heavy prototype into a polished AI Studio interface.

## Main UX principles

1. Compose first: the user sees a single clear composition brief.
2. Copy fast: Title, Style, Prompt / Lyrics, and Negative / Exclude remain visible in a sticky dock.
3. Settings-driven: defaults and API routing are managed in one modal.
4. AI-first but safe: production API keys remain server-side in Vercel or Netlify environment variables.
5. Library memory: artists, genres, topics, countries, albums, and tracks are saved locally.

## API routing

Default endpoint: `/api/ai`.

Alternative endpoints:

- `/api/polish`
- `/.netlify/functions/ai`
- Custom proxy endpoint

## Version

v15.0.0 - AI Studio UI
