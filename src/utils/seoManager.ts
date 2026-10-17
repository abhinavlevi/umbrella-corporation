import { BadgeData } from '../types/badge';

export interface SeoSocialMeta {
  title: string;
  description: string;
  ogImageUrl: string;
  shareUrl: string;
}

/**
 * Maps current badge operative or style to the corresponding 1200x630 OpenGraph card
 */
export function getBadgeOpenGraphImage(data: BadgeData): string {
  if (data.style === 'facility') {
    return '/og/og-facility.png';
  }
  if (data.presetId && ['alice', 'carlos', 'wesker', 'hunk', 'birkin'].includes(data.presetId)) {
    return `/og/og-${data.presetId}.png`;
  }
  if (data.style === 'classified') {
    return '/og/og-classified.png';
  }
  return '/og/og-default.png';
}

/**
 * Updates head meta tags in real-time so shared links, social scrapers, and browser bookmarks
 * reflect the active operative dossier and its dedicated OpenGraph card.
 */
export function syncBadgeSeo(data: BadgeData, shareUrl: string): SeoSocialMeta {
  if (typeof document === 'undefined') {
    return {
      title: 'Umbrella Corporation — The Hive Access Badge Creator',
      description: 'Official Umbrella Corporation Access Badge & Security Clearance Credential Studio.',
      ogImageUrl: '/og/og-default.png',
      shareUrl,
    };
  }

  const name = data.fullName.trim() || 'Unassigned Operative';
  const division = data.division || 'Security Personnel';
  const clearance = data.clearance || 'Level 5';
  const ogImageUrl = getBadgeOpenGraphImage(data);
  const absoluteOgImage = new URL(ogImageUrl, window.location.origin).href;

  const pageTitle = `${name} (${clearance}) — Umbrella Corporation Access Credential`;
  const metaDescription = `Verified Umbrella Corporation Access Record for ${name} [${clearance} • ${division}]. Issued by The Hive Central Security Directorate.`;

  // Update DOM Title
  document.title = pageTitle;

  // Helper to upsert meta tags
  const setMeta = (selector: string, attr: string, value: string) => {
    let el = document.querySelector<HTMLMetaElement>(selector);
    if (!el) {
      el = document.createElement('meta');
      const [key, val] = selector.replace(/[\[\]"]/g, '').split('=');
      el.setAttribute(key, val);
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };

  // Primary SEO
  setMeta('meta[name="description"]', 'content', metaDescription);

  // Canonical Link
  let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonicalEl) {
    canonicalEl.setAttribute('href', shareUrl || window.location.href);
  }

  // OpenGraph
  setMeta('meta[property="og:title"]', 'content', pageTitle);
  setMeta('meta[property="og:description"]', 'content', metaDescription);
  setMeta('meta[property="og:url"]', 'content', shareUrl || window.location.href);
  setMeta('meta[property="og:image"]', 'content', absoluteOgImage);
  setMeta('meta[property="og:image:secure_url"]', 'content', absoluteOgImage);

  // Twitter / X
  setMeta('meta[name="twitter:title"]', 'content', pageTitle);
  setMeta('meta[name="twitter:description"]', 'content', metaDescription);
  setMeta('meta[name="twitter:image"]', 'content', absoluteOgImage);

  return {
    title: pageTitle,
    description: metaDescription,
    ogImageUrl,
    shareUrl,
  };
}
