# Homepage explore workload reduction for review

Reports: slight stutter while dragging, smaller stutter during zoom, and placeholder massing visible while detailed models load on first visit.

Changes in app.mjs only: write label positions/visibility and model-status text only when changed; skip projection for noninteractive/hidden labels; reuse the pointer-media result inside each animation frame; defer background geometry queue until drag momentum or wheel zoom settles, then resume automatically. No changes to model assets, geometry, materials, pixel ratio, camera easing, gesture sensitivity, design or deployment settings.

Local Chromium/SwiftShader probe used the same 45-step homepage drag and 500 ms settling window. Before: 2388 observed label DOM mutations, 106 model-status mutations. After DOM optimization: 251 label mutations, 0 model-status mutations. Counts are diagnostic samples affected by frame scheduling and model loading; they are not FPS measurements or a real-device performance guarantee.

Cold startup still progressively replaces lightweight massing with detailed model assets. This patch does not claim to eliminate first-visit model loading or the initial placeholder appearance. Actual load latency and GPU performance on the user's device remain unmeasured. Background model preparation is intentionally delayed during interaction, prioritizing responsive gestures.

Validation: build and 4 asset tests pass. Browser suite additionally verifies that wheel and drag pauses resume and that Marboy remains selectable/loadable. Full browser results are recorded in source-manifest.json after completion. Real Safari/iPhone and hosted-browser performance remain untested due to device/network limits.

Rollback commit: 51ff3e778e31aa8529f025dcd5d4f6dfa5876447. Previous/native hashes are preserved. This is an ongoing review update, not a final release.

## Desktop model priority and high-density rendering

Selected houses now have one reserved queue lane beyond the two desktop
background lanes (one on touch devices). A selected house can start while
background downloads are occupied or paused; repeated render requests do not
start duplicates. Selected geometry fetches use high priority and background
geometry uses low priority. While a focused 3D model is displayed, other queued
models and pending background scene additions wait until returning to the map.
This avoids spending CPU/GPU upload time on invisible houses during orbit.

Indexed opaque ranges reuse a conservative sphere from the authored model
bounds. Transparent ranges retain their individual bounds and sorting. All
vertices of all 25 GPU assets are checked against the replacement sphere.
A local Node microbenchmark (three repetitions over the 25 assets) reduced the
opaque bounding work from 3,567,009 vertex visits / 74 ms to no vertex scans /
less than 1 ms. This measures only that CPU operation, not end-to-end loading.

Desktop render density targets at most 4 million pixels, with a minimum scale
of 0.75 for large displays and the existing maximum of 2. Ordinary-density
1080p screens are unchanged. A 1920x1080 Retina canvas goes from about 8.29 to
4 million pixels; 3840x2160 at native density goes to about 4.67 million.
Antialiasing is retained. This trades some high-density 3D sharpness for lower
GPU fill cost; HTML/UI resolution and the existing phone density cap are unchanged.
Density is recalculated on resize, including changes between monitors.

A browser regression holds the first two background model downloads indefinitely
and verifies that selecting Flute still reaches a loaded 3D view before they
are released. Queue tests cover concurrency bounds, duplicate selection,
pausing, resuming, and readiness after failures. Desktop and phone project
interaction tests also run. One initial drag-resume check exceeded its 15-second
poll window under local software rendering; a diagnostic run and isolated rerun
completed successfully. These checks do not measure native Windows/macOS GPUs.

The GPU model set is approximately 14.93 MiB compressed on a cold visit.
A read-only request to the public domain was blocked by the environment egress
proxy (CONNECT 403), so DNS, CDN caching, public network latency, and deployed
performance have not been measured or changed.
