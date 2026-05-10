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

try {
  const vercelConfig = JSON.parse(readFileSync('vercel.json', 'utf8'));
  if (vercelConfig.functions) {
    console.error('vercel.json must not define functions in v14.4; Vercel should auto-detect /api functions.');
    failures++;
  }
} catch (error) {
  console.error('Could not parse vercel.json:', error.message);
  failures++;
}

const requiredTokens = [
  ['v14.4 build label', 'v14.4 VersionLabel'],
  ['latest version label', 'Latest app version: <strong>v14.4.0</strong>'],
  ['app version diagnostics', 'id="appVersionLabel"'],
  ['LLM Upgrade Console', 'GitHub → Vercel LLM upgrade console'],
  ['four field title output', 'outTitle'],
  ['four field style output', 'outStyle'],
  ['four field prompt output', 'outPrompt'],
  ['four field negative output', 'outNegative'],
  ['lyrics-first option', 'Full generated lyrics'],
  ['inline spark fallback', 'sparkClick'],
  ['PM14 global helper', 'window.PM14'],
  ['authenticated manifest link', 'crossorigin="use-credentials"']
];
for (const [name, token] of requiredTokens) {
  if (!index.includes(token)) {
    console.error(`Missing check token: ${name}`);
    failures++;
  }
}

if (index.includes('serviceWorker.register')) {
  console.error('Service worker registration is not allowed in v14.4.');
  failures++;
}
if (index.includes('<option value="scaffold">Structure scaffold only</option>')) {
  console.error('Visible scaffold option should not exist in v14.4.');
  failures++;
}

const scriptMatch = index.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error('No inline app script found.');
  failures++;
} else {
  try {
    new Function(scriptMatch[1]);
  } catch (error) {
    console.error('Inline app script syntax failed:', error.message);
    failures++;
  }
}

if (failures) process.exit(1);
console.log('Prompt Muse verification passed.');
