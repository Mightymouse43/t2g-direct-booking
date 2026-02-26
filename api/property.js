/**
 * GET /api/property?id=:propertyId
 * Returns a single property merged with listing data (full photos + description)
 * from OwnerRez /v2/listings — requires "WordPress Plugin + Integrated Websites" add-on.
 * Falls back to synthetic single-thumbnail photos if the listing call fails.
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
    // Fetch property and listing data in parallel
    const [propRes, listingRes] = await Promise.all([
      fetch(`${base}/properties/${id}`, { headers }),
      fetch(`${base}/listings/${id}`, { headers }),
    ]);

    if (!propRes.ok) {
      return res.status(propRes.status).json({ error: `Property ${id} not found` });
    }

    const property = await propRes.json();

    // Merge listing data if available (full photos + description)
    let photos = [];
    let description = null;

    if (listingRes.ok) {
      const listing = await listingRes.json();

      // Full photo gallery from the listing
      if (Array.isArray(listing.photos) && listing.photos.length > 0) {
        photos = listing.photos.map((p) => ({
          url: p.url ?? p.large_url ?? p.medium_url ?? p.thumbnail_url ?? null,
          large_url: p.large_url ?? p.url ?? null,
          medium_url: p.medium_url ?? null,
          thumbnail_url: p.thumbnail_url ?? null,
          caption: p.caption ?? p.name ?? null,
        }));
      }

      // Description — OwnerRez may return it at different paths
      description =
        listing.description ??
        listing.descriptions?.description ??
        listing.descriptions?.main ??
        listing.headline ??
        null;
    } else {
      console.warn(`[api/property] Listing ${id} returned ${listingRes.status} — falling back to thumbnail`);
    }

    // Fall back to synthetic single-photo array if listing had no photos
    if (photos.length === 0) {
      const fallbackUrl =
        property.thumbnail_url_large ?? property.thumbnail_url_medium ?? property.thumbnail_url ?? null;
      if (fallbackUrl) {
        photos.push({
          url: fallbackUrl,
          large_url: property.thumbnail_url_large ?? null,
          medium_url: property.thumbnail_url_medium ?? null,
          thumbnail_url: property.thumbnail_url ?? null,
          caption: null,
        });
      }
    }

    const result = {
      ...property,
      photos,
      description,
    };

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(result);
  } catch (err) {
    console.error('[api/property] Fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch property from OwnerRez' });
  }
}
