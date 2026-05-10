import fs from "node:fs";
import path from "node:path";

const VERSION = "14.5.3";
const BUILD_LABEL = "v14.5.3 FavoriteMarkerFix";
const BUILD_SLUG = "v14.5.3-favorite-marker-fix";
const PACKAGE_NAME = "prompt-muse-suno-v14-5-3-favorite-marker-fix";

const root = process.cwd();

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function write(file, text) {
  fs.writeFileSync(path.join(root, file), text, "utf8");
}

function walk(dir, output = []) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return output;

  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === ".vercel") continue;

    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel, output);
    else output.push(rel);
  }

  return output;
}

function cleanText(text) {
  // Fix remaining mojibake and fragile symbols.
  text = text.replace(/\u00c2\u00b7/g, " - ");
  text = text.replace(/\u00e2\u2020\u2019/g, " to ");
  text = text.replace(/\u00e2\u0153\u00a8/g, "");
  text = text.replace(/\u00e2\u02dc[\s\S]{0,6}?\s/g, "* ");
  text = text.replace(/\u00e2\u20ac\u2122/g, "'");
  text = text.replace(/\u00e2\u20ac\u0153/g, '"');
  text = text.replace(/\u00e2\u20ac\u009d/g, '"');
  text = text.replace(/\u00e2\u20ac\u201c/g, "-");
  text = text.replace(/\u00e2\u20ac\u201d/g, "-");
  text = text.replace(/\u00e2\u20ac\u00a6/g, "...");

  text = text.replace(/\u00b7/g, " - ");
  text = text.replace(/\u2192/g, " to ");
  text = text.replace(/\u2728/g, "");
  text = text.replace(/\u2605/g, "*");
  text = text.replace(/\u2014/g, "-");
  text = text.replace(/\u2026/g, "...");

  // Normalize visible build labels.
  text = text.replace(/v14\.5\.3 VersionDisplayFix/g, BUILD_LABEL);
  text = text.replace(/v14\.5\.3-versiondisplayfix/g, BUILD_SLUG);
  text = text.replace(/v14\.5\.2 ASCII Display Fix/g, BUILD_LABEL);
  text = text.replace(/v14\.5\.2-ascii-display-fix/g, BUILD_SLUG);

  // Normalize older version strings.
  text = text.replace(/v14\.4\.0|v14\.5\.0|v14\.5\.1|v14\.5\.2/g, `v${VERSION}`);

  // Normalize wording.
  text = text.replace(/GitHub\s+(?:to|->)\s+Vercel/g, "GitHub to Vercel");

  return text;
}

const files = [
  "index.html",
  "diagnose.html",
  "reset-cache.html",
  "manifest.webmanifest",
  "README.md",
  "CHANGELOG.md",
  ...walk("docs").filter((file) => file.endsWith(".md")),
  ...walk("llm").filter((file) => file.endsWith(".md"))
].filter(exists);

for (const file of files) {
  let text = cleanText(read(file));

  if (file === "index.html") {
    // Hard-fix any broken favorite icon expression.
    text = text.replace(
      /esc\(r\.favorite\?'(?:\\'|[^'])*'\s*:\s*''\)/g,
      "esc(r.favorite?'* ':'')"
    );

    // Keep one current version badge.
    text = text.replace(/<!-- PM_VERSION_BADGE_START -->[\s\S]*?<!-- PM_VERSION_BADGE_END -->/g, "");

    const badge = `
<!-- PM_VERSION_BADGE_START -->
<div id="pm-version-badge" aria-label="Prompt Muse app version" style="position:fixed;left:12px;bottom:12px;z-index:2147483647;padding:9px 12px;border-radius:999px;background:#111827;color:#fff;font:13px/1.2 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;box-shadow:0 8px 22px rgba(0,0,0,.25);">
  Prompt Muse - Latest app version: <strong>v${VERSION}</strong>
</div>
<!-- PM_VERSION_BADGE_END -->
`;

    text = /<\/body>/i.test(text)
      ? text.replace(/<\/body>/i, `${badge}\n</body>`)
      : `${text}\n${badge}\n`;
  }

  write(file, text);
}

if (exists("package.json")) {
  const pkg = JSON.parse(read("package.json"));
  pkg.name = PACKAGE_NAME;
  pkg.version = VERSION;
  write("package.json", JSON.stringify(pkg, null, 2) + "\n");
}

if (exists("manifest.webmanifest")) {
  try {
    const manifest = JSON.parse(read("manifest.webmanifest"));
    manifest.name = "Prompt Muse v14.5.3 FavoriteMarkerFix";
    manifest.short_name = "Prompt Muse";
    write("manifest.webmanifest", JSON.stringify(manifest, null, 2) + "\n");
  } catch {
    write("manifest.webmanifest", cleanText(read("manifest.webmanifest")));
  }
}

if (exists("CHANGELOG.md")) {
  let changelog = read("CHANGELOG.md");
  if (!/## v14\.5\.3 FavoriteMarkerFix/.test(changelog)) {
    changelog += `

## v14.5.3 FavoriteMarkerFix
- Normalized app labels from VersionDisplayFix to FavoriteMarkerFix.
- Replaced remaining corrupted favorite marker with ASCII-safe marker.
- Confirmed visible app version badge uses v14.5.3.
`;
    write("CHANGELOG.md", changelog);
  }
}

console.log("v14.5.3 label normalization complete.");
