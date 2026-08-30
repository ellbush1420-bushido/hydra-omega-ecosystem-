export function getServerConfig(env = process.env) {
  return {
    port: Number(env.PORT || 8787),
    whopWebhookSecret: env.WHOP_WEBHOOK_SECRET || '',
    sqlitePath: env.HYDRA_SQLITE_PATH || './hydra-bridge.sqlite',
    manifestBasePath: env.HYDRA_MANIFEST_BASE_PATH || './manifests',
  };
}

