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

## Minimal phone exploration without recurring copy

The smartphone introduction now stays dismissed for the rest of the page visit
once exploration begins or a work choice is clicked. Zooming out/in, resetting,
or returning from Bou does not automatically restore it; the small arrow can
still restore it explicitly, and reloading starts a new visit. Clicking jou works
fades the text immediately. Removed smartphone search and switched phone journey
tests to real map taps and project browsing. Desktop search remains available.

Phone copy now uses opacity-only transitions and aligned left margins. Initial
work/service selections have no underline or selection arrow; those indicators
appear only after clicking a choice. Keyboard focus indicators are retained.

### Demand-driven geometry and gallery layout (2026-10-16)

The WebGL queue now stops after the three initial priority houses instead of draining every model on entry. At map scale 6 or above, visible houses are admitted after 180 ms without camera rendering; selecting a house retains the reserved foreground lane. Unloaded houses retain the authored neighborhood massing until their detailed geometry is available. Geometry preparation yields between ranges and during large transparent-bound scans, and commits each house atomically. Existing change-driven rendering and resolution limits are preserved. Gallery arrows cache their layout measurements on resize and coalesce scroll updates into one animation frame rather than mixing repeated layout reads and writes on each scroll event. Full-collection photo preparation no longer runs merely because an initial map batch completed; project-specific photo preparation remains available on selection.

Map visibility now also suspends queued model work and defers geometry preparation while another section, project dialog, or browser tab is visible. Local asset accounting: all 25 GPU binaries total 15,653,580 bytes; the three initial GPU binaries total 2,273,689 bytes (85.5% less automatic geometry transfer, before HTTP encoding/cache). This is not a whole-page PageSpeed score or a native Mac/Windows timing measurement. Browser coverage verifies bounded initial requests on desktop and phone, visible-model admission on zoom, selected-house priority with blocked background requests, section suspension, galleries, intro transitions and home return. The priority test waits for the next rendered focus state as well as geometry readiness, since those occur on separate animation frames.

### Restore detailed houses at the distant map view (2026-10-16)

User feedback supersedes demand-only geometry loading: visitors must recognize the actual houses even before zooming or selecting. Both renderers again load all 25 detailed houses progressively on entry with bounded concurrency and selected-house priority. No zoom/selection is required for detailed neighborhood geometry. The earlier 85.5% automatic-transfer reduction no longer applies. Cooperative geometry preparation, hidden-map suspension, gallery layout improvements and project-specific photo loading remain. Browser coverage now requires all 25 detailed models to load and be visible at the unchanged initial camera scale on both phone and desktop.

Restoring the complete map exposed slow camera settling at low frame rates: the easing clock counted at most 32 ms even when a frame took substantially longer. The bounded clock now counts up to 100 ms so the camera and hover easing catch up promptly on slower renderers, allowing background loading to resume after dragging. Camera flight paths remain unchanged.

### Phone overview reset and returning introductory copy (2026-10-16)

Smartphone search remains hidden. Introductory text returns when zooming out below 82% of the initial scale, with a 95% exit threshold to avoid flickering near the boundary; it keeps the existing placement and opacity fade. The phone square reset now fits the complete house area (including loaded model bounds, excluding long approach roads) within 88% of screen width and 62% of height, centered horizontally and slightly below the screen center. It clears project selection and exits 3D through the existing camera transition. Initial landing composition, brand navigation and desktop reset keep their previous behavior.

### Remove the former phone search-area chevron (2026-10-17)

Removed the introduction toggle button and its manual visibility state entirely. Smartphone search remains hidden from first paint, with no replacement control above the work links. Intro typography, spacing, far-zoom restoration, fade behavior and centered map reset remain as established. Desktop search is unchanged.

### Lightweight recognizable map geometry and visible-area streaming (2026-10-17)

