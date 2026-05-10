# Codex Continue Prompt - v13

Use this prompt in Codex when continuing the app locally:

```text
You are working on Prompt Muse v13 InputDrive for Suno.

Primary requirement:
Do not reintroduce a button-only interaction model. The app must remain usable on iPhone even if buttons fail.

Preserve:
- input-driven auto generation,
- emergency command menu,
- Spark preset menu,
- Spark slider,
- plain textareas for manual copy,
- no service-worker cache,
- guarded localStorage fallback,
- diagnose.html,
- reset-cache.html.

Improve only after tests pass:
1. Add better lyric templates.
2. Add optional AI polish endpoint integration.
3. Add library tagging.
4. Add import/export improvements.
5. Add offline caching only after button stability is confirmed.

Before shipping:
- Run node syntax checks.
- Run browser smoke tests for startup, spark, command menu, slider, save library, and diagnostic page.
- Update docs/QA_CHECKLIST_V13.md and docs/CHANGELOG_V13.md.
```
