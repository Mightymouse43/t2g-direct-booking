/**
 * GET /api/properties
 * Proxies OwnerRez v2 properties list to the client.
 * API token stays server-side — never exposed to browser.
 *
 * OwnerRez rate limit: 300 requests per 5 minutes.
 * Cache-Control: s-maxage=300 keeps Vercel CDN caching for 5 min.
 */
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(200).end();
  }

  const token = process.env.OWNERREZ_API_TOKEN;
  const email = process.env.OWNERREZ_EMAIL;
  if (!token || !email) {
    return res.status(500).json({ error: 'OWNERREZ_API_TOKEN or OWNERREZ_EMAIL is not configured' });
  }

  // OwnerRez Basic auth: base64("email:TOKEN")
  const credentials = Buffer.from(`${email}:${token}`).toString('base64');

  try {
    const orRes = await fetch('https://api.ownerrez.com/v2/properties', {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!orRes.ok) {
      const text = await orRes.text();
      console.error('[api/properties] OwnerRez error:', orRes.status, text);
      return res.status(orRes.status).json({ error: `OwnerRez responded with ${orRes.status}` });
    }

    const data = await orRes.json();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);
  } catch (err) {
    console.error('[api/properties] Fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch properties from OwnerRez' });
  }
}
