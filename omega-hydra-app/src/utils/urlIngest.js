const REDIRECT_PARAM_KEYS = [
  'u',
  'url',
  'target',
  'dest',
  'destination',
  'redirect',
  'redirect_url',
  'redir',
  'r',
];

const MAX_REDIRECT_HOPS = 5;

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function safeDecodeBase64(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);

  try {
    if (typeof atob === 'function') {
      return atob(padded);
    }
  } catch {
    return null;
  }

  try {
    if (typeof globalThis.Buffer !== 'undefined') {
      return globalThis.Buffer.from(padded, 'base64').toString('utf8');
    }
  } catch {
    return null;
  }

  return null;
}

function looksLikeBase64(value) {
  return value.length >= 16 && /^[A-Za-z0-9+/_=-]+$/.test(value);
}

function coerceUrl(value) {
  const normalized = value.trim().replace(/&amp;/g, '&');

  try {
    return new URL(normalized).toString();
  } catch {
    return null;
  }
}

function decodeCandidate(value) {
  const directUrl = coerceUrl(value);
  if (directUrl) return directUrl;

  const uriDecoded = safeDecodeURIComponent(value);
  const uriDecodedUrl = coerceUrl(uriDecoded);
  if (uriDecodedUrl) return uriDecodedUrl;

  if (!looksLikeBase64(value)) return null;

  const base64Decoded = safeDecodeBase64(value);
  if (!base64Decoded) return null;

  const base64Url = coerceUrl(base64Decoded);
  if (base64Url) return base64Url;

  return coerceUrl(safeDecodeURIComponent(base64Decoded));
}

export function ingestTrackingUrl(rawInput) {
  const input = rawInput.trim();

  if (!input) {
    return { error: 'Paste a URL to ingest.' };
  }

  const initialUrl = coerceUrl(input);
  if (!initialUrl) {
    return { error: 'Enter a valid absolute URL.' };
  }

  let resolvedUrl = initialUrl;
  let hops = 0;

  while (hops < MAX_REDIRECT_HOPS) {
    const current = new URL(resolvedUrl);
    const nestedValue = REDIRECT_PARAM_KEYS
      .map((key) => current.searchParams.get(key))
      .find(Boolean);

    if (!nestedValue) break;

    const decoded = decodeCandidate(nestedValue);
    if (!decoded || decoded === resolvedUrl) break;

    resolvedUrl = decoded;
    hops += 1;
  }

  const source = new URL(initialUrl);
  const destination = new URL(resolvedUrl);
  const metadata = {};

  [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'msclkid',
    'gclid',
  ].forEach((key) => {
    const value = destination.searchParams.get(key);
    if (value) metadata[key] = value;
  });

  return {
    sourceUrl: source.toString(),
    sourceHost: source.hostname,
    destinationUrl: destination.toString(),
    destinationHost: destination.hostname,
    pathname: destination.pathname || '/',
    metadata,
    redirectDepth: hops,
  };
}
