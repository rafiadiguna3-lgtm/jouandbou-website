# Restrained house-camera transitions for review

Previous flights completed most travel in the early part of a 340–460 ms critically damped curve. Next-house browsing also forced a fixed zoom/orientation, and exiting 3D returned to a fixed 1.15 zoom regardless of the user's previous overview.

Camera flights now use a monotonic quintic curve with zero velocity/acceleration at the endpoints, logarithmic zoom and shortest-angle yaw. Duration adapts to projected travel, zoom ratio and pitch change, bounded to 380–680 ms. No extra arcs, bounce or overshoot were added.

Selecting/browsing another house in overview keeps the user's zoom and orientation while centering the selected house. Entering 3D remembers the overview zoom/orientation; leaving 3D restores those settings around the selected house instead of forcing a new zoom. Manual drag/pinch/wheel sensitivity, model geometry/materials, dimensions and photo/video interactions are unchanged. Reduced motion still bypasses camera flights.

The Explore 3D action now preserves the overview URL; only opening actual project details records #project/name. Deep links and Back/Forward remain covered by regression tests.

Verification: unit tests check bounded/no-overshoot movement at three zoom scales, shortest rotation, soft endpoints and interrupted-flight continuity. Browser coverage checks Next-house zoom preservation and return from 3D at far/medium/near levels, alongside existing routing/gallery/navigation regressions. Feeling of motion on real Safari/iPhone or the user's GPU remains unmeasured.

Rollback commit: 580d344bc490a3e441ed45e36a38248f418ddd57. Native/previous hashes retained. No main, Sites live, domain/DNS or deployment settings changes. Draft PR #1 stays unmerged; automatic Cloudflare preview only. Review update, not a final release.

Validation: build PASS; asset suite 4/4 PASS; camera-flight unit tests 4/4 PASS; existing browser suite 17/17 PASS, followed by routing/gallery 3/3 and new camera behavior 1/1 PASS. The camera browser test uses a test-only runtime goal probe, targeted wheel events and visible house-callout controls; no production debug globals are added. Earlier test setup timeouts came from hidden legacy zoom/Explore controls and stale render sampling, corrected without dropping the zoom-preservation assertions.
