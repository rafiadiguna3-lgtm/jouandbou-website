// Cloudflare Worker: only attach to the two exact /favicon.ico routes.
const ASSET_ORIGIN = 'https://jouandbou-test.pages.dev';
const BLACK_ICON = '/assets/brand/jou-and-bou-solid-48-v5.png';
const WHITE_ICON = '/assets/brand/jou-and-bou-white-48-v143.png';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname !== '/favicon.ico') return fetch(request);
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response(null, {status: 405, headers: {Allow: 'GET, HEAD'}});
    }

    const userAgent = request.headers.get('User-Agent') || '';
    // This only chooses a public image; it does not authenticate the caller.
    // Cloudflare's verified bot signal is optional, depending on the account.
    const crawler = request.cf?.botManagement?.verifiedBot === true ||
      /Googlebot|Google Favicon|GoogleOther|Google-InspectionTool|bingbot|DuckDuckBot|Applebot|facebookexternalhit|Twitterbot|LinkedInBot/i.test(userAgent);
    const upstream = await fetch(new URL(crawler ? BLACK_ICON : WHITE_ICON, ASSET_ORIGIN), {
      method: request.method,
      redirect: 'error',
      cf: {cacheEverything: false, cacheTtl: 0}
    });

    const headers = new Headers({
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store, max-age=0',
      'CDN-Cache-Control': 'no-store',
      'Cloudflare-CDN-Cache-Control': 'no-store',
      Vary: 'User-Agent',
      'X-Content-Type-Options': 'nosniff'
    });
    if (!upstream.ok) {
      return new Response(null, {status: 502, headers});
    }
    return new Response(request.method === 'HEAD' ? null : upstream.body, {
      status: 200,
      headers
    });
  }
};
