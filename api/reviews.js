/**
 * GET /api/reviews?propertyId=:id
 * Proxies OwnerRez /v2/reviews for a given property.
 *
 * Cache: 5 min — reviews change infrequently.
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

  const { propertyId } = req.query;
  if (!propertyId) {
    return res.status(400).json({ error: 'Missing required query param: propertyId' });
  }

  const credentials = Buffer.from(`${email}:${token}`).toString('base64');

  const params = new URLSearchParams({ property_id: propertyId, page_size: '50' });
  const url = `https://api.ownerrez.com/v2/reviews?${params.toString()}`;

  try {
    const orRes = await fetch(url, {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!orRes.ok) {
      const text = await orRes.text();
      console.error('[api/reviews] OwnerRez error:', orRes.status, text);
      return res.status(orRes.status).json({ error: `OwnerRez responded with ${orRes.status}` });
    }

    const data = await orRes.json();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);
  } catch (err) {
    console.error('[api/reviews] Fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch reviews from OwnerRez' });
  }
}
