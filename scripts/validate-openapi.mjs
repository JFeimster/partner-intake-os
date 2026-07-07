import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const requiredFiles = [
  "actions/openapi.yaml",
  "actions/openapi.production.yaml",
  "actions/openapi.dev.yaml",
  "actions/openapi.admin.yaml",
  "actions/openapi.partner.yaml"
];

const expectedProductionPaths = [
  "/api/health",
  "/api/partners/classify",
  "/api/partners/recommend-resources",
  "/api/partners/generate-onboarding-plan",
  "/api/partners/generate-campaign-kit",
  "/api/partners/log-event"
];

const forbiddenProductionFragments = [
  "/api/admin/",
  "/api/tally/",
  "/api/leads/",
  "/api/tracking/",
  "/api/sync/",
  "/api/security/"
];

const forbiddenProductionTags = [
  "Lead Submission",
  "Admin Review"
];

const failures = [];
const warnings = [];

async function exists(relativePath) {
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

for (const file of requiredFiles) {
  if (!(await exists(file))) {
    failures.push(`Missing required OpenAPI file: ${file}`);
  }
}

const productionPath = path.join(root, "actions/openapi.production.yaml");
const production = await readFile(productionPath, "utf8").catch((error) => {
  failures.push(`Unable to read actions/openapi.production.yaml: ${error.message}`);
  return "";
});

if (production) {
  if (!/^openapi:\s*3\./m.test(production)) {
    failures.push("Production OpenAPI file does not declare openapi: 3.x.");
  }

  const pathMatches = [...production.matchAll(/^\s{2}(\/api\/[^:]+):\s*$/gm)].map((match) => match[1]);
  const uniquePaths = [...new Set(pathMatches)];

  for (const expected of expectedProductionPaths) {
    if (!uniquePaths.includes(expected)) {
      failures.push(`Production OpenAPI is missing expected route: ${expected}`);
    }
  }

  for (const actual of uniquePaths) {
    if (!expectedProductionPaths.includes(actual)) {
      failures.push(`Production OpenAPI includes non-production route: ${actual}`);
    }
  }

  for (const fragment of forbiddenProductionFragments) {
    if (production.includes(fragment)) {
      failures.push(`Production OpenAPI includes forbidden fragment: ${fragment}`);
    }
  }

  for (const tag of forbiddenProductionTags) {
    if (production.includes(`name: ${tag}`) || production.includes(`- ${tag}`)) {
      failures.push(`Production OpenAPI includes forbidden/confusing tag: ${tag}`);
    }
  }

  if (/YOUR_[A-Z_]*DOMAIN|YOUR_PRODUCTION_VERCEL_DOMAIN|localhost/i.test(production)) {
    warnings.push("Production OpenAPI still contains a placeholder/local server URL. Replace before live GPT import.");
  }
}

console.log("OpenAPI import safety check complete.");

if (warnings.length) {
  console.warn("Warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (failures.length) {
  console.error("Failures:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("OpenAPI validation passed.");