This supersedes the earlier all-detail-on-entry policy with actual house-derived map models, rather than generic placeholder houses. `scripts/build-map-lod.mjs` reproducibly clusters original GPU geometry within 0.22-unit cells (less than one CSS pixel at distant map scale), preserves source placements, bounds, per-vertex colors and material layers, removes collapsed/duplicate triangles, and batches distant glass by layer. All 25 map binaries total 889,856 bytes and 79,627 triangles versus 15,653,580 bytes and 856,430 triangles in full-detail binaries. No source detail assets are replaced.

WebGL requests lightweight houses in the visible area plus a 35% normalized-device-coordinate margin, ordered from the screen center, with bounded concurrency. Offscreen houses stream as the camera moves. Full-detail geometry loads for nearby visible houses at map scale 6 or above, or immediately for an explicitly selected house through the reserved foreground lane. Far views use lightweight geometry even after detail was visited; selected 3D uses the original detail. Loading status still tracks detail availability. Hidden-scene suspension and cooperative geometry preparation remain.

Render audit: the scene already renders on camera/hover/model changes, not continuously while idle; shadow maps are not enabled. Hover picking uses projected bounding boxes, not triangle raycasts. Bounding-box projections are now cached until camera/viewport/model availability changes, and camera projection/view matrices are reused during hover-only frames. Phone copy and menu remain static HTML, independent of model completion; Google Fonts no longer blocks initial text paint. No cover image was added.

Local before/after sample is recorded in `docs/map-performance.json` (Linux Chromium/SwiftShader, one run per viewport). Initial desktop model transfer: 15,653,580 → 889,856 bytes; phone: 15,653,580 → 353,459 bytes for the first visible area. Draw calls: desktop 413 → 128, phone 152 → 51. Submitted triangles: desktop 873,686 → 96,883, phone 287,356 → 41,115. Main-thread long-task totals were essentially unchanged in this short sample (desktop 452 → 438 ms, phone 129 → 127 ms); this is not evidence of a native-device speedup or a new PageSpeed score. Distant-view screenshot comparison at pixelmatch threshold 0.1 differed by 7 of 1,296,000 pixels on desktop and 0 pixels on phone. Full-detail models and colors remain available for close/selected views. Phone overview fitting includes both lightweight and detailed bounds.

## SEO preview validation (2026-10-17, PR #4)

Homepage metadata, crawler discovery files, and favicon priority are intentional changes. Preserve the homepage SEO title in about.mjs after initialization and section navigation. Update the manifest for index.html and about.mjs while retaining published provenance; build and asset tests validate all hashes without exceptions.

Integrated remote SEO merge `5750813` before publishing this experiment. Its title, descriptions, favicon priority, robots.txt, sitemap.xml and runtime title preservation remain intact. Metadata browser assertions now match those reviewed SEO values; the performance change to the homepage head only makes the existing Google Fonts stylesheet nonblocking, with a noscript fallback.

## Homepage introduction and search snippets (2026-10-17)

Add a short visible homepage description matching the existing meta description. Desktop copy sits at the lower left; phone copy sits below work/service choices and follows the existing camera-driven intro fade. The copy is included in initial HTML, not injected or hidden solely for search engines. Contact details and the three section footers use data-nosnippet to exclude address, email and copyright from Google text snippets without removing content from visitors or indexing. Google still selects the final snippet and must recrawl to observe changes.

## Prevent homepage description flashing at the header (2026-10-17)

Ship the small homepage-summary layout inline in the document head, before its HTML, so the description cannot fall into normal document flow near the header while external CSS loads or a visitor reuses a pre-summary cached phone-intro.css. Version the phone intro stylesheet URL to refresh old cached CSS. Preserve the intended responsive placement and intro behavior.

### Preserve smooth interaction during detail streaming (2026-10-17)

Reproduced a regression with a delayed Marboy detail response: after the user completed an orbit/zoom, arrival of full geometry restarted the camera flight and reset the view. Model camera bounds and placement now use available lightweight metadata immediately; detail and lightweight geometry share the same authored frame. A detail arrival with that same frame no longer refits or restarts the camera. If no matching frame was available, the necessary refit retains the user's orbit and pan.

