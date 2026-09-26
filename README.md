# The Party Architect

Marketing site for [The Party Architect](https://the-party-architect.com), a bachelorette weekend planning service. A landing page, destination guides (Charleston, Nashville, Palm Springs), and an inquiry form that emails the planner and sends the client a confirmation.

## Stack

- [Astro 6](https://astro.build) with React islands for the interactive form
- [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`
- `@astrojs/sitemap` for the sitemap
- [Cloudflare Pages](https://pages.cloudflare.com), with one Pages Function (`functions/api/inquiry.ts`) handling form submissions
- [Resend](https://resend.com) for email

## Develop

Requires Node 22.12 or newer.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview
```

## Configuration

The inquiry function needs one secret, set in the Cloudflare Pages project (or in `.dev.vars` for local `wrangler pages dev`):

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Sends the inquiry notification and the client confirmation |

## Layout

```
src/
  pages/            index + destinations/{charleston,nashville,palm-springs}
  components/       page sections, SEO head, InquiryForm (React)
  layouts/          BaseLayout
functions/api/      inquiry.ts (Pages Function)
```
