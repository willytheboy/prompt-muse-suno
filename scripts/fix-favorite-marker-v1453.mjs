import fs from "node:fs";

const VERSION = "14.5.3";
const BUILD_LABEL = "v14.5.3 FavoriteMarkerFix";
const BUILD_SLUG = "v14.5.3-favorite-marker-fix";

function exists(file) {
  return fs.existsSync(file);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, text) {
  fs.writeFileSync(file, text, "utf8");
}

function clean(text) {
  // Common mojibake repairs, written with escapes so PowerShell cannot corrupt them.
  text = text.replace(/\u00c2\u00b7/g, " - ");
  text = text.replace(/\u00e2\u2020\u2019/g, " to ");
  text = text.replace(/\u00e2\u0153\u00a8/g, "");
  text = text.replace(/\u00e2\u02dc[\s\S]{0,5}?\s/g, "* ");
  text = text.replace(/\u00e2\u20ac\u2122/g, "'");
  text = text.replace(/\u00e2\u20ac\u0153/g, '"');
  text = text.replace(/\u00e2\u20ac\u009d/g, '"');
  text = text.replace(/\u00e2\u20ac\u201c/g, "-");
  text = text.replace(/\u00e2\u20ac\u201d/g, "-");
  text = text.replace(/\u00e2\u20ac\u00a6/g, "...");

  // Real Unicode UI symbols to ASCII-safe labels.
  text = text.replace(/\u00b7/g, " - ");
  text = text.replace(/\u2192/g, " to ");
  text = text.replace(/\u2728/g, "");
  text = text.replace(/\u2605/g, "*");
  text = text.replace(/\u2014/g, "-");
  text = text.replace(/\u2026/g, "...");

  // Version normalization.
  text = text.replace(/v14\.4\.0|v14\.5\.0|v14\.5\.1|v14\.5\.2/g, `v${VERSION}`);
  text = text.replace(
    /v14\.4 VersionLabel|v14\.5 DesktopUpdate|v14\.5\.1 VersionDisplayFix|v14\.5\.2 ASCII Display Fix/g,
    BUILD_LABEL
  );
  text = text.replace(
    /v14\.4-versionlabel|v14\.5-desktopupdate|v14\.5\.1-versiondisplayfix|v14\.5\.2-ascii-display-fix/g,
    BUILD_SLUG
  );

  text = text.replace(/GitHub\s+(?:to|->)\s+Vercel/g, "GitHub to Vercel");

  return text;
}

if (!exists("index.html")) {
  console.error("index.html not found.");
  process.exit(1);
}

let html = read("index.html");
html = clean(html);

