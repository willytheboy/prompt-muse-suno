# Prompt Muse v2 for Suno

Prompt Muse v2 is an iPhone-first PWA for building artist-inspired but original Suno prompt bundles. It works offline after first load, stores prompt history locally, and keeps artist names out of the final Suno-ready style prompts.

## v2 upgrades

- Three Suno prompt variants: **Safe Commercial**, **Creative Experimental**, and **Venue Ready**.
- Per-artist inspiration rows with aspect selection and influence strength.
- Expanded trait mapping for vocal texture, groove, production, instrumentation, arrangement, lyric attitude, and performance energy.
- Optional **AI Expansion Brief** you can paste into ChatGPT/Codex to further refine the prompt while preserving artist-safe guardrails.
- QA / release log with originality score, venue-fit score, Suno clarity score, stem/DAW plan, and human edit notes.
- Built-in Sporting Club / Mediterranean lounge presets plus additional venue and reel presets.
- Local prompt history, copy buttons, and Markdown export.

## iPhone install

1. Deploy this folder to a static host such as Vercel, Netlify, GitHub Pages, Cloudflare Pages, or your own server.
2. Open the deployed URL in Safari on iPhone.
3. Tap **Share → Add to Home Screen**.
4. Launch from the Home Screen.

The app uses only local browser storage. It does not upload prompts, artists, or history.

## Local preview

From inside this folder:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Files

```text
index.html              Main PWA shell
styles.css              iPhone-first styling
app.js                  Prompt engine and local history
manifest.webmanifest    PWA manifest
sw.js                   Offline cache service worker
icons/                  App icons
```

## Suggested deployment prompt for Codex

```text
You are inside the Prompt Muse v2 folder.

Goal: deploy this static PWA and verify it works on iPhone Safari.

Tasks:
1. Inspect index.html, styles.css, app.js, manifest.webmanifest, and sw.js.
2. Confirm all DOM IDs used by app.js exist in index.html.
3. Run a local static server.
4. Check that the app loads, tabs switch, prompts generate, copy buttons work, and Markdown export works.
5. Deploy to my preferred static host.
6. Do not upload private prompt history or personal data.

After deployment, give me the live URL and iPhone install steps.
```

## Safe use note

Artist names are treated as private creative references. The generated Suno style prompts convert them into descriptive traits and guardrails rather than asking Suno to imitate, clone, or name a real artist.
