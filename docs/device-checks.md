# Cross-device checks

The approved current presentation is the reference: small phone work links and guidance, the same cropped initial map, no phone search, quick intro fade, and copy restored only by explicitly zooming out to within 5% of the furthest zoom-out scale. Desktop keeps its search and navigation. All devices retain distant house silhouettes and selected full-detail models.

Run `npm run build && npm run test:devices`. The matrix covers 320×568, iPhone 13, Pixel 7, 844×390 landscape, 768×1024 and 1024×768 touch tablets, 820×900 and 1024×500 compact desktop windows, 1280×720 laptop, 1440×900 at DPR 2, and 3840×2160 desktop. Each case saves a home screenshot to the Playwright report; run `npx playwright show-report` locally to inspect attachments. These are review references, not pixel-difference golden snapshots.

Run `npm run test:browser` for navigation, map loading, touch gestures, 3D camera transitions, selected-model priority, galleries, project details, reload and SEO regressions. Run `npm test` and `node --test tests/model-queue.test.mjs tests/render-resolution.test.mjs` for asset integrity, lightweight geometry, loading queues and rendering resolution limits.

The cloud browser is Linux Chromium with software WebGL. iPhone/Android device profiles emulate viewport, density and input; they do not run Safari or native Android browsers. Native iOS Safari, Android Chrome, Windows Chrome/Edge and macOS Safari/Chrome still need a hardware check. Do not interpret cloud timings as real-device FPS or claim a CPU percentage saving from these tests.

On hardware, check initial house visibility (including JH30 onward), drag before zooming, small-pan intro dismissal, explicit near-minimum-zoom restoration, reset overview, rotate phone/tablet, enter/orbit/exit 3D, and open/close project details and galleries. Compare the same route and zoom framing; confirm readable text, circular controls, no overlap or horizontal overflow, and no camera jump when detailed geometry arrives.

## Validation record — 2026-10-17

- Build and asset/LOD checks: 5 passed; loading queue and resolution checks: 6 passed.
- Existing browser suite: 45 passed, 1 initialization-wait timeout (desktop search reset). That case passed on an isolated rerun. No search application code was changed in response to the timeout.
- The new 11-case device matrix passed after fixing responsive-policy mismatch and the oversized landscape brand-image box. Home screenshots were visually inspected for small-phone, landscape and Retina desktop framing.
- This work corrects responsive consistency and adds repeatable validation. It does not establish additional CPU/FPS savings or verify a live Cloudflare deployment.
- Final built-site run of the device matrix plus both desktop search tests: 13 passed. The Playwright HTML report from this run contains the 11 home screenshot attachments.
