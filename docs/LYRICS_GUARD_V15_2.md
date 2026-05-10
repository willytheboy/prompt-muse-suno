# Prompt Muse v15.2 LyricsGuard

This release repairs the full-lyrics regeneration path.

## Fixes

- Adds a dedicated Regenerate full lyrics action.
- Adds LyricsGuard validation to detect instruction-like output.
- If AI or local generation returns a scaffold/instruction, the app replaces it with full sectioned lyrics.
- Adds a visible LyricsGuard status below the Prompt / Lyrics field.
- Updates API prompts to require finished lyrics with section tags.

## Test

Use Generate full lyrics or Regenerate full lyrics. The Prompt / Lyrics field should include `[Intro]`, `[Verse 1]`, `[Chorus]`, `[Verse 2]`, `[Bridge]`, and `[Outro]`.
