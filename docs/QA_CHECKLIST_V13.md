# QA Checklist - Prompt Muse v13

## Startup

- [ ] Header says `v13 InputDrive`.
- [ ] Status says `JavaScript ready. InputDrive active.`
- [ ] Heartbeat increases every second.
- [ ] No red error box appears.

## Button-independent controls

- [ ] Emergency command menu  to  Spark random idea changes title/output.
- [ ] Spark preset menu changes title/output.
- [ ] Spark slider changes title/output.
- [ ] Typing into title/core idea/hook auto-updates output.
- [ ] Changing genre/style/country auto-updates output.

## Buttons

- [ ] Tap test increases tap count.
- [ ] Spark idea button generates.
- [ ] Spark link generates.
- [ ] Input button generates.
- [ ] Generate fields button generates.
- [ ] Write lyrics now generates full lyrics.
- [ ] Spark lyric images changes lyric images and regenerates.

## Copy dock

- [ ] Title field has output.
- [ ] Style field has output.
- [ ] Prompt/Lyrics field has sectioned lyrics.
- [ ] Negative field has output.
- [ ] Tapping inside a textarea selects the text.
- [ ] Copy buttons work, or manual copy works.

## Library

- [ ] Save to library increments library count.
- [ ] Library picker can load a saved prompt.
- [ ] Keyword filter works.
- [ ] Genre/style/country filters work.
- [ ] Inspired-by filter works.
- [ ] BPM min/max filters work.
- [ ] Favorite/duplicate/delete controls work.
- [ ] Export library JSON downloads.
- [ ] Import library JSON restores items.

## Diagnostics

Open `/diagnose.html`.

- [ ] Heartbeat increases.
- [ ] Button test increments count.
- [ ] Link test increments count.
- [ ] Input button test increments count.
- [ ] Select test increments count.
- [ ] Range test increments count.
- [ ] Text input test increments count.

## Failure interpretation

If heartbeat does not increase, JavaScript is not running or the wrong build is loaded.

If heartbeat increases but buttons fail, use the command menu, preset menu, slider, and textareas.

If diagnose.html fails too, the issue is outside the app code: stale deployment, wrong URL, blocked JavaScript, browser wrapper, or old PWA cache.