Camera easing/flights explicitly pause model queues and geometry commits, including selected models, until motion settles. Direct pointer gestures also hold commits; work rechecks the gate after cooperative yields and immediately before publishing meshes. Neighborhood detail selection is held during motion, with 6.8/5.2 zoom hysteresis once idle, avoiding repeated hard swaps around scale 6. Existing source models, phone typography, layout and SEO remain unchanged.

### Sensitive phone introduction dismissal and 85% return (2026-10-17)

Home copy keeps its initial appearance and existing layout. A cumulative pan of approximately 3 screen pixels or a small zoom change dismisses work links, guidance and studio summary together using their existing fade. After dismissal, copy returns only when an explicit zoom-out targets at most 85% of the initial map scale and the displayed camera reaches that threshold. Panning even at a distant scale hides copy again, without reopening on the next idle frame. Camera easing alone does not count as a new gesture; search stays hidden and desktop behavior is unchanged.

### Phone copy return threshold adjustment (2026-10-17)

The requested zoom-out return threshold is now 95% of the initial map scale, superseding 85%. Small-pan dismissal and the existing fade remain unchanged.

### Minimal phone copy show/hide stages (2026-10-17)

Phone home copy now dismisses on a zoom-in increase above 0.01% or a pan of approximately 1.5 screen pixels, including when it was just restored in a distant view. An explicit zoom-out of at least 0.2% can restore it at or below the existing 95% threshold. Visibility remains a binary shown/hidden state, with a short 100 ms opacity transition shared by work links, guidance and the studio summary; camera easing does not retrigger it. Typography and layout are unchanged.

### Explicit zoom-out only at 100%, with reversal cancellation (2026-10-17)

Copy restoration now requires an explicit map zoom-out input at or below 100% of initial scale; ordinary camera updates, navigation, panning or residual easing cannot restore it. The phone square overview button reports zoom-out intent when it actually reduces scale. Any zoom-in intent immediately clears pending restoration, even for changes too small to pass the former accumulated zoom threshold. Per-frame goal-direction tracking also cancels a queued reveal after reversal, preventing an unfinished zoom-out from showing copy during a subsequent zoom-in. Initial landing copy and the short fade remain unchanged.

### Reading-time and first-motion map warmup (2026-10-17)

Phone entry previously requested only the first visible lightweight models, ending around JH27; JH30 and later models were not requested until their area entered the viewport. The renderer now warms the remaining lightweight neighborhood after a 1.2-second reading interval or immediately on the first camera/pointer interaction, independent of distance. A bounded low-priority data queue shares decoded promises with geometry loading, avoiding duplicate requests. All 25 map binaries together remain about 0.89 MB; this does not prefetch the 15.65 MB detail collection.

User clarified that the JH30 area is already visible but houses only appear after zooming. Drag/pan and camera movement now warm and admit all lightweight houses irrespective of distance. Lightweight meshes can prepare during map movement and publish at most one house per animation frame; full-detail work retains the gesture/animation idle gate. Hidden sections and focused 3D pause remaining map prefetch. Full detail keeps selected-house priority. This addresses both visitors who pause to read and repeat visitors who immediately move the map. Phone framing is unchanged.

### Home copy returns only at the actual zoom-out limit (2026-10-17)

User clarified that 100% meant the furthest zoom-out stop, not the initial camera scale. The intro controller now receives the same minimum scale used by map zoom clamping (`fitScale(bounds,w,h) * .9`). Only explicit zoom-out at that limit restores copy, with tiny floating-point tolerance; an overview reset above the limit does not restore it. Initial landing text, instant zoom-in cancellation and the existing fade are preserved.

### Cross-device reference and responsive consistency (2026-10-17)

Keep the approved phone typography, map framing, intro fade and desktop presentation as the reference. Cross-device inspection found that 761–899 px fine-pointer windows and short landscape desktop windows used compact camera/input behavior while their CSS still showed desktop search and omitted the intro. Align the intro and inline studio-summary media queries with the existing input policy (width below 900 px, touch/coarse pointers, or landscape height at most 540 px). This also prevents the landscape summary retaining both top and bottom constraints. Version the intro stylesheet URL for the changed responsive rules.

