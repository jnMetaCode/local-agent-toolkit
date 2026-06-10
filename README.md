<div align="center">

# 🛠️ A local-first, MCP-native toolkit for building AI agents

**Three small, zero-dependency, `npx`-first tools that give your agent memory,
skills, and eyes — without shipping your data to anyone's cloud.**

`npx @jnmetacode/engram` · `npx @jnmetacode/skillet` · `npx @jnmetacode/tracelet`

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

### 🧠 [engram](./engram) — a local, private memory layer
Index your notes and files, then recall anything with **citations** and **temporal
reasoning** (recency-aware ranking, `--since week`) — 100% on your machine. A
built-in BM25 engine works offline; optional local Ollama adds semantic recall.
`engram watch` keeps it live as you edit; an **MCP server** lets any agent use your
memory as a tool.
```bash
npx @jnmetacode/engram watch ~/notes   # live memory; then: npx @jnmetacode/engram recall "what did I decide about pricing"
```

### 🍳 [skillet](./skillet) — a package manager for AI agent skills
Find, install, version and share `SKILL.md` skills from a **Git-backed registry**
(a JSON file in a repo — no server). Installs copy the skill into your project and
pin the commit SHA. Includes a static **gallery** and an **MCP server** so an agent
can find and install skills for itself.
```bash
npx @jnmetacode/skillet search pdf && npx @jnmetacode/skillet add pdf
```

### 🔭 [tracelet](./tracelet) — local DevTools for AI agents
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

Each tool lives in its own folder and is published independently:

| Tool | What it does | Folder |
| --- | --- | --- |
| 🧠 engram | local private memory — watch mode + MCP server | [`./engram`](./engram) |
| 🍳 skillet | agent-skills package manager — gallery + MCP server | [`./skillet`](./skillet) |
| 🔭 tracelet | local DevTools for agent traces — OTLP protobuf+JSON | [`./tracelet`](./tracelet) |
| ▶️ demo | one-command recipe proving all three together | [`./demo`](./demo) |

> Status: early MVPs, all functional and tested. See each repo's README and its
> `docs/LAUNCH.md` for what's next.
