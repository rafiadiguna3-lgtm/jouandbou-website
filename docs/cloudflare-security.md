# Public-site security

The website deploys only dist/. The build validates site/ before copying and dist/ after generation, rejecting environment files, VCS internals, private keys, backups/database dumps and symlinks. Run `node --test tests/public-files.test.mjs` to validate the guard. Public browser JavaScript must never contain secrets; this filename guard does not detect credentials embedded in normal assets.

## Cloudflare edge rule (account change, not enabled by this repository)

In the jouandbou.com zone, open Security → WAF / Security rules → Custom rules. Create a rule named “Block secret-file probes”, action **Block**, expression:

```
(http.host in {"jouandbou.com" "www.jouandbou.com"} and
 (lower(http.request.uri.path) contains "/.env" or
  lower(http.request.uri.path) eq "/.git" or
  lower(http.request.uri.path) contains "/.git/"))
```

This targets scanner paths rather than challenging all visitors. It does not block /.well-known/, static photos, project pages, Google crawlers or WhatsApp previews on normal public paths. Do not block an entire country or all bots based on the traffic screenshot.

After enabling, request /.env, /app/.env.local and /.git/config: expect edge 403. Before the rule they should return 404 without file contents. Verify /projects/rumah-anas/ and its OG JPEG return 200 without a challenge, and www preserves the project path when redirecting to the apex. Review Security events for the named rule. Cloudflare-managed certificate verification requests should remain untouched.

Enable managed WAF rules available on the account if not already active, and enable two-factor authentication for Cloudflare and GitHub accounts. No account settings were changed from this workspace. Live production responses remain unverified where network access is unavailable.
