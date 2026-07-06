# OpenAPI Validation Guide

## Purpose

This guide validates the Partner Intake OS OpenAPI Action Pack before it is imported into the Custom GPT builder.

Batch 15 does not create new API endpoints. It checks the existing GPT-facing Action Pack and gives repair steps when the schema, auth, server URL, or response shapes fail.

## Validation targets

Validate both files when present:

- `/actions/openapi.yaml`
- `/actions/openapi.json`

If your existing repo still uses older names such as `partner-intake-os.openapi.yaml`, keep that file if it is already wired into the GPT, but the active root-level convention prefers concise names.

## Required GPT-facing endpoints

The Action Pack should expose only these endpoints:

| Method | Path | operationId | GPT-facing |
|---|---|---:|---|
| GET | `/api/health` | `checkHealth` | Yes |
| POST | `/api/partners/classify` | `classifyPartnerIntake` | Yes |
| POST | `/api/partners/recommend-resources` | `recommendPartnerResources` | Yes |
| POST | `/api/partners/generate-onboarding-plan` | `generatePartnerOnboardingPlan` | Yes |
| POST | `/api/partners/generate-campaign-kit` | `generatePartnerCampaignKit` | Yes |
| POST | `/api/partners/log-event` | `logPartnerEvent` | Yes |
| POST | `/api/tally/partner-intake-webhook` | none | No |

Do not expose the Tally webhook endpoint to GPT Actions. Tally is a system-to-system intake source, not a GPT-callable action.

## Required OpenAPI fields

Every active OpenAPI file should include:

- `openapi`
- `info.title`
- `info.version`
- `servers`
- `paths`
- `components.securitySchemes`
- Request schemas for all POST endpoints
- Response examples for all endpoints
- Security defined globally or per operation
- Stable `operationId` values

Minimum version recommendation:

```yaml
openapi: 3.1.0
```

OpenAPI 3.0.x may work, but 3.1.0 is cleaner for JSON Schema alignment.

## Required auth behavior

Use Bearer API key authentication.

Expected header:

```http
Authorization: Bearer YOUR_PARTNER_INTAKE_ACTION_TOKEN
```

Vercel environment variable:

```text
PARTNER_INTAKE_ACTION_TOKEN
```

GPT Action auth setting:

```text
Authentication Type: API Key
Auth Type: Bearer
Header: Authorization
```

The API should reject missing or bad tokens for all partner endpoints. Health can be public or token-protected depending on the existing implementation, but the OpenAPI file should match actual API behavior.

## Server URL replacement steps

Before import into the GPT builder:

1. Replace this placeholder:

```text
https://YOUR_VERCEL_DOMAIN.vercel.app
```

2. Use the deployed Vercel production domain, for example:

```text
https://partner-command-center.vercel.app
```

3. Do not include a trailing slash in the server URL.
4. Confirm every path starts with `/api/...`.
5. Confirm the OpenAPI server URL matches the domain being tested with curl.

## YAML validation

From repo root:

```powershell
python - <<'PY'
import yaml
from pathlib import Path

path = Path("actions/openapi.yaml")
data = yaml.safe_load(path.read_text(encoding="utf-8"))
required = ["openapi", "info", "servers", "paths"]
missing = [key for key in required if key not in data]
if missing:
    raise SystemExit(f"Missing required keys: {missing}")
print("YAML parsed:", data["info"].get("title"))
PY
```

If PyYAML is not installed:

```powershell
python -m pip install pyyaml
```

## JSON validation

From repo root:

```powershell
python -m json.tool actions/openapi.json > $null
```

If the command returns no output, JSON syntax is valid.

## Compare YAML and JSON versions

Use this check when both versions exist:

```powershell
python - <<'PY'
import json, yaml
from pathlib import Path

yaml_data = yaml.safe_load(Path("actions/openapi.yaml").read_text(encoding="utf-8"))
json_data = json.loads(Path("actions/openapi.json").read_text(encoding="utf-8"))

yaml_paths = set(yaml_data.get("paths", {}).keys())
json_paths = set(json_data.get("paths", {}).keys())

if yaml_paths != json_paths:
    print("Path mismatch")
    print("Only YAML:", sorted(yaml_paths - json_paths))
    print("Only JSON:", sorted(json_paths - yaml_paths))
    raise SystemExit(1)

for path in sorted(yaml_paths):
    yaml_methods = set(yaml_data["paths"][path].keys())
    json_methods = set(json_data["paths"][path].keys())
    if yaml_methods != json_methods:
        print(f"Method mismatch for {path}")
        print("Only YAML:", yaml_methods - json_methods)
        print("Only JSON:", json_methods - yaml_methods)
        raise SystemExit(1)

print("YAML and JSON paths/methods match.")
PY
```

## Schema import checklist

Before importing into the Custom GPT builder:

- [ ] Server URL is the production Vercel URL.
- [ ] No local URL remains.
- [ ] No placeholder token appears in examples that could be mistaken for a real secret.
- [ ] Tally webhook endpoint is not present.
- [ ] All operation IDs are present and unique.
- [ ] Every POST endpoint has a request body example.
- [ ] Every endpoint has a 200 response example.
- [ ] Auth scheme is Bearer.
- [ ] The schema imports without warnings.
- [ ] GPT Preview can call `checkHealth`.
- [ ] GPT Preview rejects bad auth on protected endpoints.
- [ ] GPT Preview returns useful structured output on valid payloads.

## Validation order

Use this order. Do not debug randomly like a raccoon in a server closet.

1. Validate JSON/YAML syntax.
2. Confirm server URL.
3. Confirm endpoints and operation IDs.
4. Confirm security scheme.
5. Curl test health.
6. Curl test bad auth.
7. Curl test valid auth.
8. Import into GPT builder.
9. Test each action in Preview.
10. Update the test log.

## Pass condition

The Action Pack is ready when:

- It imports cleanly.
- It exposes only the safe GPT-facing endpoints.
- Auth works exactly as documented.
- The deployed API returns predictable JSON.
- The GPT can explain and use the results without hallucinating approval, funding, or lender certainty.
