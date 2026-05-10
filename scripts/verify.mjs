import { readFileSync, existsSync } from 'node:fs';

const required = [
  'index.html',
  'diagnose.html',
  'reset-cache.html',
  'manifest.webmanifest',
  'vercel.json',
  'api/polish.js',
  'api/health.js',
  'AGENTS.md',
  'llm/UPGRADE_PROMPT.md',
  'llm/ALBUM_BUILDER_UPGRADE_PROMPT.md',
  'docs/ALBUM_BUILDER_V14_6.md',
  '.github/workflows/quality.yml'
];

let failures = 0;
for (const file of required) {
  if (!existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    failures++;
  }
}

const index = readFileSync('index.html', 'utf8');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const manifest = readFileSync('manifest.webmanifest', 'utf8');
const expected = `v${pkg.version}`;

try {
  const vercelConfig = JSON.parse(readFileSync('vercel.json', 'utf8'));
  if (vercelConfig.functions) {
    console.error('vercel.json must not define functions; Vercel should auto-detect /api functions.');
    failures++;
  }
} catch (error) {
  console.error('Could not parse vercel.json:', error.message);
  failures++;
}

const requiredTokens = [
  ['current version label', expected],
  ['AlbumBuilder label', 'AlbumBuilder'],
  ['latest version label', 'Latest app version'],
  ['album builder card', 'Full album builder'],
  ['album modal', 'albumBuilderModal'],
  ['album type dropdown', 'albumType'],
  ['album track count', 'albumTrackCount'],
  ['album memory key', 'promptMuseAlbumMemoryV146'],
  ['four field title output', 'outTitle'],
  ['four field style output', 'outStyle'],
  ['four field prompt output', 'outPrompt'],
  ['four field negative output', 'outNegative'],
  ['lyrics-first option', 'Full generated lyrics'],
  ['inline spark fallback', 'sparkClick'],
  ['PM14 global helper', 'window.PM14'],
  ['PMAlbum global helper', 'window.PMAlbum'],
  ['authenticated manifest link', 'crossorigin="use-credentials"'],
  ['manifest Prompt Muse', 'Prompt Muse']
];
for (const [name, token] of requiredTokens) {
  const haystack = name === 'manifest Prompt Muse' ? manifest : index;
  if (!haystack.includes(token)) {
    console.error(`Missing check token: ${name}`);
    failures++;
  }
}

const forbidden = [
  ['stale v14.4', /v14\.4/],
  ['stale v14.5', /v14\.5/],
  ['mojibake C2', /\u00c2/],
  ['mojibake E2', /\u00e2/],
  ['unicode arrow', /\u2192/],
  ['unicode middle dot', /\u00b7/],
  ['unicode sparkle', /\u2728/],
  ['unicode star', /\u2605/],
  ['unicode em dash', /\u2014/],
  ['unicode ellipsis', /\u2026/],
  ['service worker registration', /serviceWorker\.register/],
  ['visible scaffold option', /Structure scaffold only/]
];
for (const [name, pattern] of forbidden) {
  if (pattern.test(index)) {
    console.error(`Forbidden token present: ${name}`);
    failures++;
  }
}

const scripts = [...index.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
if (!scripts.length) {
  console.error('No inline app scripts found.');
  failures++;
} else {
  scripts.forEach((script, i) => {
    try {
      new Function(script);
    } catch (error) {
      console.error(`Inline app script ${i + 1} syntax failed:`, error.message);
      failures++;
    }
  });
}

if (failures) process.exit(1);
console.log(`Prompt Muse verification passed for ${expected}.`);
