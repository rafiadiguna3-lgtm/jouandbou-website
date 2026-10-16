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

## Desktop-only overview and restrained section return

Rollback: `54d0f8a37db21168b44883dc38de8a7bbcb70cec`.
The reference overview is desktop-only. Phone/tablet touch layouts return to the
original initial camera (x=25, y=2, z=15, scale=baseScale), including homepage return.
Phone view reset and camera travel retain their preceding behavior.
Desktop Projects/brand navigation from About, Contact or Bou starts at the homepage
pose with only a 1.5% scale adjustment over 320ms, anchored to the map center.
There is no visible travel from a previously selected house across the neighborhood.
Ordinary desktop homepage return also anchors to the map center. House selection,
swipe targets and 3D interaction stay as before. No deployment configuration changes.

PASS: build, asset integrity (4/4), browser regression (7/7). FAIL: none. BLOCKED: real Safari/iPhone and hosted browser testing remain unverified.

## Wider desktop homepage and instant section return

Rollback: `a862b9fcd59e2f4aac12404d108fbac0c2459ef5`.
Desktop reference framing now uses 62% viewport width and up to 77% height,
with the neighborhood slightly right/below center. Phone default framing remains
unchanged. Returning from About, Contact or Bou via Projects or the brand instantly
sets the homepage camera, without any pan, zoom or flight animation. Normal house
selection and swipe behavior are unchanged. No assets deleted or deployment settings
modified. This remains a review update.

PASS: build, asset integrity 4/4, desktop/phone framing and instant section return browser tests 2/2. Numeric assertions use tolerance for floating point rounding. FAIL: none remaining. BLOCKED: real iPhone/Safari and hosted browser checks remain unverified.

## Bottom-right neighborhood controls

Rollback: `d8ea3a0b2db4c1ef5d654774fa100b8ca9d5ac43`. Circular 46px buttons match the search component.
A minimal four-corner fit-view icon resets instantly to the desktop/phone default
framing and clears house selection. Existing zoom handlers are exposed as plus/minus.
The vertical component uses 28px desktop margins and 20px/18px phone margins with
bottom safe-area spacing. Hidden in 3D, other sections and dialogs. No assets deleted
or deployment configuration modified.

PASS: build, assets 4/4, desktop/phone controls and framing browser tests 2/2. FAIL: none. BLOCKED: real iPhone/Safari and hosted browser checks remain unverified.

## Animated return to the neighborhood

The reset view button now uses the same camera flight as the projects/home
navigation instead of snapping to the default pose. Returning from a selected
house captures its model center before clearing the selection, so clicking the
header logo or text uses the same projected anchor and duration calculation as
entry into 3D. Returns from other sections keep their existing instant behavior,
and reduced-motion preferences remain respected.

The source manifest was refreshed for this intentional app change and for the
existing migration-branch index.html, which previously differed from its recorded
hash. Original capture hashes are retained; the index itself was not changed.

## Smartphone controls on older Android browsers

Compact search rules no longer share selector lists with `:has()`, which caused
older browsers to discard the entire rule and fall back to a full-width search.
The bottom project sheet and related controls use `vh` by default and enable
`dvh` only after an explicit browser support check. Model-view zoom visibility no longer depends on `:has()`,
and the search container explicitly respects its hidden attribute. Circular
search and map buttons remove native styling and retain equal fixed dimensions
on all smartphone layouts. Source hashes record these intentional CSS changes.

Browser regression coverage includes iPhone and Android Chromium emulation,
portrait and landscape, plus stylesheet fault injection for missing `:has()` and
`dvh` support. This is compatibility simulation, not a physical-device test.

## Desktop 3D loading and rendering

Intentional renderer/model-data changes reserve a selected-house loading lane,
pause invisible background preparation during focused 3D, prioritize selected
network requests, reuse validated opaque model bounds, and cap desktop Retina/4K
render density. See `docs/explore-performance.md` for the quality tradeoff,
validation, measurements, and public-network limits. Geometry, materials,
transparent sorting and camera paths retain their source behavior.

## Stable tab title and search metadata

The server-delivered HTML title and Open Graph title now match the runtime
homepage name, `jou and bou`, removing the brief `studio` suffix during reload.
Description metadata uses the studio description with the plain word `and`,
without the old neighborhood text or an encoded brand separator. Added the
canonical homepage URL and WebSite structured data using the existing apex
Open Graph URL. No DNS, redirects, staging indexing policy or deployment
configuration was changed. The supplied screenshots show an older Google
snippet; Google may rewrite titles/descriptions and updates them after crawling
the deployed page. Repository edits do not update the Google index directly.

## Final user-selected search presentation

Site name: `jou and bou`; canonical URL: `https://jouandbou.com/`; homepage
and preview title: `jou and bou studio`. The exact user-selected description is
`architecture & interior design, elevates lives through efficiency, problem-solving design, and environmental consciousness. est 2020`.
The ampersand is escaped once in HTML and reads as `&` in the DOM. The existing
180px favicon artwork supplies the Open Graph, summary-card and structured-data
image. The runtime homepage title matches the HTML title to avoid a refresh
flash. This supersedes the previous choice of homepage title and description;
Google's final presentation still depends on deployment and recrawling.

## Smartphone landing experiment

Phone/touch layouts open with a smaller neighborhood offset toward the lower
right, the supplied jou/bou works and service choices, and short exploration
instructions. Dragging or zooming progressively fades and shifts the copy;
search and a small introduction toggle appear after that transition. The toggle
can restore/hide the copy; further map movement dismisses a restored introduction,
and resetting the map restores the initial composition. Reduced-motion settings
remove transition animations. Desktop retains its existing camera and search.

Per the user's clarification, work/service choices only change active styling
for now: no new sections, content filtering, or Bou navigation were added.
The two new phone-intro files are locally authored additions; their manifest
provenance is the repository, not the original published capture.

Removed the obsolete phone selected-card search offset so the introduction
arrow always stays below the search button, including after a keyboard result
selection. Search remains visible when its input is open during viewport changes.

## Smartphone landing spacing and faster transitions

Reduced work labels to roughly 22px and service/guide copy to 11.5px, lowered
the heading, increased spacing between guide paragraphs, and shifted the initial
neighborhood farther right/down to leave more open space. Camera-driven copy
now finishes fading after about 32% of the normalized movement (previously 70%),
with 120ms opacity / 160ms slide transitions. Restoring the text fades/slides
search out; hiding the text brings search back. The small toggle stays available
in both states, and reduced-motion preferences disable these transitions.

Work navigation clarification: jou works returns to the map and bou works opens
the existing `#bou-works` section. The current work underline follows the route;
only interior design remains a future content option. Restored copy now reacts
to fresh camera-target changes, so residual zoom easing cannot immediately hide
text that the user has just reopened.

## Closer smartphone opening map

Increased only the phone/touch opening camera scale by 35%, keeping the same
upper-left map alignment and text whitespace. Reload, reset and home navigation
use this closer composition; desktop framing and the intro/search gesture
thresholds remain unchanged.
