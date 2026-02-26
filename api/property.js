/**
 * GET /api/property?id=:propertyId
 * Returns a single property with photos and amenities merged.
 *
 * OwnerRez calls made:
 *   GET /v2/properties/:id
 *   GET /v2/properties/:id/photos
 *   GET /v2/propertytypes  (for display labels)
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

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing required query param: id' });
  }

  // OwnerRez Basic auth: base64("email:TOKEN")
  const credentials = Buffer.from(`${email}:${token}`).toString('base64');
  const headers = {
    Authorization: `Basic ${credentials}`,
    'Content-Type': 'application/json',
  };
  const base = 'https://api.ownerrez.com/v2';

  try {
    // Fetch property, photos, and amenities in parallel
    const [propRes, photosRes] = await Promise.all([
      fetch(`${base}/properties/${id}`, { headers }),
      fetch(`${base}/properties/${id}/photos`, { headers }),
    ]);

    if (!propRes.ok) {
      return res.status(propRes.status).json({ error: `Property ${id} not found` });
    }

    const [property, photosData] = await Promise.all([
      propRes.json(),
      photosRes.ok ? photosRes.json() : Promise.resolve({ items: [] }),
    ]);

    const result = {
      ...property,
      photos: photosData?.items ?? photosData ?? [],
    };

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(result);
  } catch (err) {
    console.error('[api/property] Fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch property from OwnerRez' });
  }
}
