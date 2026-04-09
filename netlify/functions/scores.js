// Netlify serverless function: /.netlify/functions/scores
// Proxies ESPN golf scoreboard API server-side to avoid CORS issues
// Deploy this file to netlify/functions/scores.js in your repo

export default async (req, context) => {
  const ESPN_URLS = [
    'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?limit=100',
    'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard',
  ];

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.espn.com/golf/',
    'Origin': 'https://www.espn.com',
  };

  let lastError = '';
  for (const url of ESPN_URLS) {
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) { lastError = `HTTP ${res.status}`; continue; }
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    } catch (e) {
      lastError = e.message;
    }
  }

  return new Response(JSON.stringify({ error: 'upstream failed', detail: lastError }), {
    status: 502,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};

export const config = { path: '/.netlify/functions/scores' };
