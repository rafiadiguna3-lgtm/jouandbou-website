# SEO production change record

Base: latest `migration/jou-and-bou` (including production commit `e86cb49`).

Changes: homepage title, description, social metadata, existing white PNG favicon priority, `max-image-preview:none`, robots.txt, sitemap.xml. Canonical remains `https://jouandbou.com/`.

The original source-manifest records the historical migration snapshot. The build guard accepts only the exact reviewed SEO `site/index.html` Git blob `74f7f6ee055096ef9f912edb21af7f83040c331b`; all other captured files continue to be SHA-256 checked against the manifest. Any future homepage edit requires explicit review and updating this pinned blob.

Validate Cloudflare preview and browser interactions before merging. Google may rewrite titles/snippets and controls search thumbnails and favicon updates on its own crawling schedule.
