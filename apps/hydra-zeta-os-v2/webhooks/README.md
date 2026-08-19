# Webhook gateway contract

Receive provider webhooks at a server-only endpoint. Read the raw body, verify the provider signature with an environment-held secret, validate an allowlisted event type, derive a deterministic `idempotency_key` from provider + event ID, then insert once into `delivery_ledger`.

Do not call Discord or n8n inline. A worker consumes pending ledger rows and records each attempt. Return `2xx` only after durable acceptance; return `4xx` for invalid signatures or unsupported event types. Never log secrets or full customer payloads.
