import { useEffect } from 'react';

export const SITE_URL = 'https://tenants2gueststays.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

function setMeta(nameOrProp, content, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${nameOrProp}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, nameOrProp);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * useSEO — manages <title>, <meta description>, canonical, Open Graph, and
 * an optional JSON-LD block for the current page.
 *
 * @param {object} opts
 *   title       — page title string
 *   description — meta description string (≤ 160 chars)
 *   path        — URL path, e.g. "/properties" (default: "")
 *   image       — absolute OG image URL (default: /og-image.jpg)
 *   jsonLd      — plain object to inject as application/ld+json
 *   jsonLdId    — id for the <script> tag (default: "json-ld-page")
 */
export function useSEO({
  title,
  description,
  path = '',
  image,
  jsonLd,
  jsonLdId = 'json-ld-page',
} = {}) {
  // Stringify for stable dependency comparison
  const jsonLdStr = jsonLd ? JSON.stringify(jsonLd) : null;

  useEffect(() => {
    if (title) document.title = title;

    const canonical = `${SITE_URL}${path}`;
    setLink('canonical', canonical);

    if (description) setMeta('description', description);

    // Open Graph
    setMeta('og:title', title ?? document.title, 'property');
    setMeta('og:url', canonical, 'property');
    if (description) setMeta('og:description', description, 'property');
    setMeta('og:image', image ?? DEFAULT_IMAGE, 'property');
    setMeta('og:type', 'website', 'property');

    // Twitter
    setMeta('twitter:title', title ?? document.title);
    if (description) setMeta('twitter:description', description);
    setMeta('twitter:image', image ?? DEFAULT_IMAGE);

    // JSON-LD
    if (jsonLdStr) {
      upsertJsonLd(jsonLdId, JSON.parse(jsonLdStr));
    }
  }, [title, description, path, image, jsonLdStr, jsonLdId]);
}
