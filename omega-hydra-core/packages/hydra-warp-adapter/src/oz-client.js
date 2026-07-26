/**
 * Oz REST API client stub.
 *
 * This module defines the interface for the real Warp/Oz adapter.
 * All methods throw unless OZ_API_KEY and OZ_BASE_URL are set.
 * Use mock-client.js for local and CI runs.
 *
 * Open questions (documented in docs/skill-forge/warp-oz-integration.md):
 * - REST API vs TypeScript SDK vs `oz` CLI as primary interface
 * - Account/workspace, plan, and environment configuration
 * - Available models and per-run model selection
 * - Rate, concurrency, runtime, payload, and output limits
 * - Webhook/event stream availability vs polling
 * - Stable run states and error codes to normalize
 * - Idempotency, retry, cancellation, and timeout handling
 * - Structured JSON output enforcement and schema validation
 * - Artifact upload, retention, download, and deletion
 * - Secret scoping, rotation, and redaction rules
 * - Execution permission profiles (filesystem, network, shell, GitHub, MCP)
 * - Audit data format for prompts, commands, tool calls, approvals, and costs
 * - Data retention, regional processing, and deletion controls
 * - Human approval flow before writes, pushes, and deployments
 * - Migration path from deprecated `warp-cli` to `oz`
 */

export function createOzClient(options = {}) {
  const baseUrl = options.baseUrl || process.env.OZ_BASE_URL || "";
  const apiKey = options.apiKey || process.env.OZ_API_KEY || "";

  function requireCredentials() {
    if (!baseUrl || !apiKey) {
      throw new Error(
        "OZ_BASE_URL and OZ_API_KEY must be set to use the real Oz client. " +
          "Use mock-client.js for local and CI runs."
      );
    }
  }

  async function submitRun(request = {}) {
    requireCredentials();
    throw new Error("Oz submitRun not yet implemented. Configure OZ_BASE_URL and OZ_API_KEY.");
  }

  async function getRunStatus(runId) {
    requireCredentials();
    throw new Error("Oz getRunStatus not yet implemented.");
  }

  async function cancelRun(runId) {
    requireCredentials();
    throw new Error("Oz cancelRun not yet implemented.");
  }

  return { submitRun, getRunStatus, cancelRun };
}
