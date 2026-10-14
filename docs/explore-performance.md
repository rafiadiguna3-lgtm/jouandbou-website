# Homepage explore workload reduction for review

Reports: slight stutter while dragging, smaller stutter during zoom, and placeholder massing visible while detailed models load on first visit.

Changes in app.mjs only: write label positions/visibility and model-status text only when changed; skip projection for noninteractive/hidden labels; reuse the pointer-media result inside each animation frame; defer background geometry queue until drag momentum or wheel zoom settles, then resume automatically. No changes to model assets, geometry, materials, pixel ratio, camera easing, gesture sensitivity, design or deployment settings.

Local Chromium/SwiftShader probe used the same 45-step homepage drag and 500 ms settling window. Before: 2388 observed label DOM mutations, 106 model-status mutations. After DOM optimization: 251 label mutations, 0 model-status mutations. Counts are diagnostic samples affected by frame scheduling and model loading; they are not FPS measurements or a real-device performance guarantee.

Cold startup still progressively replaces lightweight massing with detailed model assets. This patch does not claim to eliminate first-visit model loading or the initial placeholder appearance. Actual load latency and GPU performance on the user's device remain unmeasured. Background model preparation is intentionally delayed during interaction, prioritizing responsive gestures.

Validation: build and 4 asset tests pass. Browser suite additionally verifies that wheel and drag pauses resume and that Marboy remains selectable/loadable. Full browser results are recorded in source-manifest.json after completion. Real Safari/iPhone and hosted-browser performance remain untested due to device/network limits.

Rollback commit: 51ff3e778e31aa8529f025dcd5d4f6dfa5876447. Previous/native hashes are preserved. This is an ongoing review update, not a final release.
