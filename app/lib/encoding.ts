// Encode guest + venue into a URL-safe token
// Format: base64("guest:venue") with URL-safe chars, grouped by 4 chars with hyphens
// e.g. banteo:nhatrai → YmFu-dGVv-Om5o-YXRy-YWk

function toBase64(str: string): string {
  if (typeof Buffer !== 'undefined') return Buffer.from(str).toString('base64');
  return btoa(unescape(encodeURIComponent(str)));
}

function fromBase64(str: string): string {
  if (typeof Buffer !== 'undefined') return Buffer.from(str, 'base64').toString('utf-8');
  return decodeURIComponent(escape(atob(str)));
}

export function encodeGuestParams(guest: string, venue: string): string {
  const raw = toBase64(`${guest}:${venue}`);
  const clean = raw.replace(/\+/g, '.').replace(/\//g, '_').replace(/=/g, '');
  return clean.match(/.{1,4}/g)?.join('-') ?? clean;
}

export function decodeGuestParams(token: string): { guest: string; venue: string } | null {
  const clean = token.replace(/-/g, '').replace(/\./g, '+').replace(/_/g, '/');
  const padded = clean + '='.repeat((4 - (clean.length % 4)) % 4);
  try {
    const decoded = fromBase64(padded);
    const colonIdx = decoded.indexOf(':');
    if (colonIdx === -1) return null;
    return { guest: decoded.slice(0, colonIdx), venue: decoded.slice(colonIdx + 1) };
  } catch {
    return null;
  }
}