Add an executable browser matrix for small phones, iPhone/Android emulation, phone landscape, tablet portrait/landscape, narrow/short desktop windows, laptop, Retina and 4K. Assert controls stay circular and in bounds, text fits, search/intro match input mode, zoom hides compact copy, and reset works without horizontal overflow. Save home screenshots in the Playwright report for visual cross-checking. These are Linux Chromium emulations, not certification on native Safari, macOS or Windows hardware.

Landscape checks also found the inherited 56 px brand-image box extending 2 px above and below the 52 px header. Constrain that image height to 52 px in compact landscape, preserving its width and centered artwork.

### Phone typography entrance and near-minimum reveal (2026-10-17)

Add a 420 ms opacity/7 px upward entrance to phone work links, service links, studio summary and guidance, with a small 40–130 ms group stagger. CSS starts the entrance on initial paint and replays it on a hidden-to-visible change, without per-frame JavaScript or layout animation. Existing 100 ms dismissal and tiny pan/zoom-in sensitivity remain. Reduced-motion disables the entrance. Change explicit zoom-out restoration from the exact minimum to minimum scale × 1.05 (5% above the furthest zoom-out scale); automatic camera updates and zoom-in reversals cannot reveal it. Version the intro stylesheet for this change.

Validation: build and all 5 asset/geometry tests pass; all 11 device-layout cases pass; all 6 phone-intro tests pass, covering 5% threshold boundaries, tiny-pan dismissal, zoom-in reversal, entrance replay and reduced motion.

### Preserve restored phone copy while panning the zoomed-out map (2026-10-17)

Once explicit zoom-out restores the phone intro within the 5% near-minimum band, panning no longer dismisses the text or cancels a pending reveal as camera easing finishes. Tiny zoom-in intent/direction still immediately clears the restored state and hides copy; panning cannot reveal it afterward. Initial landing copy retains its sensitive pan dismissal. Work navigation and entering 3D clear restored state. Extend the sensitivity regression to cover large/repeated pans, pans during pending reveal and microscopic zoom-in cancellation.

Further zoom-out after restoration also retains visible copy, including repeated zoom-out at the clamp; only zoom-in dismisses it during map exploration. Add explicit regression assertions for continued zoom-out and the clamped stop.

### Show the initial active service indicator (2026-10-17)

Show the arrow and underline on the selected phone service from initial entry, including the default Full Package choice, matching the supplied reference. Style the existing aria-pressed state without requiring a prior click; selecting Interior Design still moves the indicator and does not create a new section. Work-link selection styling and intro show/hide behavior remain unchanged. Version the stylesheet URL.

### Phone square reset returns to the text overview (2026-10-17)

Set the phone square overview scale to the same near-minimum reveal boundary (map minimum × 1.05), retaining the neighborhood center and 55% vertical placement. Add an explicit overview intent to the intro controller so resetting from either a close view or the furthest zoom-out stop shows the text reliably; ordinary zoom-in remains sensitive and dismisses it. Desktop square reset and initial phone entry framing remain unchanged. Update home framing and phone intro regressions to check the reset scale, text visibility and reset from the minimum.

### Dedicated outline-logo share image (2026-10-17)

The white-filled small favicon used as og:image could look blank against a white WhatsApp thumbnail. Use a dedicated 1254×1254 black-outline logo image on white, prepared from the user-provided reference with the image editing tool and centered with generous whitespace for thumbnail legibility. Point Open Graph, Twitter and WebSite structured-data images to a new versioned PNG URL; declare image dimensions, PNG type and descriptive alt text. Keep tab/app icons unchanged. The generated share asset is a prepared rendition of the reference, not a byte-for-byte original upload. Existing WhatsApp previews may remain cached, and live crawler access cannot be verified in this environment.

User requested a smaller logo after the first draft: use the revised composition with approximately 60% logo height and generous white margins, instead of the tightly enlarged draft.

### Pair phone typography exit motion with entrance (2026-10-17)

