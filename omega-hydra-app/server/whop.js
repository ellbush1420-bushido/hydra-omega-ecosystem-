import crypto from 'node:crypto';

export function verifyWhopSignature({ rawBody, signature, secret }) {
  if (!secret) return false;
  if (!signature) return false;

  const digest = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(signature, 'utf8');
  const b = Buffer.from(digest, 'utf8');

  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function normalizeWhopEvent(payload) {
  if (!payload || typeof payload !== 'object') return null;

  const eventId = payload.id || payload.event_id || payload.eventId || null;
  const eventType = payload.type || payload.event_type || payload.eventType || null;

  const data = payload.data || payload;
  const member = data.member || data.membership || data.user || {};

  const userEmail =
    member.email ||
    data.user_email ||
    data.email ||
    data.customer_email ||
    null;

  const whopMemberId = member.id || data.member_id || data.whop_member_id || null;
  const whopProductId =
    data.product_id ||
    data.whop_product_id ||
    (data.product && data.product.id) ||
    null;

  return {
    eventId,
    eventType,
    userEmail,
    whopMemberId,
    whopProductId,
    raw: payload,
  };
}

