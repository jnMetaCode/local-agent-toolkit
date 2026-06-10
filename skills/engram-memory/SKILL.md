---
name: engram-memory
description: Give the agent durable, local memory with engram — recall past decisions before answering, and persist new decisions, preferences and facts as they happen. Use when work spans sessions or the user says "remember".
version: 1.0.0
license: MIT
keywords: [memory, recall, engram, local-first, decisions, mcp]
homepage: https://github.com/jnMetaCode/engram
---

# engram-memory

You have access to a local, private memory layer ([engram](https://github.com/jnMetaCode/engram)).
Treat it as your long-term memory: **read it before you answer, write to it when
something durable happens.** Everything stays on the user's machine.

## Setup (once)

If the `engram_recall` / `engram_remember` MCP tools are available, use those.
Otherwise use the CLI (zero install):

```bash
npx @jnmetacode/engram serve &          # HTTP API on :7077, or
npx @jnmetacode/engram mcp              # as an MCP server
```

## When to RECALL

Before answering anything that may depend on prior context, search memory first:

- "What did we decide about X?" / "Why did we choose Y?"
- Resuming work after a gap ("where were we?")
- Anything referencing a person, project, deadline, or preference you don't see
  in the current conversation.

```bash
npx @jnmetacode/engram recall "pricing decision" --since month
```

Quote the recalled passage **with its citation** (file/date) rather than
paraphrasing from your own context — the citation is the point.

## When to REMEMBER

Persist a memory when the conversation produces something with a shelf life:

- A decision and its why ("we picked Postgres over SQLite because …")
- A user preference ("always use pnpm", "no AI attribution in commits")
- A fact that took effort to establish (a root cause, a benchmark number)

```bash
npx @jnmetacode/engram remember "2026-06-10: chose scoped npm names (@org/pkg) because unscoped were taken"
```

Rules for good memories:

1. **One fact per memory.** Atomic entries rank and recall better.
2. **Date it.** Lead with an absolute date — engram's ranking is time-aware.
3. **Include the why**, not just the what; the why is what future-you needs.
4. Don't store what the repo already records (code, git history, docs).

## Verify it stuck

After remembering, do a quick `recall` of a keyword from the new memory. If it
doesn't come back first, rewrite it more concretely.
