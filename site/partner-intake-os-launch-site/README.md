# Partner Intake OS — Launch Site

Production-oriented static landing page for Partner Intake OS.

## Files
- `index.html` — semantic page structure and finished copy
- `styles.css` — responsive premium-dark design system
- `script.js` — lightweight interactions, score counters, reveals, mobile nav
- `README.md` — setup and deployment notes

## Preview
Open `index.html` directly in a browser, or serve the folder with any static server.

Example:
```bash
python -m http.server 8080
```
Then visit `http://localhost:8080`.

## Live GPT
The primary CTA is already wired to the supplied Partner Intake OS GPT URL.

## Replace placeholders
Search `index.html` for `[ADD URL]` and `placeholder-link`. No destination was supplied for:
- Partner Command Center
- Partner With Us
- Other AI Tools
- Privacy
- Contact
- Build Your Partner Engine

These intentionally do not navigate until you add real destinations.

## Architecture wording
The architecture section deliberately uses careful labels such as `WORKFLOW READY`, `API READY`, `EXPANDABLE`, and `CORE LOGIC`. Do not change these to `LIVE` unless the relevant component is actually deployed.

## Customize
Design tokens live at the top of `styles.css` under `:root`.
The page uses system fonts to avoid third-party font requests and keep load time low.

## Deployment
### Netlify
Drag this entire folder into Netlify Drop, or connect a repository containing these files.

### Vercel
Create a new project from a repository containing this folder. No framework preset or build command is required for a plain static site.

### GitHub Pages
Push the files to a repository, then enable Pages in repository settings and publish from the root branch/folder.

### Any static host
Upload all four files together, preserving the filenames.

## Embedding
### Wix / Framer / Webflow / Carrd
Deploy the page first, then embed the deployed URL in an iframe/embed component if you want the entire microsite inside another property. For best UX, linking to the standalone landing page is usually preferable.

### Generic iframe
```html
<iframe
  src="https://YOUR-DOMAIN.example/"
  title="Partner Intake OS"
  loading="lazy"
  style="width:100%;min-height:900px;border:0">
</iframe>
```

## Analytics
Paste your analytics script in the `<head>` of `index.html`. Avoid loading multiple overlapping analytics packages.

## Accessibility / performance
- Semantic landmarks and heading hierarchy
- Keyboard focus states
- Reduced-motion support
- Mobile-first fallbacks for dense UI
- No image dependencies
- No animation library or build step
- Lightweight vanilla JavaScript
