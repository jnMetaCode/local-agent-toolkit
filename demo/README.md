# The recipe — all three tools in one agent run

[English](./README.md) | [简体中文](./README.zh-CN.md)

This is the proof that the toolkit is one stack, not three toys. One script runs a
single agent interaction that:

1. **gets a skill** — `skillet` installs a `note-taker` skill into the project,
2. **uses memory** — `engram` remembers a decision and recalls it,
3. **self-evolves** — the confirmed answer is reinforced, so recall sharpens,
4. **is observable** — the run is traced into `tracelet`, with a cost estimate.

Everything runs on your machine. Zero external dependencies (Node 18+).

```bash
node demo/recipe.mjs
```

(If you cloned only this umbrella repo, the script shallow-clones the three tool
repos next to `demo/` on first run — still nothing to install.)

Expected output:

```
🛠  local agent toolkit — end-to-end recipe

  started engram (memory) + tracelet (tracing), 100% local

1) skillet   ✓ installed note-taker @1.0.0 → .claude/skills/note-taker
2) engram    remembered a decision, recalled it: "On 2026-09-15 we shipped v1 …" (2026-09-15)
3) evolve    reinforced the confirmed answer: score 1 → 1.13 (memory improves with use)
4) tracelet  traced the run: 3 spans · 1 LLM · 1 tool · 1052 tok · ~$0.0060

✓ One agent run: it had a skill, used memory, and was fully observable — all local.
  Open http://127.0.0.1:4321 to see the execution tree.
```

The script boots `engram serve` and `tracelet`, installs the local skill in
`demo/skills/note-taker`, then drives the loop over HTTP/OTLP and stops the
servers on exit.

## The MCP-native way (inside your editor/assistant)

The same capabilities are available as **MCP tools**, so an MCP client (Claude
Desktop / Claude Code, etc.) can use them directly — no glue code:

```json
{
  "mcpServers": {
    "engram":  { "command": "npx", "args": ["-y", "@jnmetacode/engram",  "mcp"] },
    "skillet": { "command": "npx", "args": ["-y", "@jnmetacode/skillet", "mcp"] }
  }
}
```

Now the assistant can recall your notes and persist new ones (`engram_recall` /
`engram_remember`), and find + install skills (`skillet_search` /
`skillet_install`) — all against your local machine. Run `engram watch ~/notes`
in a terminal to keep the memory live, and `tracelet` to watch the agent's runs.
