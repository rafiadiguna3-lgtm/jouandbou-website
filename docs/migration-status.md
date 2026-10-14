# Migration status

## Source and scope

Captured the publicly served frontend on 2026-10-13 from
https://jouandbou.rafiadiguna3.chatgpt.site/.
The source frontend is accessible as readable HTML, CSS and ES modules.
It is reused verbatim, not reconstructed. No editor-export capability or original
project repository was available through this session. Editor history, unpublished
photography, original GLB/DAE authoring files, and authenticated Instagram content
are not included. The published GPU/software geometry is included and validated.

All 885 captured files are listed with exact hashes in `source-manifest.json`.
The build produces a standalone static website without fetching files from the
old ChatGPT Sites origin at runtime. Original fonts/maps/social destinations remain.

## Missing photographs: user-supplied originals needed

These 15 source responses return HTTP 200 with zero-byte bodies, confirmed again
by independent HTTPS GET requests. They are preserved as received; no replacement
images were invented. Supply the original photographs and variants, or approve
how you want variants derived from the originals in a follow-up change.

- `assets/jangkrik/02.fast-1280.webp`
- `assets/jangkrik/02.webp`
- `assets/marboy/photos/15.fast-800.webp`
- `assets/rempoa/photos/17.fast-1280.webp`
- `assets/rempoa/photos/17.webp`
- `assets/rempoa/photos/23.fast-800.webp`
- `assets/rempoa/photos/6.fast-1280.webp`
- `assets/rempoa/photos/6.webp`
- `assets/rumah-anas/instagram/CPDa03CAEIb-05.fast-1280.webp`
- `assets/rumah-anas/instagram/CPDa03CAEIb-05.webp`
- `assets/rumah-anas/instagram/CPDa03CAEIb-06.fast-1280.webp`
- `assets/rumah-anas/instagram/CPDa03CAEIb-06.webp`
- `assets/rumasoka/02.fast-800.webp`
- `assets/rumasoka/instagram/CyI8miRJmG0-04.fast-1280.webp`
- `assets/rumasoka/instagram/CyI8miRJmG0-04.webp`

The asset test intentionally reports photograph completeness as failed. Source
hash, 3D geometry and video-fragment checks are separate from image completeness.
The `assets/jh39/progress/manifest.json` supplied by the source explicitly covers
three public preview photographs, not the complete authenticated Instagram highlight.
Provide the full original highlight if you want coverage beyond the existing site.
Generic project dialogs already contain photography placeholders in the published
HTML; no new photographs or project descriptions have been invented.

## External integrations

- Lato and Open Sans: `fonts.googleapis.com`, `fonts.gstatic.com`.
- Vector contact map: `tiles.openfreemap.org`, using the existing dark style.
- Existing raster fallback: `tile.openstreetmap.org`.
- Social, phone, email, Google Maps directions and Bou Works links retain their original destinations.

No map key or backend credential is referenced in the published frontend.
External font/map requests currently encounter the cloud network allowlist; their
runtime validation remains pending. Required domains have been saved in the
environment configuration draft. Review/save/publish those settings to enable
verification. Static hosting must also allow these destinations and the original
inline styles, blob media, WebGL, and map worker behavior if adding a CSP.

## Validation

Validation results are recorded after the current test run below. Nothing has
been deployed, and the existing Sites project, Squarespace, DNS and domains are
unchanged. A pull request is for review of this static migration only.

- Frozen install (`npm ci`): passed with the saved dependency lockfile.
- Static production build (`npm run build`): passed, 885 files, 230,386,036 bytes.
- Asset suite (`npm test`): 3 passed, 1 failed. Published-byte provenance, all
  25 houses in GPU/software formats, and complete film fragments pass. Responsive
  photograph completeness fails on the source's zero-byte photos listed above.
- Browser suite (`npm run test:browser`): 4 passed. Includes eight project detail
  routes, actual film playback, photograph viewer, contact card, and phone
  portrait/landscape navigation. Initial test assumptions about hidden zoom
  buttons, lazy image loading, and the phone roof-callout entry point were corrected
  in the test harness; the published application files were not changed.
