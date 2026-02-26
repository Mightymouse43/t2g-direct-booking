/**
 * GET /api/property?id=:propertyId
 * Returns a single property with a synthetic photos array built from
 * the thumbnail URLs already present on the property object.
 *
 * Note: OwnerRez /v2/listings (full photo gallery + descriptions) requires
 * the "WordPress Plugin + Integrated Websites" premium add-on which is not
 * currently enabled. We use thumbnail_url_large as the single high-res photo.
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
    const propRes = await fetch(`${base}/properties/${id}`, { headers });

    if (!propRes.ok) {
      return res.status(propRes.status).json({ error: `Property ${id} not found` });
    }

    const property = await propRes.json();

    // Build a synthetic photos array from the thumbnail URLs on the property.
    // OwnerRez's full photo gallery requires the /v2/listings premium endpoint.
    const photos = [];
    if (property.thumbnail_url_large || property.thumbnail_url_medium || property.thumbnail_url) {
      photos.push({
        url: property.thumbnail_url_large ?? property.thumbnail_url_medium ?? property.thumbnail_url,
        large_url: property.thumbnail_url_large ?? null,
        medium_url: property.thumbnail_url_medium ?? null,
        thumbnail_url: property.thumbnail_url ?? null,
      });
    }

    const result = {
      ...property,
      photos,
    };

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(result);
  } catch (err) {
    console.error('[api/property] Fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch property from OwnerRez' });
  }
}
