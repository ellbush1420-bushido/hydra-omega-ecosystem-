# AGENTS.md

## Scope Guard

Scope Guard is a bound, not a tool. It applies before the first edit in every agent session.

### Gate 1 — Name the task

Before planning or editing, state the task in exactly four lines:

- **Outcome:** the single result to produce.
- **Non-goals:** what this task will not change.
- **Files that may change:** the explicit allowed file set.
- **Proof:** the concrete evidence that shows the task is complete.

If those four lines cannot be stated, there is no valid task. Do not invent one.

### Gate 2 — Read and reuse

Read the existing code and repository guidance before changing anything. Reuse what already exists.

A new dependency, new abstraction, or new folder increases blast radius and requires a question before proceeding.

### Gate 3 — Compress the plan

If the plan grows, stop and rewrite it smaller.

One outcome. One proof.

Do not turn a narrow change into a framework, migration, cleanup, or adjacent improvement.

### Gate 4 — Make only the proof-required change

Change only what the proof requires.

Fix the root cause. Do not rewrite a whole file for a one-line fix. Do not perform unrelated cleanup.

If an agent goes quiet mid-task, treat that as a watch condition, not as evidence that work is still progressing.

## Operating rule

Review catches damage after generation. Scope Guard refuses unnecessary surface before generation.

**Purity is minimum justified change, not maximum cleverness.**

## Required pre-edit sequence

Every agent must run this sequence before modifying the repository:

1. Declare Outcome / Non-goals / Files / Proof.
2. Read the relevant existing code and instructions.
3. Confirm the plan still has one outcome and one proof.
4. Make the minimum change required by the proof.
5. Verify the proof before declaring completion.

When scope must expand, stop and ask before crossing the declared boundary.