Replace the short opacity-only dismissal with a matching 420 ms fade and 7 px upward exit on each text group, retaining the 40–130 ms service/summary/guidance stagger used by the entrance. Parent opacity transitions now use 420 ms instead of 100 ms, allowing the text-group motion to remain visible during dismissal. Zoom/pan intent still changes accessibility and interaction state immediately; trigger thresholds, restored-copy persistence and reset behavior are unchanged. Reduced-motion continues to disable both animations and transitions. Version the stylesheet URL and verify final exit opacity/transform and subsequent entrance replay.

### Raise phone work copy and match neighborhood framing reference (2026-10-17)

Move compact portrait work links/services from the former 136–174 px entry offset into the old search position, 28 px below the header (including safe-area inset); keep the studio summary 82 px below that block. Preserve text sizes and all entrance/exit animations. In smartphone portrait framing, shift the neighborhood's left edge from 18% to 6% of viewport width and its top edge from 32% to 31% of viewport height, matching the supplied Safari reference where the first house row starts further left and the upper-right building is visible. Preserve zoom scale, landscape/tablet framing, desktop framing, square-button text overview and all zoom/drag triggers. Extend device-layout checks to verify the raised portrait text position.

### Prevent iPhone work-copy/description overlap (2026-10-17)

The screenshot is consistent with mixed layout rules: the work block remains at its former viewport-relative offset while the inline description uses the raised offset. Put the authoritative work-block top in the same inline critical layout as the description, with landscape override and safe-area fallbacks. Position the separate description from the actual work/services bottom plus 24 px via ResizeObserver and viewport resize events, covering font changes, text sizing and Safari toolbar/orientation changes without adding layout reads to the render loop. Preserve desktop fixed summary, map framing and all motion/zoom behavior. Add a regression reproducing old stylesheet positioning alongside current HTML, enlarged text, portrait/landscape/toolbar-height changes and reset.

### Restore initial phone framing and copy with the square button (2026-10-17)

User supersedes the near-minimum square overview: the phone square now restores exactly the entry camera and zoom with the opening text. Add an explicit intro-home reset independent of zoom direction, so resetting from a distant view still restores text even though the camera moves closer. Subsequent tiny pan/zoom-in dismisses initial-state text as before; explicit near-minimum zoom-out still restores its pan-persistent copy. Desktop square behavior is unchanged. Verify exact entry pose and visible text after reset from both close and minimum-zoom views.

### Correct control target: brand returns home, square keeps overview (2026-10-17)

User clarified the previous request referred to the top-left brand logo, not the square control. Restore the phone square to the centered near-minimum overview (minimum scale × 1.05) with visible text. Apply initial-frame/text reset intent to brand navigation instead, including return from sections. Preserve ordinary Projects navigation and desktop behavior. Regression checks now distinguish square overview from brand initial camera/text.

### Solid logo previews, favicon and www canonicalization (2026-10-19)

Use the site's existing solid black brand-vector paths to render the supplied solid-logo treatment without redrawing it. Add a 1200×1200 white-background share PNG with approximately 60% logo height, plus versioned solid PNG icons (16/32/48/64/180/192/512), SVG and root ICO/PNG/SVG fallbacks. Point Open Graph/Twitter/WebSite image metadata and favicon/apple-touch links to the new solid assets; preserve page text and website header branding. Retain old versioned assets for cached pages. Reproduce assets with `node scripts/build-brand-assets.mjs`.

Add a Cloudflare Pages `_redirects` host rule for `https://www.jouandbou.com/*` → `https://jouandbou.com/:splat` (301). Canonical, social URL and sitemap already use the apex. This rule becomes effective only when www requests reach the Pages deployment containing it. No Cloudflare credentials are available to inspect or modify custom-domain/DNS associations. Both live-domain requests are blocked here by the environment proxy's CONNECT 403, so the existing discrepancy and live redirect cannot be diagnosed/verified. Existing WhatsApp/Google caches can also differ by hostname.

### Prepared user-image logo rendition for share and search favicon (2026-10-19)

