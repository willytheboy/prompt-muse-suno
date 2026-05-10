import fs from "node:fs";
import path from "node:path";

const VERSION = "14.5.2";
const BUILD_LABEL = "v14.5.2 ASCII Display Fix";
const BUILD_SLUG = "v14.5.2-ascii-display-fix";

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

function walk(dir, out = []) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return out;

  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === ".vercel") continue;

    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel, out);
    else out.push(rel);
  }

  return out;
}

function cleanText(text) {
  const replacements = [
    // Mojibake replacements written with Unicode escapes so PowerShell cannot corrupt them.
    [/\u00C2\u00B7/g, " - "],          // broken middle dot
    [/\u00E2\u2020\u2019/g, " to "],   // broken arrow
    [/\u00E2\u0153\u00A8/g, ""],       // broken sparkle
    [/\u00E2\u0153\u201D/g, "OK"],     // broken check
    [/\u00E2\u0153\u201C/g, "OK"],     // broken check
    [/\u00E2\u20AC\u2122/g, "'"],      // broken apostrophe
    [/\u00E2\u20AC\u0153/g, '"'],      // broken opening quote
    [/\u00E2\u20AC\u009D/g, '"'],      // broken closing quote
    [/\u00E2\u20AC\u201C/g, "-"],      // broken en dash
    [/\u00E2\u20AC\u201D/g, "-"],      // broken em dash
    [/\u00E2\u20AC\u00A6/g, "..."],    // broken ellipsis

    // Real Unicode symbols replaced with ASCII-safe text.
    [/\u00B7/g, " - "],
    [/\u2192/g, " to "],
    [/\u2728/g, ""],
    [/\u2605/g, "*"],
    [/\u2013/g, "-"],
    [/\u2014/g, "-"],
    [/\u2026/g, "..."],

    // Accent simplification for app labels/docs.
    [/\u00C9/g, "E"],
    [/\u00E9/g, "e"],
    [/\u00E1/g, "a"],
    [/\u00FC/g, "u"]
  ];

  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }

  text = text.replace(/v14\.4\.0|v14\.5\.0|v14\.5\.1/g, `v${VERSION}`);
  text = text.replace(/v14\.4 VersionLabel|v14\.5 DesktopUpdate|v14\.5\.1 VersionDisplayFix/g, BUILD_LABEL);
  text = text.replace(/v14\.4-versionlabel|v14\.5-desktopupdate|v14\.5\.1-versiondisplayfix/g, BUILD_SLUG);
  text = text.replace(/GitHub\s+(?:to|->)\s+Vercel/g, "GitHub to Vercel");

  return text;
}

const targetFiles = [
  "index.html",
  "diagnose.html",
  "reset-cache.html",
  "manifest.webmanifest",
  "README.md",
  "CHANGELOG.md",
  ...walk("docs").filter((file) => file.endsWith(".md")),
  ...walk("llm").filter((file) => file.endsWith(".md"))
].filter((file) => exists(file));

for (const file of targetFiles) {
  let text = read(file);
  text = cleanText(text);

  if (file.endsWith(".html")) {
    if (!/<meta\s+charset=/i.test(text)) {
      text = text.replace(/<head([^>]*)>/i, `<head$1>\n<meta charset="utf-8">`);
    } else {
      text = text.replace(/<meta\s+charset=["']?[^"'>\s]+["']?\s*\/?>/i, '<meta charset="utf-8">');
    }
  }

  if (file === "index.html") {
    text = text.replace(/<!-- PM_VERSION_BADGE_START -->[\s\S]*?<!-- PM_VERSION_BADGE_END -->/g, "");

    const badge = `
<!-- PM_VERSION_BADGE_START -->
<div id="pm-version-badge" aria-label="Prompt Muse app version" style="position:fixed;left:12px;bottom:12px;z-index:2147483647;padding:9px 12px;border-radius:999px;background:#111827;color:#fff;font:13px/1.2 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;box-shadow:0 8px 22px rgba(0,0,0,.25);">
  Prompt Muse - Latest app version: <strong>v${VERSION}</strong>
</div>
<!-- PM_VERSION_BADGE_END -->
`;

    if (/<\/body>/i.test(text)) {
      text = text.replace(/<\/body>/i, `${badge}\n</body>`);
    } else {
      text += `\n${badge}\n`;
    }
  }

  write(file, text);
}

if (exists("package.json")) {
  const pkg = JSON.parse(read("package.json"));
  pkg.name = "prompt-muse-suno-v14-5-2-ascii-display-fix";
  pkg.version = VERSION;
  write("package.json", JSON.stringify(pkg, null, 2) + "\n");
}

if (exists("manifest.webmanifest")) {
  try {
    const manifest = JSON.parse(read("manifest.webmanifest"));
    manifest.name = "Prompt Muse v14.5.2 ASCII Display Fix";
    manifest.short_name = "Prompt Muse";
    write("manifest.webmanifest", JSON.stringify(manifest, null, 2) + "\n");
  } catch {
    // Leave text-cleaned manifest as-is if it is not valid JSON.
  }
}

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
    label: "GitHub to Vercel text",
    ok: /GitHub/i.test(index) && /Vercel/i.test(index)
  },
  {
    label: "manifest names Prompt Muse",
    ok: /Prompt Muse/i.test(manifest)
  }
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

if (exists("CHANGELOG.md")) {
  let changelog = read("CHANGELOG.md");
  if (!/## v14\.5\.2/.test(changelog)) {
    changelog += `

## v14.5.2
- Fixed mojibake display issue by replacing fragile UI symbols with ASCII-safe labels.
- Restored visible latest app version badge.
- Replaced stale v14.4 diagnostic version text.
- Updated verification script for current package version.
`;
    write("CHANGELOG.md", changelog);
  }
}

console.log("Display repair complete for v14.5.2.");
