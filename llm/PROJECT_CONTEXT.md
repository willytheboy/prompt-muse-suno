# Prompt Muse project context

Prompt Muse is an iPhone-first app for creating Suno prompt bundles. It generates and saves four fields: Title, Style, Prompt/Lyrics, and Negative/Exclude. It stores artist inspirations only as private metadata and converts them into descriptive traits in Suno-facing fields.

Current version: v14.4 VersionLabel + LyricsFirst + ManifestAuthFix.

The current architecture is intentionally static and conservative because previous builds had iPhone tap/caching problems. The app avoids service workers and keeps controls native wherever possible.
