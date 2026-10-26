// Self-contained favicon Worker: no upstream fetch, binding, or secret required.
const BLACK = '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';
const WHITE = 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEbklEQVR42tWaS6gcRRSG/zM9RhMTlRtdKRrwEnFljITEBz7ABNcK4kYiKuhGcOMmBLL0sVJBwaAgKOEGUTABMSJXQVASowtFiY9AFFSQ4CPGXJPp6c/NKazbdM/0cy42DDXTU139/1Wnz/lPnTb1fAAmyeJTZkZX41tPoBNJZmbphP8lKWtLxnoAvgwUMCfpEkkDSaclnYyJAYmZjVecQAwEuE3SPZJulrRB0jonsCTpZ0mfSXpb0kEzO+Nmpi5Nq5aNBwDAHcCHVD++Ax6OxhqsJPinImBjYORtlvuMgdQ/4TgIXDZTEg4+AQbA/gh4WmMFAlGAr4ErZkYieBLgFQdwlubHOW+/BNb5pNgswD+QA0AHJF7Pudp+7B5YD5x0MxjXBJuWXBPM6c6qJJrYWuLu7lFJ6yVlDcZJSq4xSUjaE+arrxUYAt9EXqXqkXl7APg0dy7ukwHXdf5Ah8GATdGN6oJfCsEuMqciM9rl/YZdmlDof70vdxMJkAGrJZ03RR1srWJGTZdnQ8vFzCYACwSucnkx7oPA2hnEygsjd21dE5hJsK8iNocNH2TrANw081pd56GsDNzMMknnWgD/S9JI0lwBmbFPaiLpPTNLgcEkmT2sCt6BZ8C8pCsb5BMB3CdmBnBTwcwnko5IekHSPrf9dsEs8v3XAIcairZRFDc2u4o9ESnSEAyf7lTEBVUIXA78VDNojSLgIWA95OM+Hp0LgWwhuuewKwJDb1/0m/zTUGkuAjf6WLcAZ6KZD2SvdfBJV+AtmpFjFXVPmO3fgeeAJ4Bt0Zh3A79FfcN4x6PJspUkEMzhUIEp3lfQrzWBUjfqnmLo3mfRPc6oqlx2xboV2GFmmZktSLpL0q/ubYIMx2XDRncYg5V8iMPMLvr1L/nvj6Mk5QbgVGT/4Zr9nT/EOTe6EXh3ihvNE3g2Z3aP+flHSkzpmV4S+nhQ4GpgX4mWzxN4PuQAEchtvqrf58CH9giw003Qpj0TldiaWeZLu8rMjkv6sWbKN3Sbl6TdLg3eiiJwwDKWtEXSq5L2er/2BAIJlxIDSaua5NLebvFZPVwgRxJJqRPZHpxIp3LaibTRJ2s9G/tjAqbE91G7U6MdH1ZBCFYSck0JnK4BlAY5gST9HdLJSXK6KYETFSfmbJT8Z97ibTKF2A9VNrfqEgge43O/UVKSkM/7w/6G/z7f+yZeE0glbS5ZifD7cB9FmCobWyEWPOj97wWOut7ZC6wBLiiIA/1vbOUk9q7cRhQ5lfknsKPg+jXAmyXgU7/+o6rgrckK+Nc5Scei3HZQsKOApAVJ70g6JWmTpPslzZfsqaYe9Lab2ftt62dVttd3Tthez6YUNsq211/rdXu9gMTLU0iMotRxNAX8FzMpcBSUmBY6KDF9NdMSU1zs8O9PtijyHQAunSn4HImQM9wOfFBjBb4NOxVNwfdV6L5VywvdF/m9liT9Iumo/it0L7UpdM/qVYOLtfxVg3ER8aaqsC8P9f972WNC4OvtdZt/AXJaZqCe11LTAAAAAElFTkSuQmCC';

export default {
  async fetch(request) {
    if (new URL(request.url).pathname !== '/favicon.ico') return fetch(request);
    const headers = new Headers({
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store, max-age=0',
      'CDN-Cache-Control': 'no-store',
      'Cloudflare-CDN-Cache-Control': 'no-store',
      Vary: 'User-Agent',
      'X-Content-Type-Options': 'nosniff'
    });
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      headers.set('Allow', 'GET, HEAD');
      return new Response(null, {status: 405, headers});
    }
    const userAgent = request.headers.get('User-Agent') || '';
    // Classification chooses a public image, not authorization.
    const crawler = request.cf?.botManagement?.verifiedBot === true ||
      /Googlebot|Google Favicon|GoogleOther|Google-InspectionTool|bingbot|DuckDuckBot|Applebot|facebookexternalhit|Twitterbot|LinkedInBot/i.test(userAgent);
    const bytes = Uint8Array.from(atob(crawler ? BLACK : WHITE), c => c.charCodeAt(0));
    return new Response(request.method === 'HEAD' ? null : bytes, {status: 200, headers});
  }
};
