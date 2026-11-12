// Builds a self-contained deployment folder in .next/standalone (run with `node server.js`).
// Cross-platform replacement for `BUILD_STANDALONE=1 next build` + the manual copy steps.
//   npm run build:standalone
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, ".next", "standalone");

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, BUILD_STANDALONE: "1" },
});
if (result.status !== 0) process.exit(result.status ?? 1);

// Next does not copy static assets into the standalone folder; the server expects them there.
const copy = (from, to) => fs.cpSync(path.join(root, from), path.join(out, to), { recursive: true });
copy("public", "public");
copy(".next/static", ".next/static");
copy("db/migrations", "db/migrations");
copy("scripts/portal.mjs", "scripts/portal.mjs");
copy(".env.example", ".env.example");
copy("docs/DEPLOYMENT-STANDALONE.md", "README.md");

// scripts/portal.mjs (migrate, create-admin, backup, …) imports mysql2 directly. Next bundles mysql2
// into the server chunks, so it is not traced into standalone/node_modules: copy it with its deps.
function copyPackage(name, seen = new Set()) {
  if (seen.has(name)) return;
  seen.add(name);
  const src = path.join(root, "node_modules", name);
  if (!fs.existsSync(src)) throw new Error(`Missing dependency ${name}; run npm ci first.`);
  const dest = path.join(out, "node_modules", name);
  if (!fs.existsSync(dest)) fs.cpSync(src, dest, { recursive: true });
  const pkg = JSON.parse(fs.readFileSync(path.join(src, "package.json"), "utf8"));
  for (const dep of Object.keys(pkg.dependencies ?? {})) copyPackage(dep, seen);
}
copyPackage("mysql2");

console.log(`\nStandalone build ready: ${path.relative(root, out)} (start with: node server.js)`);
