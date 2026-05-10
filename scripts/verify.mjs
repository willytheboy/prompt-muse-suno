import { existsSync, readFileSync } from "node:fs";
const read = (file) => readFileSync(file, "utf8");
const required = ["index.html","manifest.webmanifest","package.json","vercel.json","api/polish.js","api/health.js","api/ai.js","netlify/functions/ai.js"];
const missing = required.filter((file) => !existsSync(file));
if (missing.length) { console.error("Missing required files:"); for (const file of missing) console.error(`- ${file}`); process.exit(1); }
const index = read("index.html");
const manifest = read("manifest.webmanifest");
const pkg = JSON.parse(read("package.json"));
const expectedVersion = `v${pkg.version}`;
const forbidden = [
  { label: "mojibake C2", pattern: /\u00c2/ },
  { label: "mojibake E2", pattern: /\u00e2/ },
  { label: "stale v14.4", pattern: /v14\.4/ },
  { label: "stale v14.5", pattern: /v14\.5/ },
  { label: "stale v14.6", pattern: /v14\.6/ },
  { label: "unicode arrow", pattern: /\u2192/ },
  { label: "unicode middle dot", pattern: /\u00b7/ },
  { label: "unicode sparkle", pattern: /\u2728/ },
  { label: "unicode star", pattern: /\u2605/ },
  { label: "unicode em dash", pattern: /\u2014/ },
  { label: "unicode ellipsis", pattern: /\u2026/ }
];
const checks = [
  { label: "current package version appears in index.html", ok: index.includes(expectedVersion) || index.includes(pkg.version) },
  { label: "AI Studio label", ok: /AI Studio/i.test(index) },
  { label: "Settings modal", ok: /Settings and AI defaults/i.test(index) },
  { label: "API endpoint setting", ok: /AI endpoint URL/i.test(index) },
  { label: "default instructions setting", ok: /Default AI instructions/i.test(index) },
  { label: "Album Studio", ok: /Album Studio/i.test(index) && /Track count/i.test(index) },
  { label: "Suno copy dock", ok: /Suno copy dock/i.test(index) && /Prompt \/ Lyrics/i.test(index) },
  { label: "lyrics generation", ok: /actual sectioned lyrics|Generate full lyrics/i.test(index) },
  { label: "LyricsGuard", ok: /LyricsGuard|Regenerate full lyrics|regenerateLyrics/i.test(index) },
  { label: "GitHub and Vercel text", ok: /GitHub/i.test(index) && /Vercel/i.test(index) },
  { label: "manifest names Prompt Muse", ok: /Prompt Muse/i.test(manifest) },
  ...forbidden.map((item) => ({ label: `forbidden display token: ${item.label}`, ok: !item.pattern.test(index) }))
];
const failed = checks.filter((check) => !check.ok);
if (failed.length) { for (const check of failed) console.error(`Missing check token: ${check.label}`); process.exit(1); }
console.log(`Prompt Muse verification passed for ${expectedVersion}.`);
