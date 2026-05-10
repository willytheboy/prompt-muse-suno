# Prompt Muse v15.1 API Status

This release adds an in-app API deployment check.

## How it works

The app calls `/api/health` with `cache: no-store`.

A healthy deployment returns JSON like:

```json
{
  "ok": true,
  "app": "Prompt Muse for Suno",
  "version": "v15.1.0",
  "build": "v15.1-api-status",
  "api": "deployed",
  "hasOpenAIKey": true,
  "model": "gpt-5.5",
  "vercelEnv": "production",
  "commit": "...",
  "timestamp": "..."
}
```

The app displays:

- Live: API deployed and reachable.
- Protected: Vercel returned 401 or 403.
- Missing: `/api/health` returned 404.
- Error: server returned another error.
- Offline: browser could not reach the endpoint.

The health endpoint never exposes the API key. It only reports whether `OPENAI_API_KEY` exists as a boolean.
