# Smoke Test Report — Prompt Muse v13

Environment used by builder:

- Headless Chromium through Playwright
- Mobile viewport: 390 × 844
- Touch emulation enabled

## Tested app page

Passed:

- JavaScript startup status appeared.
- Tap Test incremented tap count.
- Spark button changed the generated title/output.
- Emergency command menu saved to library.
- Local polish variants rendered.
- Emergency command menu sparked a prompt.
- Native Spark preset menu loaded `The Loft After Midnight`.
- No red error box appeared.

## Tested diagnostic page

Passed:

- JavaScript startup appeared.
- Button test worked.
- Link test worked.
- Input button test worked.
- Select test worked.
- Range test worked.
- Text input test worked.

## Caveat

These tests confirm the HTML/JavaScript logic in Chromium with touch emulation. They do not prove the old iPhone deployment is loading the new file. For iPhone verification, deploy v13 to a new URL and check the heartbeat first.
