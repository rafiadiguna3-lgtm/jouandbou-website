# Jou and Bou v143 update for review

Native Sites project: `appgprj_6ab09b8e6ae88191bf61717b47c9d5e2`; verified latest version 143.

Native commit: `b11a057b82e2f9002b280d0658bc1119f02db331`. Retrieved from the native source Git repository; no public frontend reconstruction.

Previous GitHub / rollback commit: `a0eeec7ba4d0f0f3052d3a54898171b4b613bd82`; branch `migration/jou-and-bou`.

## Changes

52 new frontend files, 3 native frontend files updated, 15 existing image files repaired. No files removed. All 1011 native frontend paths retained. 996 files match native source bytes; the only deviations are documented image repairs. Geometry, models, materials, camera code, gestures, video bytes and deployment configuration remain unchanged from native source. Prior source manifest hashes are retained in previous_sources and previous_hashes.

Bou Works now uses native internal #bou-works routes, seven SVG project icons, detail routes, shared header/footer, Bou-only scroll restoration, About return, studio-logo home reset, and legacy #bou redirect. Desktop and emulated-phone regression coverage added.

## All 15 image repairs

All were 0 bytes both in previous GitHub and latest native dist. Exact originals were found at the same relative paths in native source-assets/full-resolution, corroborated byte-for-byte against earlier native Git history. Instagram slide numbers were not inferred. Variants use the existing native Pillow pipeline: RGB, Lanczos thumbnail, WebP quality 80/method 4; no cropping, padding or upscaling.

| Path | Previous condition | Repair/source | Final condition |
| --- | --- | --- | --- |
| `assets/jangkrik/02.fast-1280.webp` | 0 bytes | Responsive variant from `assets/jangkrik/02.webp` | Decoded, 48208 bytes, 1023×1280 |
| `assets/jangkrik/02.webp` | 0 bytes | Exact full-resolution backup; history `ca69e9859c22` | Decoded, 220566 bytes, 1439×1800 |
| `assets/marboy/photos/15.fast-800.webp` | 0 bytes | Responsive variant from `assets/marboy/photos/15.webp` | Decoded, 37340 bytes, 800×533 |
| `assets/rempoa/photos/17.fast-1280.webp` | 0 bytes | Responsive variant from `assets/rempoa/photos/17.webp` | Decoded, 212586 bytes, 1280×854 |
| `assets/rempoa/photos/17.webp` | 0 bytes | Exact full-resolution backup; history `918032a25c1e` | Decoded, 1016218 bytes, 2200×1467 |
| `assets/rempoa/photos/23.fast-800.webp` | 0 bytes | Responsive variant from `assets/rempoa/photos/23.webp` | Decoded, 26824 bytes, 534×800 |
| `assets/rempoa/photos/6.fast-1280.webp` | 0 bytes | Responsive variant from `assets/rempoa/photos/6.webp` | Decoded, 102658 bytes, 854×1280 |
| `assets/rempoa/photos/6.webp` | 0 bytes | Exact full-resolution backup; history `918032a25c1e` | Decoded, 501774 bytes, 1467×2200 |
| `assets/rumah-anas/instagram/CPDa03CAEIb-05.fast-1280.webp` | 0 bytes | Responsive variant from `assets/rumah-anas/instagram/CPDa03CAEIb-05.webp` | Decoded, 102868 bytes, 1023×1280 |
| `assets/rumah-anas/instagram/CPDa03CAEIb-05.webp` | 0 bytes | Exact full-resolution backup; history `8b7b7a2efb97` | Decoded, 316852 bytes, 1439×1800 |
| `assets/rumah-anas/instagram/CPDa03CAEIb-06.fast-1280.webp` | 0 bytes | Responsive variant from `assets/rumah-anas/instagram/CPDa03CAEIb-06.webp` | Decoded, 75994 bytes, 1024×1280 |
| `assets/rumah-anas/instagram/CPDa03CAEIb-06.webp` | 0 bytes | Exact full-resolution backup; history `8b7b7a2efb97` | Decoded, 201322 bytes, 1440×1800 |
| `assets/rumasoka/02.fast-800.webp` | 0 bytes | Responsive variant from `assets/rumasoka/02.webp` | Decoded, 21056 bytes, 800×625 |
| `assets/rumasoka/instagram/CyI8miRJmG0-04.fast-1280.webp` | 0 bytes | Responsive variant from `assets/rumasoka/instagram/CyI8miRJmG0-04.webp` | Decoded, 204514 bytes, 1280×1280 |
| `assets/rumasoka/instagram/CyI8miRJmG0-04.webp` | 0 bytes | Exact full-resolution backup; history `b73940ab2039` | Decoded, 358386 bytes, 1440×1440 |

Full repair provenance, hashes and historical mapping: [image-recovery-v143.json](image-recovery-v143.json). No unresolved original photos remain. The supplied Marboy Drive folder returns 404 and external Instagram/studio-site access is blocked, but native exact originals made those sources unnecessary.

## Validation

### PASS

- native source fetch, exact commit verified, git fsck
- 996 native frontend files match unchanged; only 15 repaired images differ
- npm run build
- npm test: 4/4
- npm run test:deployment-config: 2/2
- npm run test:browser: 6/6, desktop/mobile Bou routing and scroll restoration included
- 754 raster/SVG images parsed or decoded; no empty image files
- 396 responsive variants: thumbnail dimensions and source-image similarity verified using full-resolution sources for existing variants and documented bases for repairs
- 48+ JavaScript modules: syntax checks
- Marboy and Rempoa film streams: all 75 fragments reconstructed and ffmpeg decoded

### FAIL

None.

### BLOCKED

- Safari/iPhone real device behavior not tested
- External YouTube embed, fonts, map tile delivery not verified: network allowlist excludes external hosts
- Hosted Cloudflare preview browser checks: pages.dev blocked by network policy; GitHub deployment bot status will be checked after push

Audit details: [asset-validation-v143.json](asset-validation-v143.json). Existing asset tests are unchanged; no failures hidden or checks weakened. Responsive validation initially compared already-downscaled runtime originals; using the actual native full-resolution sources eliminates double-resize rounding discrepancies.

## Cloudflare preview

The existing Cloudflare Pages `jouandbou-test` integration already deployed previous branch commit `a0eeec7` successfully, as confirmed by the Cloudflare bot on Draft PR #1. Pushing this branch is expected to trigger its next preview; no duplicate manual deployment will be started. No Cloudflare credentials are configured in this environment. Preview status/URL must be confirmed from the bot after push; this report does not claim hosted verification.

1011 frontend files exceed dashboard drag-and-drop limit (1000), but fit Git integration/Wrangler Free limit (20000). Largest file remains 2 MiB, below 25 MiB. Existing Git integration avoids manual upload limits.

Draft PR #1 remains open/unmerged. Main, Sites live, DNS, custom domains and production branch settings are unchanged. This is an ongoing review update, not a final release.
