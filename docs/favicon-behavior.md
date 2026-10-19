# Favicon and share behavior

- Initial HTML declares one `#site-favicon`: solid black on white, 48×48 PNG. Root ICO/PNG/SVG use the same solid treatment.
- `browser-tab-icon.mjs` updates that existing link to the original white transparent 48×48 PNG. The module loads separately from the 3D app, in light and dark system themes.
- `og:image`, Twitter image and WebSite image point to the 1200×1200 user-image rendition on white. Apple-touch remains its solid 180×180 PNG.

This removes competing static candidates. There is no special response based on user agent. A crawler reading initial HTML sees the solid icon; a crawler rendering JavaScript can observe the same white runtime preference as a browser. Google controls favicon selection and cache refresh; code cannot guarantee a separate Google icon. Requesting homepage recrawl in Search Console may help discovery after the deployment is confirmed, without guaranteeing timing or selection.

Run `npm run build`, `npm test` and `npx playwright test tests/browser/metadata.spec.mjs`. Tests verify metadata and DOM updates, not native tab chrome or Google's results. Production and www redirect still require live verification.
