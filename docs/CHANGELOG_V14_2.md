# Prompt Muse v14.2 LyricsFirst

## Purpose

v14.2 makes the app lyrics-first for Suno Custom Mode. Spark and Generate now default to real sectioned lyrics in the Prompt / Lyrics field rather than scaffold instructions.

## Changes

- Removed the visible “Structure scaffold only” option from the main lyric mode selector.
- Spark Idea forces `lyricMode=full` before generation.
- Generate Fields converts any stale `scaffold` value to `full`.
- Added inline fallback handlers on the key controls: Tap Test, Spark, Spark Link, Spark Input, Generate, and Write Full Lyrics Now.
- Style field now explicitly carries production/style instructions.
- Prompt / Lyrics field now carries lyrics or instrumental section content only.

## How to use

1. Keep **Prompt / Lyrics output** set to **Full generated lyrics**.
2. Use **Spark idea + lyrics**, **Generate full lyrics**, or **Emergency command menu → Write full lyrics**.
3. Copy **Title**, **Style**, **Prompt / Lyrics**, and **Negative / Exclude** separately into Suno.
