# Project detail URLs and gallery controls for review

Opening project details now records a specific hash URL, for example #project/rumah-anas, #project/rumahsoka, #project/marboy, #project/rempoa-padel. Names are normalized to lowercase hyphenated slugs. All 25 interactive houses have a slug. Hash routes retain static hosting compatibility without changing deployment or domain settings.

Direct links and reloads select the matching 3D model and open its existing detail panel. Browser Back closes details, Forward reopens them, and normal close returns to #projects while retaining the selected model. Unknown project names return to #projects. Initial project routing uses the existing visibility guard to avoid showing homepage content before details are ready. Navigation closes any active full-size photo viewer as well.

Multiple-photo sliders/ribbons and Bou image galleries now have previous/next overlays. Touch screens show these controls permanently; desktop shows them on hover or keyboard focus. Single-photo sections get no controls. Existing photo order, alt text, swiping, keyboard navigation and image sources remain unchanged. Full-size photo viewer arrows are also available again.

Rollback commit: 70c8903630853cea7a9b1903a73806cf93365eaf. Prior/native hashes remain in source-manifest.json. No Sites live, main, domain/DNS or deployment configuration changes; Draft PR #1 stays unmerged. Automatic Cloudflare preview only. This is an ongoing review update, not a final release.

Verification includes nine direct project detail routes, reload, browser Back/Forward, normal close, mobile arrow visibility/photo advancement and desktop hover visibility. Real Safari/iPhone hardware and hosted-browser checks remain untested.

Validation: build PASS, asset suite 4/4 PASS, browser suite 17/17 PASS, syntax and diff checks PASS.
