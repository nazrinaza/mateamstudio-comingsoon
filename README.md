# Mateam Studio — Coming soon

Temporary landing page for Mateam Studio Sdn Bhd, with newsletter signups stored in Google Sheets after configuration.

## Included

- Responsive teal-and-gold landing page with supplied company logo and portfolio image.
- Server-side newsletter endpoint with validation and confirmed-save responses.
- Google Apps Script integration with secret authentication and duplicate-email prevention.
- `portable/index.html`: self-contained visual HTML copy with embedded imagery and styles.

## Google Sheets connection

Follow [the step-by-step guide](integrations/SETUP.md). Paste [Code.gs](integrations/Code.gs) into Google Apps Script.

The signup is not active until `NEWSLETTER_SCRIPT_URL` and `NEWSLETTER_SECRET` are configured in the site's server environment. The Google Sheet remains private. No credentials or subscriber records belong in this repository.

## Local development

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

```sh
npm run build
```

The application uses React and Vinext with a Cloudflare Workers server. `.openai/hosting.json` identifies the existing Sites project. GitHub stores the source; pushing changes here does not automatically deploy the website.

## Portable HTML

Open `portable/index.html` to review the design. Its form calls `/api/subscribe` on the same origin. HTML alone, including GitHub Pages, cannot run that server endpoint; deploy the full application or supply a compatible backend on your host.

## Content and domain

Brand assets and contact information are from the supplied 2025 company profiles. The existing preview is private. The public domain mateamstudio.com is not connected yet. Newsletter sending and the later full official website are separate work.