- Reference screenshot comparison: 6 passed, under a 0.5% pixel tolerance.
  Desktop/phone homepage, about page and Marboy detail were compared against
  live frontend execution with reduced motion. Largest difference: 0.1553%.
  Marboy detail was 0% in both viewports. This is sampled visual validation,
  not proof of every interaction or pixel at every screen size.
- Font service was unavailable to both sides during comparison, so screenshots
  use the source's existing CSS fallback fonts. Original typography declarations
  are preserved but Google Fonts loading remains unverified.
- External map tiles/style remain unverified due to HTTP 403 network-proxy blocks.
  Existing vector/raster code and libraries are retained; the contact card and
  direction link were verified independently of tiles. No map was substituted.
- No deployment, custom domain, DNS update, or original-project change was made.

Reference comparison measurements are in `visual-validation.json`. Sample local
screenshots: [desktop home](screenshots/desktop-home.png),
[phone home](screenshots/phone-home.png),
[desktop project](screenshots/desktop-project.png),
[phone project](screenshots/phone-project.png).

## Vercel staging preparation

The same `migration/jou-and-bou` branch now includes Vercel Preview settings,
a Production-build rejection guard, pinned Node.js 24.x, upload exclusions and
hosted tests for 3D/details/fonts/map tiles. The Draft PR stays open and unmerged.
All published frontend files and the 15 pending image files remain unchanged.

Vercel's official static builder passed locally and verified all 885 output
hashes. Two deployment-configuration checks and four local browser tests passed.
**A hosted Vercel deployment has not been created or verified**: a new account-bound
staging project must first be created using the user steps in
[vercel-staging.md](vercel-staging.md). No staging URL, authenticated Vercel access
or hosted build logs are available yet. Staging font and map checks are prepared,
not reported as passed. Build-output size is about 220 MiB; actual Vercel upload
limits remain to be verified.

The photograph-completeness failure remains pending until the original assets
are supplied. This migration is not production-ready.

## Search and first-stage swipe review update

Rollback: `5b63c664a98428d4f639e9714c5c9d112409eace`.
Search results and Enter now select the first-stage house callout on desktop and
phone. A subsequent tap enters 3D. Search text/results are cleared after selection,
cancel, Escape or dismissal, and on reopening. Search/clear hover rotation and
background effects are removed.

First-stage horizontal swipes on the callout or focus card use 60% of normal camera
travel time. The easing, selected-house anchor and prescribed zoom destination are
preserved; clicks and keyboard timing remain unchanged. Vertical scrolling and tap
activation are preserved. Only application files, tests and documentation changed;
no files removed or deployment configuration changed.

PASS: build (1012 files), asset integrity (4/4), camera-flight unit suite,
affected browser regression (12/12), search/hover tests (3/3), phone swipe test.
FAIL: none remaining. BLOCKED: real Safari/iPhone and hosted browser validation;
Cloudflare preview/external map/font hosts remain outside the network allowlist.
This remains an update for review, not a final release.

## Default homepage framing

Rollback: `e99ab452ada9c3a61cb188911956be10bc297d4c`.
The initial camera now frames the complete neighborhood to the supplied screenshot:
76.2% viewport width, up to 96% viewport height, centered slightly right/down.
Framing uses the native world geometry and the existing yaw/pitch. Direct URL entry,
reload, Projects/home return and unselected view reset share the same camera pose.
Selected-house click/swipe/keyboard zoom targets and 3D entry/exit remain unchanged.
No asset, layout, deployment settings or live Sites changes.

PASS: build, asset integrity 4/4, framing browser tests 2/2 and related camera/swipe/search tests 5/5. An initial exact float comparison failed at 1e-14 precision; numeric tolerance corrected and framing tests passed. FAIL: none remaining. BLOCKED: real Safari/iPhone and hosted browser checks remain unverified.
