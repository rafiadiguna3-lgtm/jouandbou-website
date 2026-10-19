# www and canonical domain

Canonical website: `https://jouandbou.com/`. The Pages build contains `_redirects` with a permanent www → apex redirect preserving the path. Keep both `jouandbou.com` and `www.jouandbou.com` attached to the same production Cloudflare Pages project. A www hostname pointing to another deployment/project does not receive this repository's redirect rule.

After deployment, verify `curl -I https://www.jouandbou.com/` returns 301 with `Location: https://jouandbou.com/`, and test a real asset path. Cloudflare should retain query strings when the destination does not explicitly replace them. Check that the new solid share image and 48 px icon return HTTP 200 with `image/png` from the apex. Check the production Pages deployment uses `migration/jou-and-bou` and includes the latest commit.

If www still serves different HTML, inspect Pages → production project → Custom domains, then the www DNS record. Both custom domains must be active for the intended project; DNS alone does not attach a hostname to Pages. If redirecting and assets work but old previews remain, WhatsApp/Google may still be using cached metadata/favicon and update on their own schedule. Existing sent messages need not update.

Cloud execution cannot verify the live domains because its network proxy rejects both requests with CONNECT 403. No Cloudflare credentials are available here, and no DNS/custom-domain setting was changed. Browser-emulated metadata tests and local assets do not establish a working live redirect.
