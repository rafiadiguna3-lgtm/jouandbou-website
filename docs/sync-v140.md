# Sites version 140 synchronization for review

Original project: `appgprj_6ab09b8e6ae88191bf61717b47c9d5e2`

Verified Git commit: `16b2866125df9e87baa2186d50b6a98430aed02d` (fetch succeeded; Git fsck passed).

Rollback GitHub commit: `5c51f031311d3fd1b81a374294925075b36ce5e4`.

SHA-256 comparison: 74 added, 104 modified, 781 unchanged, 0 removed. All 959 original dist files are synchronized byte-for-byte. No legacy-only files were found; no files were deleted. Deployment configuration and Git history are preserved. Previous source hashes and provenance remain in source-manifest.json.

No merge, deployment, Sites live changes, domain/DNS changes, redesign, or placeholders. This is an update for review, not a final release.

## Empty source images

These 15 images are 0 bytes in the original commit and remain unchanged:

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

## Validation

### PASS

- original source fetch and Git fsck
- 959 site and built dist files match original SHA-256
- npm run build
- original npm run check
- asset hashes, 25-house GPU/software geometry, film fragments (3 tests)
- deployment configuration and production guard (2 tests)
- desktop/mobile browser regressions (4 tests)
- original QA: dialog recovery, film lifecycle, model cache, model queue, orbit pivot, progress viewer (6 scripts)


### FAIL

- responsive photograph asset test: 15 original zero-byte images
- original qa/photo-memory-v85.mjs: ReferenceError matchMedia is not defined; Node harness lacks browser global


### BLOCKED

- hosted staging regression: no deployment performed or staging URL supplied
- live-reference comparison: live Site host is outside configured network allowlist; local browser regressions passed


Source dist tree SHA-256: `8db0c45de53b0565c04e788fd3127d88ba23618cade1a6a43375d6e80ffaf71b`. Hash format: sorted compact JSON mapping relative paths to SHA-256.

Commit scope: 178 site files plus source manifest and this report (180 files total). All deployment files, package inputs, test code, and Git history remain unchanged.

