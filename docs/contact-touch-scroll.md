# Contact map touch scroll fix for review

Single-finger dragging on the mobile Contact Us map used to move the map instead of scrolling the contact page. The vector MapLibre map now enables cooperative gestures. The raster Leaflet fallback disables single-pointer dragging on primary coarse-pointer devices while retaining native two-finger pan/zoom. Desktop mouse drag remains enabled; ordinary wheel scrolling still belongs to the page and ctrl/pinch zoom remains supported.

Browser verification uses actual bundled map libraries with a local empty vector style and aborted external raster tile requests; it tests interaction handling independently from external tile availability. Chrome DevTools touch events verify single-finger vertical swipes scroll the contact page without moving the map, two-finger pinch changes map zoom, and two-finger dragging moves the map, for both vector and raster backends.

No geometry, materials, layout, photo/video assets, deployment settings, domain/DNS or Sites live changes. Draft PR #1 remains unmerged. Safari/iPhone hardware and real external map tiles remain untested. Review update, not final release.

Rollback commit: 3f888a19d6ee01a4c7bd37e306d1f792cc6e4dd7.

Validation: build PASS; asset suite 4/4 PASS; all 14 browser cases verified. Initial Leaflet two-finger pan assertion started during its prior pinch animation; waiting for animation completion fixed the test timing, without weakening the pan assertion. Focused vector/raster gesture rerun: 2/2 PASS. Existing remaining browser tests passed.
