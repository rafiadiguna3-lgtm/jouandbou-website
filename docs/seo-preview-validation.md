# SEO preview validation and provenance

Production branch: `migration/jou-and-bou`. Proposed SEO branch: `fix/seo-production-20261017`.

## Intentional homepage changes

- SEO title, description, Open Graph and Twitter metadata.
- `max-image-preview:none` robots directive (Google retains discretion over display).
- Existing 48px white favicon prioritized without changing the underlying image.
- New `site/robots.txt` and homepage-only `site/sitemap.xml`.
- Canonical remains `https://jouandbou.com/`.

## Build provenance

The migration's `docs/source-manifest.json` contains captured-source SHA-256 hashes and intentionally rejects modified source files. The approved SEO homepage differs from that historical capture. The build script accepts **only** the exact reviewed `site/index.html` Git blob SHA `804acb0e6b9bb3e4ccd00d3707318712201c0cb5` while still verifying all other manifest entries. Any further homepage edit must receive a new explicit review and hash update. This is a scoped exception, not a disabled provenance check; the historical capture manifest is left unchanged.

## Preview validation

Cloudflare Pages preview: https://fix-seo-production-20261017.jouandbou-test.pages.dev/

The user confirmed the preview looked and worked normally on 2026-10-17. Build status was reported successful. This does not independently prove search engine display behavior or every runtime route.

Do not merge until the repository owner explicitly approves production deployment.