Replace the old site-vector-derived v2 assets with v3 assets derived from a prepared rendition of the latest user-provided solid logo image. The conversation image was accessible to the image-edit tool, not as an original downloadable attachment; the tool prepared a resized rendition, which is retained as the generation source. It is not a byte-identical original upload. The favicon/preview build now resizes that rendition rather than redrawing the old site vector. Keep preview at 1200×1200 with 60% logo height and opaque white background; favicon sizes retain the prior 88% logo-height framing. Update versioned URLs, root ICO/PNG/SVG and apple-touch icon. Remove the old-vector Safari mask-icon declaration; Safari uses the updated ordinary/touch icons instead. Site header branding is unchanged. Google's search favicon update depends on recrawling and cannot be pushed directly from this environment.

### Restore white transparent browser-tab icon for dark themes (2026-10-19)

User clarified the browser-tab mark must retain its prior white transparent treatment. Add the existing original 16/32/48 px white transparent PNG icons as the preferred dark-color-scheme favicon links, with a fresh query version. Keep the latest user-image solid black/white share preview and default light/search favicon declarations. This removes the white square/black mark from dark-themed browser tabs while retaining the requested readable search/share artwork. No logo drawing, header or map change. Verify dark/light media matching, unchanged social metadata and original PNG transparency. Search engines independently select and recrawl favicon candidates.

### Restore white tab PNG independently of system color scheme (2026-10-19)

User still sees the wrong browser-tab icon. The prior restore only matched prefers-color-scheme:dark, which need not match a custom dark browser theme. Make the original transparent white 16/32/48 px PNG overrides unconditional, after the solid default links, and bump their query versions. Preserve share artwork and existing solid fallback assets; search engines independently choose favicon candidates and cannot be guaranteed to use a different icon from browsers. Verify original white icon declarations are active in both light and dark system schemes and that share metadata remains unchanged.

### Separate static favicon metadata from runtime tab preference (2026-10-19)

Replace the eight competing rel=icon declarations with one static 48 px solid black-on-white favicon, consistent with the solid root fallback icons. Add a small independent browser-tab-icon.mjs module that updates the same icon element to the original transparent white PNG for browser tabs in either theme. It runs independently of the 3D app and adds no extra competing links. Share og:image/Twitter and apple-touch assets remain unchanged. No user-agent detection or crawler-specific response is used; a crawler executing JavaScript can see the same white runtime icon, so this is a best-effort separation rather than a guaranteed Google/browser split. Verify JS-disabled static metadata, both JS-enabled themes, one favicon candidate, and the tab icon updating while app.mjs is blocked.

### Public project URLs, static search content and project-specific share metadata (2026-10-19)

Publish 8 documented Jou projects and 7 Bou concepts under /projects/, with a crawlable project directory. Catalog names, facts, descriptions and photographs derive from existing project content; unfinished/model-only houses retain legacy routes. Project pages are generated at build time with unique titles, descriptions, canonical URLs, JPEG Open Graph/Twitter cards, structured WebPage/CreativeWork and breadcrumbs, and readable project text/photographs before JavaScript. The existing full site hydrates into the same modal/Bou detail UI, keeping map/3D/gallery behavior. A small centralized route adapter maps legacy hashes to clean public paths, updates metadata during navigation and restores homepage metadata on return. Add a source-relative base for nested-page assets, real fallback content if scripts fail, sitemap entries and a custom noindex 404. Homepage retains its own metadata, favicon split and layout; its About works section links to the directory. New static files are generated into dist without modifying source during builds. Existing project content and source/asset integrity checks remain.

Project share photos are exported as 1200×630 JPEGs from the existing photographs/illustrations, retaining the full subject with neutral margins. Regeneration scripts are build-project-catalog.mjs and build-project-previews.mjs; deployment builds use the committed catalog and images, without needing Chromium. Search indexing, WhatsApp refresh and production domain/redirect behavior still depend on deployment and external crawlers and are not guaranteed by local validation.

