# Jou and Bou website

An independently deployable static copy of the frontend published at
https://jouandbou.rafiadiguna3.chatgpt.site/.

The HTML, CSS, JavaScript, vendored libraries, photography, video fragments, and
3D geometry in `site/` were retrieved from that live website without rewriting
or redesign. This is **not an export of the ChatGPT Sites editor project**, its
history, or unpublished source assets. `docs/source-manifest.json` records the
source URLs, byte sizes, and SHA-256 hashes of every retrieved file.

## Develop and build

Use Node.js 24 (validated with Node.js 24.19.0).

```sh
npm ci
npm run dev
npm run build
npm run preview
```

`dev` builds and serves `dist/` on port 5173; rebuild/restart after source edits.
`preview` serves the existing `dist/` on port 4173. The build verifies the source
manifest, copies the source/assets, and generates 15 public project pages plus
`/projects/`. It does not bundle modules or strip version queries. See
[project SEO and share pages](docs/project-seo.md) for routes and content updates.
There is no backend and no application secret is required by the retrieved code.
All Node dependencies are development and validation tools, pinned in the lockfile.

## Validate

```sh
npm test
npm run test:browser
node scripts/compare-live.mjs
```

The asset suite checks source hashes, all 25 interactive houses in both GPU and
software-fallback formats, video fragments, and responsive photographs.
The asset suite currently passes, including responsive photograph completeness.
Run `npm run test:projects` to build and check the published project pages,
per-project metadata and legacy-link compatibility.

Browser tests exercise search, 3D entry, project detail routes, video playback,
photograph viewing, about/contact navigation, and phone portrait/landscape behavior.
Use `CHROMIUM_PATH` to point at a Chromium executable. If `/usr/bin/chromium` exists
it is used; otherwise install Playwright Chromium with `npx playwright install chromium`.

The optional reference audit uses HTTPS requests via `curl` with certificate
verification enabled, executes the live and local frontend in Chromium, and
writes paired screenshots, pixel differences, and results under
`test-results/reference/`. It needs live-site access and `curl`. It does not edit
the original site. Comparisons have limits when external fonts or map services
are blocked; these are recorded rather than replaced.

## Deploy independently

Run `npm ci` and `npm run build`, then upload **the contents of `dist/`** to a
static HTTPS host. Serve `.mjs` as JavaScript, `.json` as JSON, and `.bin` as binary.
Do not redirect missing assets to `index.html`; a genuine missing asset must
return 404. Retain every path and case, including `vendor/` and `assets/`.
HTTPS enables the original photo service worker; it caches photographs only,
not HTML, code, models, or films. It does not provide full offline operation.

A `netlify.toml` is included with build command `npm run build` and publish folder
`dist`. Other static hosts can use the same settings; no Netlify account or
custom domain is required to build this project. Choose a new deployment target
separate from the existing Sites and Squarespace projects. No deployment,
existing website modification, DNS change, or domain connection is part of this
migration PR.

Preserved external integrations include Google Fonts, OpenFreeMap, the existing
OpenStreetMap map fallback, social/contact links, and a Bou Works link to the
existing `jouandbou.com` website. These still require their original external
services and are not owned by this static deployment.

For intentional source edits, run `npm run manifest:update` to update the corresponding entries in
`docs/source-manifest.json` while retaining the original hashes, and document that the files have diverged from the
published capture; preserve the original capture provenance.

## Vercel staging

See [the step-by-step staging guide](docs/vercel-staging.md). Vercel Preview builds
use `npm run build:vercel` and publish `dist/`. Production builds are blocked,
automatic Git deployments are disabled, and responses are marked `noindex`.
This is staging preparation, not a hosted deployment verification.
