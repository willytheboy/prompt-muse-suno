# Prompt Muse v3 for Suno

Prompt Muse v3 is an iPhone-first static PWA for generating Suno-ready prompt fields from artist inspirations while keeping artist names out of the Suno-facing output.

## What v3 adds

- Four-field Suno copy dock:
  - Title
  - Prompt / Lyrics
  - Style
  - Negative Prompt
- Individual copy buttons for each field.
- One-tap copy of all Suno fields.
- Searchable local prompt library.
- Library filters for:
  - Genre
  - Style
  - Inspired by
  - Country / market
  - BPM min/max
  - Favorites
  - Free-text search
- Load, duplicate, favorite, delete, export, and import saved prompts.
- Local-only storage using `localStorage`; no backend is required.
- Offline support after first load through the service worker.

## Deploy to Netlify

1. Unzip the app package.
2. Make sure `index.html` is directly inside the folder you deploy.
3. Drag the unzipped folder into Netlify Drop or a Netlify manual deploy area.
4. Open the live URL on iPhone Safari.
5. Tap Share → Add to Home Screen.

## Deploy to Vercel CLI

```bash
cd suno-iphone-prompt-studio-v3
npm i -g vercel
vercel --prod
```

Use these settings if prompted:

- Framework preset: Other
- Build command: leave blank
- Output directory: `.`

## Local testing

```bash
cd suno-iphone-prompt-studio-v3
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Safety model

The app keeps artist names as private inspiration metadata for search and recall. The generated Suno fields translate those names into musical traits such as vocal texture, groove, instrumentation, production character, arrangement shape, and mood. This reduces direct imitation requests and keeps prompts easier to use commercially.

## Storage note

The prompt library is saved locally in the browser under:

```text
promptMuseSunoLibrary.v3
```

Use the Export Library JSON button before clearing browser storage, changing devices, or redeploying under a different domain.