Root and nested documents now share an explicit root base URL so in-app history changes do not retarget relative fetches/images. Internal project anchors expose real public URLs while normal clicks keep SPA navigation; modified clicks can open the static page in a new tab. Development serving now builds and serves dist so public URLs work locally; rebuild after source edits. A custom 404 prevents production unknown paths from falling through to a duplicate homepage. Source sitemap is now included in the integrity manifest.

### Bou Works return origin

Bou Works opened from the smartphone homepage returns to the initial homepage camera and introductory copy when closed. Entry from About Us still returns to About Us. Project close first returns to the Bou index; Escape follows the same origin rules.

### Searchable work collections

Added static /jou-works/ and /bou-works/ collection pages with canonical URLs, descriptions, share metadata, CollectionPage/ItemList schema and crawlable project links. Both hydrate the existing map or Bou index. Listed in the project directory and sitemap.

### Project inquiry links

Added a discreet WhatsApp inquiry link at the end of all 15 published Jou and Bou project stories, including the no-JavaScript static pages. Uses the existing contact telephone +62 811-8111-439 with a prefilled Indonesian message naming the project and its canonical share URL. No messages are sent automatically.

### Persistent project inquiry

Replaced the end-of-story text link with a restrained grey WhatsApp pill fixed to the lower right of each published project view. Jou buttons sit directly in their dialogs to avoid transformed scrolling content; Bou remains scoped to its detail article. Safe-area spacing and bottom content padding preserve mobile access.

Inquiry pill copy: “lets talk~”. Prefilled messages end at “dan ingin konsultasi”, followed by the project URL; removed “untuk proyek saya”.

### Inquiry refresh on existing browser sessions

Versioned the inquiry stylesheet, initializer and shared message module after replacing the original story-end link with the fixed pill. This avoids reusing earlier inquiry assets under the same URLs. Added coverage for map → house → project details with earlier version assets intercepted as stale.

### WhatsApp icon refinement

Replaced the improvised stroked inquiry icon with a standard filled WhatsApp silhouette and handset, keeping its 22px size and grey pill styling. Refreshed the inquiry module version.

### Warmer inquiry message

Updated the prefilled WhatsApp closing to “Boleh ngobrol lebih lanjut?” after the project name, preserving the canonical project URL and lets talk~ button.

### Instagram in project narration

Added “Follow the ongoing story on Instagram” as an inline closing sentence within the final narrative paragraph of published Jou/Bou details and their static SEO pages. Links use the existing @jouandbou studio account, open in a new tab, inherit paragraph typography, and add no floating control.

### First-time smartphone navigation

Added an icon-labelled Search projects action inside the phone menu, with a dismissible search panel. The menu Projects action opens Explore 3D Rumah Anas; programmatic homepage work links and desktop navigation retain their existing map behavior. First-time phone visitors see a light map blur and tap/drag/pinch guide that dismisses on first interaction and is remembered locally. WhatsApp remains scoped to project details.

Phone guidance refinement: removed the old long bottom-left gesture copy on phones. The first-visit guidance uses touch/drag symbols, with equivalent instructions retained for assistive technology.

### Refresh-scoped guidance across devices

Extended the map gesture guide to desktop. Removed persistent dismissal so every fresh page load shows it again, while route changes within a visit do not repeat it after dismissal. Simplified the tap/drag artwork into a small neutral circular hint. Pointer interaction, scrolling, Enter or Escape dismisses the hint and light map blur.

Map guide copy: added visible short instructions alongside the gesture icon, using Tap/pinch on touch devices and Click/scroll on desktop. Refresh and dismissal behavior is unchanged.

Phone menu refinement: removed the Projects house icon and placed Search last after Contact us. Restored the compact standalone rounded search field, removing the extra surrounding panel and adding a brief expanding reveal with eased input motion; reduced-motion is respected.

Opening the hamburger menu fades out homepage work links and studio copy, suppressing their pointer events; closing it restores the current intro visibility without resetting map zoom state.

Hamburger visibility follow-up: explicitly conceal homepage copy via visibility while either menu-open or the toggle expanded state is active, including entrance animation frames. Bumped navigation stylesheet URL to invalidate stale cached CSS.
