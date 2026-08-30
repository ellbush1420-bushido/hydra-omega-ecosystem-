const PRODUCT_TIER_MAP = {
  // Configure via environment/ops; defaults are placeholders.
  initiate_pass: {
    tier: 'initiate_pass',
    manifestVersion: 'v1',
  },
  sovereign_key: {
    tier: 'sovereign_key',
    manifestVersion: 'scarlet-cathedral-v1',
  },
  vault_tier: {
    tier: 'vault_tier',
    manifestVersion: 'vault-v1',
  },
  inner_circle: {
    tier: 'inner_circle',
    manifestVersion: 'inner-circle-v1',
  },
};

export function mapWhopProductToEntitlement(whopProductId) {
  if (!whopProductId) return null;
  return (
    PRODUCT_TIER_MAP[whopProductId] || {
      tier: 'unknown',
      manifestVersion: 'v1',
    }
  );
}

