# Project Brief - Prompt Muse v13 InputDrive for Suno

## Product goal

Build an iPhone-first app for creating, polishing, saving, searching, and recalling Suno-ready prompts and lyrics based on existing artist inspirations, without placing direct artist names into Suno-facing prompts.

## User need

The user wants to create Suno prompts from iPhone quickly and reliably, then copy separate Suno fields:

- Title
- Style
- Prompt / Lyrics
- Negative / Exclude

The app must also save generated prompt bundles into a searchable library by:

- Genre
- Style
- Inspired by
- Country/place
- BPM
- Keyword
- Favorites

## v13 design correction

Because earlier iPhone tests failed around clickability, v13 does not depend on buttons as the primary interaction system. It uses:

- automatic generation when fields change,
- native command menu,
- native preset menu,
- native range slider,
- plain textareas for manual copy,
- guarded local storage,
- no service worker,
- no external JavaScript.

## Artist inspiration policy

Artist names are stored as private metadata for library recall and search. Suno-facing prompts are converted to descriptive musical traits, such as:

- silky late-night restraint,
- Levantine poetic restraint,
- urban Beirut jazz harmony,
- warm analog polish,
- expressive Mediterranean brass color.

The app avoids prompts like “make a song like [artist]”.

## Suno prompt model

The app separates:

1. Title
2. Style prompt
3. Lyrics / structure prompt
4. Negative / exclude prompt

This supports Suno Custom Mode style workflows and helps keep lyrics free of production instructions.

## Reliability principle

A Suno prompt app must be useful even when some browser interaction APIs fail. Therefore v13 keeps generated outputs visible and manually copyable at all times.
