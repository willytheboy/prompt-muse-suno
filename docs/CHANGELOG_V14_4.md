# Prompt Muse v14.4 — VersionLabel

## Purpose

Add an obvious in-app label showing the latest app version number. This makes it easier to confirm which GitHub/Vercel deployment is currently loaded on iPhone or desktop.

## Visible labels added

```text
Latest app version: v14.4.0
Build: v14.4-versionlabel · LyricsFirst · ManifestAuthFix
```

The version appears in two places:

1. Hero/header area at the top of the app.
2. Device diagnostics panel as a stat tile.

## Files changed

- `index.html`
- `manifest.webmanifest`
- `package.json`
- `README.md`
- `CHANGELOG.md`
- `scripts/verify.mjs`

## Notes

No behavior change was made to lyric generation, library storage, GitHub/Vercel workflow, or API functions.
