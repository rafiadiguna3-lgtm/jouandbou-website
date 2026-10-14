# Restrained house-camera transitions for review

Previous flights completed most travel in the early part of a 340–460 ms critically damped curve. The prescribed zoom/orientation on clicks and Next, and the fixed 1.15 exit zoom, are intentional and retained.

Camera flights now use a monotonic quintic curve with zero velocity/acceleration at the endpoints, logarithmic zoom and shortest-angle yaw. Duration adapts to projected travel, zoom ratio and pitch change, bounded to 450–1100 ms. No extra arcs, bounce or overshoot were added.

Selecting/browsing another house centers it at the original prescribed overview zoom: 1.25 on desktop or 0.9 on phone, yaw -0.57 and pitch 0.61. Leaving 3D returns around the selected house at zoom 1.15 with the original orientation. Only the transition curve/timing changes; the target distances match the prior behavior. Manual drag/pinch/wheel sensitivity, model geometry/materials, dimensions and photo/video interactions are unchanged. Reduced motion still bypasses camera flights.

The Explore 3D action now preserves the overview URL; only opening actual project details records #project/name. Deep links and Back/Forward remain covered by regression tests.

Verification: unit tests check bounded/no-overshoot movement at three zoom scales, shortest rotation, soft endpoints and interrupted-flight continuity. Browser coverage checks the original Next-house and exit target distances when starting at far/medium/near levels, alongside existing routing/gallery/navigation regressions. Feeling of motion on real Safari/iPhone or the user's GPU remains unmeasured.

Rollback commit: 580d344bc490a3e441ed45e36a38248f418ddd57. Native/previous hashes retained. No main, Sites live, domain/DNS or deployment settings changes. Draft PR #1 stays unmerged; automatic Cloudflare preview only. Review update, not a final release.

Validation: build PASS; asset suite 4/4 PASS; camera-flight unit tests 4/4 PASS; existing browser suite 17/17 PASS, followed by routing/gallery 3/3 and new camera behavior 1/1 PASS. The camera browser test uses a test-only runtime goal probe, targeted wheel events and visible house-callout controls; no production debug globals are added. Earlier test setup timeouts came from hidden legacy zoom/Explore controls and stale render sampling, corrected without dropping the zoom-preservation assertions.

User correction: fixed click/Next/exit target distances are intentional. The earlier preserve-current-zoom behavior was reverted; soft easing remains. Target-distance regression test updated accordingly.

## Selected-house anchor and keyboard correction

Camera position is now reconstructed from the selected model pivot and its smoothly interpolated projected position. That pivot follows a straight screen-space path instead of an arc caused by simultaneous world-coordinate translation, zoom and orientation interpolation. The original target position, zoom and orientation are retained exactly. No added orbit, bounce, sway or intermediate zoom target. Timing is bounded to 450–1100 ms and adapts to travel, zoom and necessary rotation.

Overview ArrowLeft/ArrowRight now uses the same centered target as clicking or Next, including the original prescribed zoom. Keyboard orbit inside explore 3D is unchanged. New unit coverage checks the straight projected path and exact endpoint retention; browser coverage checks keyboard targets at multiple starting zoom levels.

Latest validation: build PASS; assets 4/4 PASS; camera unit tests 5/5 PASS; targeted browser suite 5/5 PASS including overview keyboard Right/Left reaching the same prescribed target as clicks, original Next/exit distances, and existing desktop/mobile/3D/video routes. Background pause/resume test also PASS. Subjective motion comfort on real devices is still for user review.
