# 端到端示例 —— 一次 agent 运行用上全部三件套

[English](./README.md) | 简体中文

这是"三件套是一个体系、不是三个玩具"的证明。一个脚本完成一次 agent 交互：

1. **获得技能** —— `skillet` 把 `note-taker` 技能装进项目
2. **使用记忆** —— `engram` 记住一个决定，然后召回它
3. **自我进化** —— 确认过的答案被强化，召回越用越准
4. **全程可观测** —— 运行追踪进 `tracelet`，带成本估算

一切都在你的机器上运行。零外部依赖（Node 18+）。

```bash
node demo/recipe.mjs
```

（如果你只 clone 了这个 umbrella 仓库，脚本首次运行会自动把三个工具仓库
浅克隆到 `demo/` 旁边——依然什么都不用安装。）

预期输出：

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

脚本会启动 `engram serve` 和 `tracelet`，安装 `demo/skills/note-taker` 里的
本地技能，然后通过 HTTP/OTLP 驱动整个循环，退出时自动停掉两个服务。

## MCP 原生用法（在你的编辑器/助手里）

同样的能力也以 **MCP 工具**形式提供，MCP 客户端（Claude Desktop / Claude
Code 等）可以直接调用——不用写任何胶水代码：

```json
{
  "mcpServers": {
    "engram":  { "command": "npx", "args": ["-y", "@jnmetacode/engram",  "mcp"] },
    "skillet": { "command": "npx", "args": ["-y", "@jnmetacode/skillet", "mcp"] }
  }
}
```

这样助手就能召回你的笔记并写入新记忆（`engram_recall` / `engram_remember`），
以及查找并安装技能（`skillet_search` / `skillet_install`）——全部在你的本地
机器上。再开一个终端跑 `engram watch ~/notes` 保持记忆实时，跑 `tracelet`
围观 agent 的运行。
