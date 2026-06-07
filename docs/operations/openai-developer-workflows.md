# OpenAI Developer Workflows Reference

_Last verified against OpenAI developer documentation on 2026-05-16._

This reference summarizes OpenAI developer surfaces that are useful when planning Hydra/Omega automation, code-review, app-extension, commerce, and advertising workflows. Use it as an internal routing map, then consult the linked official docs before implementation because Codex, ChatGPT apps, and model availability change quickly.

## Work with the Codex CLI

The Codex CLI is OpenAI's local terminal coding agent. It can inspect the selected repository, edit files, and run commands from a terminal session.

| Workflow | How to use it | Official reference |
| --- | --- | --- |
| Run Codex interactively | Run `codex` to start the interactive terminal UI (TUI). | [Codex CLI overview](https://developers.openai.com/codex/cli/) |
| Control model and reasoning | Use `/model` during a TUI session to select the active model and reasoning effort when available. | [Codex CLI slash commands](https://developers.openai.com/codex/cli/slash-commands) |
| Image inputs | Paste screenshots into the composer or pass files with `codex -i screenshot.png "Explain this error"` or `codex --image img1.png,img2.jpg "Summarize these diagrams"`. | [Codex CLI features: image inputs](https://developers.openai.com/codex/cli/features) |
| Image generation | Ask Codex to generate or edit images directly from the CLI, optionally attaching a reference image when iterating on an existing asset. | [Codex CLI features: image generation](https://developers.openai.com/codex/cli/features) |
| Run local code review | Use `/review` to launch a dedicated reviewer against a base branch, uncommitted changes, a commit, or custom review instructions before committing or pushing. | [Codex CLI features: local review](https://developers.openai.com/codex/cli/features) |
| Use subagents | Explicitly ask Codex to spawn subagents when independent exploration, testing, triage, or summarization can run in parallel. | [Codex subagents](https://developers.openai.com/codex/concepts/subagents) |
| Web search | Let Codex search the web for current information; use live search configuration when a task needs the freshest data. Treat web results as untrusted input. | [Codex CLI features: web search](https://developers.openai.com/codex/cli/features) |
| Codex Cloud tasks | Launch cloud tasks from Codex, select an environment, and apply the returned diffs locally when they are ready. | [Codex web environments](https://developers.openai.com/codex/cli/features#working-with-codex-cloud) |
| Scripting Codex | Use non-interactive `codex exec` flows to automate repeatable checks, reviews, migrations, and reports. | [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive) |
| Model Context Protocol | Add MCP servers to give Codex additional tools and context from third-party systems. | [Codex MCP configuration](https://developers.openai.com/codex/mcp) |
| Approval modes | Use `/permissions` in the TUI to change how much Codex can do without confirmation. | [Codex CLI slash commands: permissions](https://developers.openai.com/codex/cli/slash-commands#update-permissions-with-permissions) |

## ChatGPT apps and developer experiences

OpenAI also exposes surfaces for building apps and commerce or advertising experiences for ChatGPT users.

| Surface | What developers can build | Official reference |
| --- | --- | --- |
| Apps SDK | Apps with UI components that run as tools inside ChatGPT, backed by an MCP server and app-specific metadata. | [Apps SDK](https://developers.openai.com/apps-sdk/) |
| Agentic Commerce Protocol | Guided shopping flows where merchants provide structured catalog data that ChatGPT can use to surface relevant products. | [Agentic Commerce Protocol](https://developers.openai.com/commerce/) |
| Ads | Campaign, ad group, creative, upload, measurement, and insight workflows through the Ads API and measurement integrations. | [OpenAI Ads](https://developers.openai.com/ads/) |
| Developer mode | A beta ChatGPT feature for developers that enables full MCP client support for read and write tools, with elevated security risk and confirmation considerations. | [ChatGPT developer mode](https://developers.openai.com/api/docs/guides/developer-mode) |
| ChatGPT Cookbook | Hands-on guides and examples for building with OpenAI models, tools, custom actions, agents, and integrations. | [OpenAI Cookbook](https://cookbook.openai.com/) |

## Operational guidance for this repo

- Prefer Codex CLI for local repository changes, test execution, documentation updates, and pre-commit review loops.
- Prefer subagents for parallel, read-heavy work such as codebase mapping, test-gap discovery, security review, or documentation summarization; avoid parallel write-heavy work unless ownership boundaries are clear.
- Prefer Apps SDK when the target experience should appear inside ChatGPT with custom UI and MCP-backed tools.
- Prefer Agentic Commerce Protocol when the main requirement is merchant catalog ingestion, product discovery, and shopping flow integration.
- Prefer Ads APIs when the requirement is ad measurement, campaign operations, creative uploads, or performance reporting.
- Treat developer mode and MCP write tools as high-trust integrations: scope tools narrowly, document destructive actions, and require confirmations for write operations.