// Hard-fix the favorite marker in renderLibrary.
// This replaces any r.favorite ? 'broken icon' : '' expression with ASCII '* '.
html = html.replace(/esc\(r\.favorite\?'[^']*'\s*:\s*''\)/g, "esc(r.favorite?'* ':'')");

// Ensure a visible version badge exists and is current.
html = html.replace(/<!-- PM_VERSION_BADGE_START -->[\s\S]*?<!-- PM_VERSION_BADGE_END -->/g, "");

const badge = `
<!-- PM_VERSION_BADGE_START -->
<div id="pm-version-badge" aria-label="Prompt Muse app version" style="position:fixed;left:12px;bottom:12px;z-index:2147483647;padding:9px 12px;border-radius:999px;background:#111827;color:#fff;font:13px/1.2 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;box-shadow:0 8px 22px rgba(0,0,0,.25);">
  Prompt Muse - Latest app version: <strong>v${VERSION}</strong>
</div>
<!-- PM_VERSION_BADGE_END -->
`;

if (/<\/body>/i.test(html)) {
  html = html.replace(/<\/body>/i, `${badge}\n</body>`);
} else {
  html += `\n${badge}\n`;
}

write("index.html", html);

// Update package metadata.
if (exists("package.json")) {
  const pkg = JSON.parse(read("package.json"));
  pkg.name = "prompt-muse-suno-v14-5-3-favorite-marker-fix";
  pkg.version = VERSION;
  write("package.json", JSON.stringify(pkg, null, 2) + "\n");
}

// Update manifest if valid JSON.
if (exists("manifest.webmanifest")) {
  try {
    const manifest = JSON.parse(clean(read("manifest.webmanifest")));
    manifest.name = "Prompt Muse v14.5.3 FavoriteMarkerFix";
    manifest.short_name = "Prompt Muse";
    write("manifest.webmanifest", JSON.stringify(manifest, null, 2) + "\n");
  } catch {
    write("manifest.webmanifest", clean(read("manifest.webmanifest")));
  }
}

// Make verifier catch this issue next time.
const verifyScript = `import { existsSync, readFileSync } from "node:fs";

const read = (file) => readFileSync(file, "utf8");

const requiredFiles = [
  "index.html",
  "manifest.webmanifest",
  "package.json",
  "vercel.json",
  "api/polish.js"
];

const missingFiles = requiredFiles.filter((file) => !existsSync(file));

if (missingFiles.length) {
  console.error("Missing required files:");
  for (const file of missingFiles) console.error(\`- \${file}\`);
  process.exit(1);
}

const index = read("index.html");
const manifest = read("manifest.webmanifest");
const pkg = JSON.parse(read("package.json"));
const version = pkg.version || "unknown";
const expectedVersion = \`v\${version}\`;

const forbidden = [
  { label: "mojibake C2", pattern: /\\u00c2/ },
  { label: "mojibake E2", pattern: /\\u00e2/ },
  { label: "stale v14.4", pattern: /v14\\.4/ },
  { label: "unicode arrow", pattern: /\\u2192/ },
  { label: "unicode middle dot", pattern: /\\u00b7/ },
  { label: "unicode sparkle", pattern: /\\u2728/ },
  { label: "unicode star", pattern: /\\u2605/ },
  { label: "unicode em dash", pattern: /\\u2014/ },
  { label: "unicode ellipsis", pattern: /\\u2026/ }
];

const checks = [
  {
    label: "current package version appears in index.html",
    ok: index.includes(expectedVersion) || index.includes(version)
  },
  {
    label: "latest app version text",
    ok: /latest\\s+app\\s+version/i.test(index)
  },
  {
    label: "version badge marker",
    ok: index.includes("PM_VERSION_BADGE_START")
  },
  {
    label: "Prompt Muse app identity",
    ok: /Prompt Muse/i.test(index)
  },
  {
    label: "Suno title/style/prompt/negative fields",
    ok:
      /title/i.test(index) &&
      /style/i.test(index) &&
      /prompt/i.test(index) &&
      /negative|exclude/i.test(index)
  },
  {
    label: "lyrics generation language",
    ok: /lyrics/i.test(index)
  },
  {
    label: "GitHub and Vercel text",
    ok: /GitHub/i.test(index) && /Vercel/i.test(index)
  },
  {
    label: "manifest names Prompt Muse",
    ok: /Prompt Muse/i.test(manifest)
  },
  ...forbidden.map((item) => ({
    label: \`forbidden display token: \${item.label}\`,
    ok: !item.pattern.test(index)
  }))
];

const failed = checks.filter((check) => !check.ok);

if (failed.length) {
  for (const check of failed) {
    console.error(\`Missing check token: \${check.label}\`);
  }
  process.exit(1);
}

console.log(\`Prompt Muse verification passed for \${expectedVersion}.\`);
`;

write("scripts/verify.mjs", verifyScript);

// Changelog.
if (exists("CHANGELOG.md")) {
  let changelog = read("CHANGELOG.md");
  if (!/## v14\.5\.3/.test(changelog)) {
    changelog += `

## v14.5.3
- Fixed remaining mojibake favorite marker in the library renderer.
- Replaced favorite display icon with ASCII-safe marker.
- Added verifier checks for mojibake and stale v14.4 text.
`;
    write("CHANGELOG.md", changelog);
  }
}

console.log("Favorite marker repair complete for v14.5.3.");
