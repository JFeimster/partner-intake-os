# Partner Intake OS Launch Page

A polished static launch page for **Partner Intake OS**, part of the Moonshine Capital / Partner Command Center ecosystem.

## Files

```text
partner-intake-os-site/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Preview locally

Open `index.html` in your browser.

For a cleaner local preview, run a simple local server from this folder:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Customize

Search in `index.html` for these areas:

- `https://chatgpt.com/g/g-6a4b8054aaac8191a197ca527ce9ad11-partner-intake-os` — replace with another Custom GPT URL if needed.
- `Starter Prompt` — edit the prompt users can copy.
- `crm_record.json` — edit the example dashboard output.
- `Moonshine Capital / Partner Command Center` — edit brand/ecosystem copy.
- `dummyimage.com` Open Graph image — replace with your own social preview image URL when available.

## Add an embedded GPT or demo widget

ChatGPT Custom GPTs generally open through a share URL. If you later have an embeddable demo, iframe, form, or intake widget, place it in the `#demo` section.

Example iframe block:

```html
<iframe
  src="YOUR_EMBED_URL"
  title="Partner Intake OS demo"
  width="100%"
  height="680"
  loading="lazy"
></iframe>
```

## Deploy to Netlify

1. Go to Netlify.
2. Drag the entire `partner-intake-os-site` folder into the deploy area.
3. Netlify will give you a live URL.
4. Add a custom domain in Site settings if needed.

No build command is required.

## Deploy to Vercel

1. Create a new Vercel project.
2. Upload or import this folder.
3. Use the default static project settings.
4. Leave build command blank.
5. Deploy.

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload these files to the repository root.
3. Go to Settings → Pages.
4. Choose the main branch and root folder.
5. Save and wait for the Pages URL.

## Embed on Wix, Framer, Webflow, Carrd, or a custom HTML block

Use one of these approaches:

### Option 1: Link button

Add a button that points to:

```text
https://chatgpt.com/g/g-6a4b8054aaac8191a197ca527ce9ad11-partner-intake-os
```

Button label:

```text
Try Partner Intake OS
```

### Option 2: Iframe mini-site

Deploy this page first, then embed the live URL with an iframe:

```html
<iframe
  src="YOUR_DEPLOYED_PAGE_URL"
  title="Partner Intake OS"
  style="width:100%;height:900px;border:0;border-radius:24px;overflow:hidden;"
  loading="lazy">
</iframe>
```

### Option 3: Copy sections into a custom HTML block

Copy the relevant HTML from `index.html`, then paste the CSS from `styles.css` into your site settings or custom code area.

## Compliance notes

The page intentionally avoids:

- Guaranteed funding approvals
- Guaranteed partner revenue
- Guaranteed deal flow
- Credit repair claims
- Fake lender certainty
- Fake testimonials
- Fake user counts
- “Everyone qualifies” language

The positioning is operational and readiness-based: classification, routing, scoring, onboarding paths, CRM records, campaign recommendations, and review support.

## Recommended next upgrades

- Replace the placeholder Open Graph image with a branded 1200x630 graphic.
- Add analytics only after choosing a privacy-conscious setup.
- Add a Tally intake form or booking CTA for guided/done-for-you services.
- Create a Partner Command Center dashboard page once API/dashboard workflows are live.
