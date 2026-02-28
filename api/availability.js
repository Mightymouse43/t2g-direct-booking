/**
 * GET /api/availability?propertyId=:id&from=YYYY-MM-DD&to=YYYY-MM-DD
 * Returns active bookings for a property from OwnerRez /v2/bookings.
 * NOTE: /v2/availability does not exist in OwnerRez API v2 — bookings are
 * the correct source for blocked-date data (arrival_date / departure_date).
 *
 * Cache is shorter (60s) because availability changes frequently.
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

  // OwnerRez Basic auth: base64("email:TOKEN")
  const credentials = Buffer.from(`${email}:${token}`).toString('base64');

  // OwnerRez /v2/bookings: property_ids (plural), status=active, since_utc for start date
  const params = new URLSearchParams({
    property_ids: propertyId,
    status: 'active',
    page_size: '100',
  });
  if (from) params.set('since_utc', from);

  const url = `https://api.ownerrez.com/v2/bookings?${params.toString()}`;

  try {
    const orRes = await fetch(url, {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!orRes.ok) {
      const text = await orRes.text();
      console.error('[api/availability] OwnerRez error:', orRes.status, text);
      return res.status(200).json({ items: [] }); // return empty so calendar renders
    }

    const data = await orRes.json();

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);
  } catch (err) {
    console.error('[api/availability] Fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch availability from OwnerRez' });
  }
}
