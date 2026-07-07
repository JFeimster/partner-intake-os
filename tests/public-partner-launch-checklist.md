# Public Partner Launch Checklist

## Page checks

- [ ] `public-signup.html` exists.
- [ ] `partner-types.html` exists.
- [ ] `resources.html` exists.
- [ ] `faq.html` exists.
- [ ] `developer-access.html` exists.
- [ ] CSS and JS load.
- [ ] CTA links point to intake flow.
- [ ] Pages are mobile-friendly.

## Compliance checks

- [ ] Public CTA says “Apply to become a partner” or “Request partner access.”
- [ ] No “Get approved instantly.”
- [ ] No “Start earning guaranteed commissions.”
- [ ] No “Everyone qualifies.”
- [ ] Required disclaimer appears.
- [ ] No admin routes or API tokens are exposed.

## Local test

```powershell
python -m http.server 8080
```

Open:

```text
http://localhost:8080/site/partner-intake/public-signup.html
```
