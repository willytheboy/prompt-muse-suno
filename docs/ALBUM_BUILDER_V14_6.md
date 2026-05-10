# Prompt Muse v14.6 AlbumBuilder

## Purpose

Adds a modal workflow for creating a complete album from the current composition. Album size can be 1 to 12 tracks. Each track receives Suno-ready fields: Title, Style, Prompt / Lyrics, and Negative / Exclude.

## Album modes

- Build a consistent album
- Top hits album
- History of the artist/band
- Best of album
- Concept album
- Venue / hospitality collection
- Debut EP / album
- Live session collection
- Remix / alternate versions pack

## Memory

The app stores album memory locally in `promptMuseAlbumLibraryV146` and `promptMuseAlbumMemoryV146`. It remembers artists, genres, style palettes, album titles, and lyric topics.

## Safety

Artist names remain metadata for search and recall. Suno-facing prompts continue to use original composition language and include the negative prompt: no direct artist names, no impersonation, no copied melody, no copyrighted hooks.

## Deployment

Use the normal GitHub to Vercel workflow. Commit and push to `main`; Vercel redeploys automatically.
