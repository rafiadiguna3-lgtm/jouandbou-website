# SEO production change record

Base: latest `migration/jou-and-bou` (including production commit `e86cb49`).

Changes: homepage title, description, social metadata, existing white PNG favicon priority, `max-image-preview:none`, robots.txt, sitemap.xml. Canonical remains `https://jouandbou.com/`.

The source manifest records the reviewed homepage and title-handler changes, preserving original published hashes and byte sizes. The build and asset tests strictly check every recorded file against its SHA-256. The title handler preserves the SEO homepage title after initialization and navigation while retaining section-specific titles.

Validate Cloudflare preview and browser interactions before merging. Google may rewrite titles/snippets and controls search thumbnails and favicon updates on its own crawling schedule.

