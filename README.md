# Jou and Bou

Interactive architecture and interior design portfolio for **Jou and Bou**, a Jakarta-based studio.

**Website:** [jouandbou.com](https://jouandbou.com/)

Explore the studio’s work through a 3D neighborhood: select a house, explore its model, view project photographs and details, or start a conversation through WhatsApp.

## Website features

- Interactive neighborhood with 25 selectable project models, selection colors, and camera transitions.
- Search across Jou projects and the seven published Bou projects, including typo suggestions.
- Project details, photographs, and a project-specific WhatsApp inquiry.
- About, Bou Works, and Contact within the existing website experience.
- Responsive navigation and a refresh-scoped “jou world” introduction that dismisses on interaction.
- Fifteen published project URLs with static content, SEO metadata, and project-specific share images.
- An in-place homepage fallback when JavaScript is unavailable or application startup fails.

## Links and SEO

| Destination | URL |
| --- | --- |
| Homepage / Jou Works | [jouandbou.com/#projects](https://jouandbou.com/#projects) |
| About | [jouandbou.com/#about](https://jouandbou.com/#about) |
| Bou Works | [jouandbou.com/#bou-works](https://jouandbou.com/#bou-works) |
| Example project | [jouandbou.com/projects/rumah-anas/](https://jouandbou.com/projects/rumah-anas/) |

Individual published projects have their own HTML pages, canonical URLs, descriptions, structured data, and Open Graph/Twitter image metadata. These URLs support direct visits, search discovery, and link sharing while opening the existing project interface when JavaScript loads.

There is no separate project index screen. `/projects/` and `/jou-works/` redirect to `/#projects`; `/about-us/` redirects to `/#about`; `/bou-works/` redirects to `/#bou-works`. The `www` hostname redirects to the apex domain while preserving paths. Projects without a published story retain their existing map/hash behavior and are excluded from the sitemap.

Google indexing and social preview refreshes depend on the external platforms’ crawlers and caches. See [project SEO](docs/project-seo.md), [domain routing](docs/www-domain.md), and [favicon behavior](docs/favicon-behavior.md).

## Local development

Use **Node.js 24** and npm.

```sh
npm ci
npm run dev
```

Open `http://localhost:5173`. The development command builds and serves `dist/`; rebuild and restart after source edits. There is no hot reload.

```sh
npm run build
npm run preview
```

The preview server uses `http://localhost:4173`. The build verifies asset hashes, copies `site/`, generates the published project pages and homepage fallback, and checks for files that must not be publicly deployed. No application backend or secret is required.

## Repository structure

| Path | Purpose |
| --- | --- |
| `site/` | Website HTML, styles, JavaScript modules, photographs, models, and vendored libraries |
| `scripts/` | Build, project catalog, share preview, asset validation, and reference comparison tools |
| `tests/` | Source/asset checks and Playwright browser tests |
| `docs/` | Implementation notes, routing, SEO, validation history, and source provenance |
| `dist/` | Generated deployment output; rebuilt by `npm run build` |

The frontend uses browser JavaScript modules and a custom 3D renderer with GPU and software fallback paths. Node dependencies are development and validation tools. Fonts and external map providers still require access to their respective services. The photo service worker caches photographs; it does not provide full offline operation.

## Content and asset updates

Edit the existing project stories or Bou content in `site/`. For published project catalog changes, update `scripts/build-project-catalog.mjs` and run:

```sh
npm run build:project-catalog
npm run build:project-previews
npm run manifest:update
npm run build
```

Share preview generation requires Chromium. Deployment builds use the committed catalog and preview images and do not launch Chromium.

For other intentional changes to files in `site/`, document the change in [migration status](docs/migration-status.md), run `npm run manifest:update`, then rebuild. The manifest preserves original capture hashes alongside current file hashes.

## Validation

```sh
npm test
npm run test:browser
npm run test:projects
npm run test:deployment-config
```

Browser tests use Chromium through Playwright. Set `CHROMIUM_PATH` if needed, or install the browser with `npx playwright install chromium`. The browser suite covers map navigation, search, project details, galleries, inquiry links, routing, and responsive behavior. Chromium emulation does not replace testing on physical devices or Safari.

Validation results are recorded with their implementation changes in [migration status](docs/migration-status.md); historical pass counts do not imply every test matches the current UI. Some older routing/guide assertions still need alignment with the current section redirects and introduction.

The optional `npm run test:reference` compares against the original captured site and requires external network access. See [device checks](docs/device-checks.md) for the responsive review process.

## Deployment

Run `npm ci` and `npm run build`, then publish **the contents of `dist/`** to a static HTTPS host. For Cloudflare Pages, use `npm run build` as the build command and `dist` as the output directory. Keep `_redirects` and `_headers` in the deployed output.

Serve `.mjs` as JavaScript, `.json` as JSON, and `.bin` as binary. Preserve asset paths and filename case. Missing assets must return a real 404 rather than the homepage. Confirm both hostnames reach the same deployment and the `www` redirect preserves individual project URLs.

Public-file checks and response headers are part of the repository; Cloudflare edge rules are separate account settings. See [Cloudflare security](docs/cloudflare-security.md).

## Source provenance

The initial frontend and assets were captured from `jouandbou.rafiadiguna3.chatgpt.site`, then intentionally updated in this repository. This is not an export of the original editor project or its unpublished assets. [The source manifest](docs/source-manifest.json) records source URLs and hashes; [migration status](docs/migration-status.md) records subsequent implementation changes.
