# Changelog — v13 InputDrive

## Reason for rebuild

Earlier versions were structurally dependent on click/touch button handlers. The user reported that tests failed and most controls were not clickable on iPhone.

## Main changes

- Rebuilt the app around automatic generation rather than button-only actions.
- Added heartbeat diagnostics so JavaScript startup is visible without tapping anything.
- Added native emergency command menu.
- Added Spark preset menu.
- Added Spark slider.
- Preserved buttons as secondary controls only.
- Added manual-copy guidance and selectable plain textareas.
- Removed service-worker caching entirely.
- Removed sticky overlays and fixed-position docks.
- Avoided external JavaScript and frameworks.
- Guarded localStorage with in-memory fallback.
- Added minimal `diagnose.html` with independent control tests.
- Added `reset-cache.html`.

## Features preserved

- Spark idea generation.
- Full lyric generation.
- Title, Style, Prompt/Lyrics, Negative copy dock.
- Suno character limit profiles.
- Local prompt library.
- Search by keyword, genre, style, inspired by, country/place, BPM, favorites.
- Library save/load/copy/duplicate/favorite/delete.
- Export/import library JSON.
- Local polish variants.
- Optional serverless polish endpoints.
