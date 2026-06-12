<div align="center">

# 🛠️ 本地优先、MCP 原生的 AI Agent 工具套件

**三个小巧、零依赖、`npx` 即用的工具，给你的 agent 装上记忆、技能和眼睛——
数据不出你的电脑。**

`npx @jnmetacode/engram` · `npx @jnmetacode/skillet` · `npx @jnmetacode/tracelet`

[English](./README.md) | 简体中文

</div>

---

2026 年的多数 AI agent 工具都要你注册账号、装 SDK，再把你的提示词、笔记和
trace 发到他们的云上。这三个工具立场相反：**一切都在你的机器上运行，什么都
不上传，除了一条命令什么都不用装。** 每个工具都只用 Node 内置模块（零运行时
依赖）、MIT 许可、框架无关，并在 Linux/macOS/Windows × Node 18/20/22 上有
完整 CI 测试。

它们可以组合使用（见[端到端示例](./demo)），也可以各自独立。记忆层和技能层
都是 **MCP 原生**的——可以直接在 Claude Code / Claude Desktop 里当工具用，
不只是命令行。

```bash
node demo/recipe.mjs   # 一次 agent 运行：装技能(skillet) + 用记忆(engram) + 看追踪(tracelet)，全本地
```

## 三件套

### 🧠 [engram](https://github.com/jnMetaCode/engram) —— 本地私有记忆层
索引你的笔记、文件、PDF 和 **EPUB**，然后用自然语言召回任何内容——**带出处
引用**（文件:行号 + 日期）和**时间感知**（越新越靠前、支持 `--since week`），
100% 在本机完成。内置 BM25 引擎离线可用；可选本地 Ollama 加语义召回。召回会
**自我进化**——用 `engram reinforce` 确认答案，相似查询就把它排得更高。
`engram watch` 实时更新；**MCP server** 让 agent 能召回、写入*并强化*记忆。
```bash
npx @jnmetacode/engram watch ~/notes   # 实时记忆；然后: npx @jnmetacode/engram recall "我们对定价做了什么决定"
```

### 🍳 [skillet](https://github.com/jnMetaCode/skillet) —— AI agent 技能包管理器
从 **Git 仓库即注册表**（一个 JSON 文件，无需服务器）中查找、安装、版本管理
和分享 `SKILL.md` 技能。安装时把技能复制进你的项目并**锁定 commit SHA**，
团队可用 `skillet install` 精确复现（技能界的 `npm ci`）。**已收录 30 个验证过的
技能**（含 superpowers-zh 中文精选）；在线 **gallery** 和 **MCP server** 让 agent 自己找技能、装技能。
```bash
npx @jnmetacode/skillet search pdf && npx @jnmetacode/skillet add pdf
```

### 🔭 [tracelet](https://github.com/jnMetaCode/tracelet) —— agent 的本地 DevTools
把任何 OpenTelemetry exporter 指向 `localhost:4318`，就能**实时**看到 agent
的执行树——每次 LLM 调用、工具调用、提示词、token 数、延迟、报错，以及**按
模型估算的成本**。同时支持 OTLP **protobuf** 和 JSON；可选 `--persist` 让历史
跨重启保留。不用注册、不用 Docker、不用 Python。
```bash
npx @jnmetacode/tracelet
```

## 它们如何配合

```
   🧠 engram            🍳 skillet            🔭 tracelet
   给你的 agent          给它装上              让你看清 agent
   （和你）记忆      →   新技能            →   实际做了什么
   (召回 + MCP)         (注册表 + gallery)    (实时 OTLP 追踪)
```

造一个 agent，给它**记忆**（engram），教它**技能**（skillet），再**调试**它
的行为（tracelet）——全部在本地。

## 一条命令装成 Claude Code 插件

本仓库同时是一个插件市场（plugin marketplace）。在 Claude Code 里执行：

```
/plugin marketplace add jnMetaCode/local-agent-toolkit
/plugin install local-agent-toolkit@local-agent-toolkit
```

装好后 agent 立刻获得 **engram** 的 MCP 工具（`engram_recall` /
`engram_remember`——持久本地记忆）和 **skillet** 的 MCP 工具
（`skillet_search` / `skillet_install`——自己找技能装技能），外加两个内置
技能（`engram-memory`、`tracelet-instrument`）教它*什么时候*该用这些工具。
另开一个终端跑 `npx @jnmetacode/tracelet` 就能围观它干活。一切都留在你的
机器上。

## 共同原则

- **本地优先、隐私至上** —— 数据永不离开你的机器。
- **零运行时依赖** —— 纯 Node 内置模块；`npx <工具>` 即用。
- **框架无关、基于开放标准** —— OpenTelemetry、开放的 `SKILL.md` 格式、
  Model Context Protocol，没有锁定。
- **MCP 原生** —— engram 和 skillet 都能作为 MCP server 运行，直接在
  Claude Code / Claude Desktop 里使用。
- **小而可读** —— 每个工具只有几百行代码，几分钟就能审计完。
- **有测试** —— 每个工具都有 CI 矩阵和真实测试套件。
- **MIT 许可。**

## 仓库

每个工具独立成仓、独立发布：

| 工具 | 用途 | 仓库 |
| --- | --- | --- |
| 🧠 engram | 本地私有记忆 —— watch 实时模式 + MCP server | [jnMetaCode/engram](https://github.com/jnMetaCode/engram) |
| 🍳 skillet | 技能包管理器 —— gallery + MCP server | [jnMetaCode/skillet](https://github.com/jnMetaCode/skillet) |
| 🔭 tracelet | agent 追踪的本地 DevTools —— OTLP protobuf+JSON | [jnMetaCode/tracelet](https://github.com/jnMetaCode/tracelet) |
| ▶️ demo | 一条命令串起三件套的端到端示例 | [`./demo`](./demo) |

> 状态：持续迭代中（engram 0.3.x、skillet 0.1.x、tracelet 0.2.x），全部可用且有测试。各仓库的 README 和 `docs/LAUNCH.md`
> 里有后续计划。发布操作手册见 [RUNBOOK.zh-CN.md](./RUNBOOK.zh-CN.md)。
