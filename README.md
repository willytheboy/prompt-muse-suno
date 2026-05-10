# Prompt Muse v15 AI Studio UI for Suno

Prompt Muse v15 is a streamlined AI-first front end for creating Suno-ready compositions, lyrics, albums, prompt libraries, and release-safe variations.

## What is new in v15

- Redesigned modern dashboard with left navigation, hero actions, and a cleaner Suno copy dock.
- Settings modal for default artist, genre, style, country, BPM, language, default AI instructions, model hint, and API endpoint presets.
- AI endpoint routing for Vercel, Netlify, or a custom proxy.
- New `/api/ai` Vercel function and `/.netlify/functions/ai` function for AI composition, polish, and album generation.
- Album Studio modal remains available for 1 to 12 tracks.
- Diagnostics are hidden behind a modal rather than shown as debug clutter.
- Library and memory store artists, genres, topics, countries, albums, and prompt cards locally.

## Security

Do not expose an OpenAI API key in browser code. Configure `OPENAI_API_KEY` in Vercel or Netlify environment variables and call `/api/ai` from the app.

## Deploy

Push this repo to GitHub. Vercel will deploy automatically from `main` when connected to the repo.

Recommended Vercel settings:

```text
Framework Preset: Other
Root Directory: .
Build Command: leave blank or npm test
Output Directory: .
```

## Test

```bash
npm test
```

Expected:

```text
Prompt Muse verification passed for v15.0.0.
```
