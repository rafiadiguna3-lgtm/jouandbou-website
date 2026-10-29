// Self-contained favicon Worker: no upstream fetch, binding, or secret required.
const BLACK = 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAADZUlEQVR4nOyZTSxjURTHz9MytEREE19BgkR8pbOzQMZWSDCWoxNTEhESxpKNLtizkIhJ2oXEWAglsUOMpZiQMO0E8waDRQ064qvVvjlR4fV12nfvbWW6eL/dvff0vH/vu+fjtmpBECCaiIEoQy0eeL1e+K/EIBBlKILkUATJoQiSQw1hc3FxMTw8vLS05Ha7MY/k5ub29/cXFRVxHAf0cOLSQZsY3S73gGlgZGTk+vrazynH1dTUoMq8vDygAb8Pu6Cbm5vy8vLt7e1gBhqNZnX1i17/mnyr2AXd39+XlJTs7u7KWh4cHGRlZQEZ7KVjZmaGRA3S2NBA1VCw7NDt7W16evrl5WVQp9yzWw649a/rer0eCGDcIbvdHkKNyWTq6+t7GgogrK2tATEsghyO0xCriYmJCQkJ4pk56xwQw5KHzs5+h1oOODD7+/tATAQSowQBwuqJI186MjIyTk+f3yke8J6PPeQfpxN0fn7e2dnZ29sbzCAtLa2ysnJlZcU3rKio2NraamlpAWLowr6pqWl2djbYanZ2ttVq3djYMBqNOExOTnY4HCqVCoihC3uUPj8/HzivVqvr6+stFgv/g9/b22tvb/fNYyqnUvPojco6Li4OS5hksqCgYHp6GnfX4/WMjY1hzffNB1qSQLFDeDy7urr+uXR4eJiZmdna2jo1NfV0Ymw229HRL3g5QcjQ0NCn8fGqqirJvMfjwciamJgwGAyDg4MYaPBQYcrKysxms6Q5iaQgPHMfjMaOjg7xpLi7WFhY2NzcrK2t9Q2dzj9tbW3Yr5HnpkgkRsEvO3+323NycsTri4uLQNw8RkKQ/8M8Xq8keKlimUVQSkqKeIjxFaN6fiRmAUk+Ky0tBWJYSodOpxMPMcRiY2MxFcFDMqx+U22zfRMb1NXVATEsDRomGCwRV1dX4kdiiJ2cnGCyXl5eRnFPrvB9Yf+Un59P4pm9p/48OfmuuVniC9MB9vziyooYDO8tFjOQwS7I5XIVFxfzPB/aTKPRHh8fJSUlAbEgxvYDawgW0cLCwhA2eNn4yfPkah41ASvYqqKm7u5uvH9JlrRaLRaZnZ2dVF0qUBLWzdWH0+kcHR3Fi9Hd3V38q/jGt43YM9FujI+wbq4vgfIbIwGKIDkUQXJEnSBO+TdIhr8AAAD//4Mo92QAAAAGSURBVAMAHJJtc0tl2rsAAAAASUVORK5CYII=';
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
