import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const skipDirs = new Set([".git", ".vercel", "node_modules"]);
const failures = [];
const checked = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith(".") && ![".well-known"].includes(entry.name)) {
      if (skipDirs.has(entry.name)) continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      await walk(fullPath);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".json")) continue;

    const relative = path.relative(root, fullPath).replace(/\\/g, "/");
    checked.push(relative);

    try {
      const content = await readFile(fullPath, "utf8");
      JSON.parse(content);
    } catch (error) {
      failures.push({ file: relative, message: error instanceof Error ? error.message : String(error) });
    }
  }
}

await walk(root);

console.log(`Checked ${checked.length} JSON file(s).`);

if (failures.length) {
  console.error("Invalid JSON file(s):");
  for (const failure of failures) {
    console.error(`- ${failure.file}: ${failure.message}`);
  }
  process.exit(1);
}

console.log("JSON validation passed.");
