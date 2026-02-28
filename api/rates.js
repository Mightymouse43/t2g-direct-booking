/**
 * GET /api/rates?propertyId=:id&from=YYYY-MM-DD&to=YYYY-MM-DD
 * Returns rate periods from OwnerRez /v2/rates for per-day pricing display.
 * Returns { items: [] } gracefully if the endpoint is unavailable.
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

  const { propertyId, from, to } = req.query;
  if (!propertyId) {
    return res.status(400).json({ error: 'Missing required query param: propertyId' });
  }

  const credentials = Buffer.from(`${email}:${token}`).toString('base64');
  const params = new URLSearchParams({ property_id: propertyId });
  if (from) params.set('from', from);
  if (to) params.set('to', to);

  const url = `https://api.ownerrez.com/v2/rates?${params.toString()}`;

  try {
    const orRes = await fetch(url, {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!orRes.ok) {
      console.warn('[api/rates] OwnerRez returned', orRes.status, '— returning empty');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(200).json({ items: [] });
    }

    const data = await orRes.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);
  } catch (err) {
    console.error('[api/rates] Fetch error:', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ items: [] });
  }
}
