<div align="center">

# 🛠️ A local-first, MCP-native toolkit for building AI agents

**Three small, zero-dependency, `npx`-first tools that give your agent memory,
skills, and eyes — without shipping your data to anyone's cloud.**

`npx @jnmetacode/engram` · `npx @jnmetacode/skillet` · `npx @jnmetacode/tracelet`

English | [简体中文](./README.zh-CN.md)

</div>

---

Most AI-agent tooling in 2026 wants you to sign up, install an SDK, and send your
prompts, notes, and traces to a hosted service. These three tools take the
opposite stance: **everything runs on your machine, nothing leaves it, and there's
nothing to install beyond one command.** Each is pure Node built-ins (zero runtime
dependencies), MIT-licensed, framework-agnostic, and tested across Node 18/20/22 on
Linux/macOS/Windows.

They fit together (see the [end-to-end recipe](./demo)) but each stands alone. And
the memory + skills layers are **MCP-native** — usable directly from Claude Code /
Claude Desktop, not just the CLI.

```bash
node demo/recipe.mjs   # one agent run: a skill (skillet) + memory (engram) + tracing (tracelet), all local
```

## The toolkit

### 🧠 [engram](https://github.com/jnMetaCode/engram) — a local, private memory layer
Index your notes and files, then recall anything with **citations** and **temporal
reasoning** (recency-aware ranking, `--since week`) — 100% on your machine. A
built-in BM25 engine works offline; optional local Ollama adds semantic recall.
`engram watch` keeps it live as you edit; an **MCP server** lets any agent use your
memory as a tool.
```bash
npx @jnmetacode/engram watch ~/notes   # live memory; then: npx @jnmetacode/engram recall "what did I decide about pricing"
```

### 🍳 [skillet](https://github.com/jnMetaCode/skillet) — a package manager for AI agent skills
Find, install, version and share `SKILL.md` skills from a **Git-backed registry**
(a JSON file in a repo — no server). Installs copy the skill into your project and
pin the commit SHA. Includes a static **gallery** and an **MCP server** so an agent
can find and install skills for itself.
```bash
npx @jnmetacode/skillet search pdf && npx @jnmetacode/skillet add pdf
```

### 🔭 [tracelet](https://github.com/jnMetaCode/tracelet) — local DevTools for AI agents
Point any OpenTelemetry exporter at `localhost:4318` and watch your agent's
execution tree stream in **live** — LLM calls, tool calls, prompts, tokens,
latency, errors. Ingests both OTLP **protobuf** (the exporter default) and JSON.
No account, no Docker, no Python.
```bash
npx @jnmetacode/tracelet
```

## How they fit together

```
   🧠 engram            🍳 skillet            🔭 tracelet
   gives your agent     installs new          shows you what the
   (and you) memory  →  skills into it     →  agent actually did
   (recall + MCP)       (registry + gallery)  (live OTLP traces)
```

Build an agent, give it **memory** (engram), teach it **skills** (skillet), and
**debug** what it does (tracelet) — all locally.

## Install as a Claude Code plugin (one command)

This repo doubles as a plugin marketplace. Inside Claude Code:

```
/plugin marketplace add jnMetaCode/local-agent-toolkit
/plugin install local-agent-toolkit@local-agent-toolkit
```

That gives the agent the **engram** MCP tools (`engram_recall` /
`engram_remember` — durable local memory) and the **skillet** MCP tools
(`skillet_search` / `skillet_install` — find and add skills for itself), plus
two bundled skills that teach it *when* to use them (`engram-memory`,
`tracelet-instrument`). Run `npx @jnmetacode/tracelet` in a terminal to watch
what it does. Everything stays on your machine.

## Shared principles

- **Local-first & private** — your data never leaves your machine.
- **Zero runtime dependencies** — pure Node built-ins; `npx <tool>` and go.
- **Framework-agnostic & standards-based** — OpenTelemetry, the open `SKILL.md`
  format, the Model Context Protocol. No lock-in.
- **MCP-native** — engram and skillet run as MCP servers, so they're usable
  directly inside Claude Code / Claude Desktop, not just the CLI.
- **Small & readable** — each is a few hundred lines you can audit in minutes.
- **Tested** — every tool has a CI matrix and a real test suite.
- **MIT licensed.**

## Repos

Each tool lives in its own repo and is published independently:

| Tool | What it does | Repo |
| --- | --- | --- |
| 🧠 engram | local private memory — watch mode + MCP server | [jnMetaCode/engram](https://github.com/jnMetaCode/engram) |
| 🍳 skillet | agent-skills package manager — gallery + MCP server | [jnMetaCode/skillet](https://github.com/jnMetaCode/skillet) |
| 🔭 tracelet | local DevTools for agent traces — OTLP protobuf+JSON | [jnMetaCode/tracelet](https://github.com/jnMetaCode/tracelet) |
| ▶️ demo | one-command recipe proving all three together | [`./demo`](./demo) |

> Status: early MVPs, all functional and tested. See each repo's README and its
> `docs/LAUNCH.md` for what's next.
