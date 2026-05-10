import { existsSync, readFileSync } from "node:fs";

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
  for (const file of missingFiles) console.error(`- ${file}`);
  process.exit(1);
}

const index = read("index.html");
const manifest = read("manifest.webmanifest");
const pkg = JSON.parse(read("package.json"));
const version = pkg.version || "unknown";
const expectedVersion = `v${version}`;

const checks = [
  {
    label: "current package version appears in index.html",
    ok: index.includes(expectedVersion) || index.includes(version)
  },
  {
    label: "latest version label",
    ok: /latest\s+app\s+version/i.test(index)
  },
  {
    label: "GitHub to Vercel / LLM upgrade interface",
    ok: /github\s*(→|->|to)\s*vercel|llm\s+upgrade|upgrade\s+console/i.test(index)
  },
  {
    label: "Suno title/style/prompt/negative fields",
    ok:
      /title/i.test(index) &&
      /style/i.test(index) &&
      /prompt\s*\/\s*lyrics|prompt/i.test(index) &&
      /negative|exclude/i.test(index)
  },
  {
    label: "lyrics generation language",
    ok: /lyrics/i.test(index)
  },
  {
    label: "manifest names Prompt Muse",
    ok: /Prompt Muse/i.test(manifest)
  }
];

const failed = checks.filter((check) => !check.ok);

if (failed.length) {
  for (const check of failed) {
    console.error(`Missing check token: ${check.label}`);
  }
  process.exit(1);
}

console.log(`Prompt Muse verification passed for ${expectedVersion}.`);
