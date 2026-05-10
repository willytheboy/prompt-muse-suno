# LLM Upgrade Prompt - Album Builder

You are upgrading Prompt Muse for Suno. Preserve v14.6 AlbumBuilder behavior.

Requirements:
- Keep the four Suno fields: Title, Style, Prompt / Lyrics, Negative / Exclude.
- Album Builder must generate 1 to 12 tracks.
- Album modes must include consistent album, top hits, history of, best of, concept, venue, debut, live session, and remix pack.
- Prompt / Lyrics must contain actual sectioned lyrics, not writing instructions.
- Style must contain musical instructions.
- Save album memory locally: artists, genres, album genres, album titles, lyric topics.
- Keep artist names out of Suno-facing prompts unless they are the user's own performing artist metadata.
- No service worker cache.
- Run npm test.
