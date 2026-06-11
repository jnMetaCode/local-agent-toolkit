# 吸引用户的文案库 / Launch hooks library

[中文说明 + 英文文案，粘贴即用。配合各仓库 `docs/LAUNCH.md` 使用。]

## 转化原理（为什么这样写）

开发者只给你 3 秒。能转化的文案结构永远是：

1. **痛点共鸣**（3 秒）——说出他正在忍受的事，用他的语言，不解释产品
2. **差异化承诺**（10 秒）——一句话说清"和别人反着来"的立场
3. **可见证据**（30 秒）——一条命令 + 一个看得见的结果（分数上升、$ 数字、瀑布图）
4. **零门槛行动**——`npx` 一条命令，不注册、不配置

反面清单：不堆形容词（"powerful/seamless"是噪音）、不先讲架构、不在标题里塞三个卖点（一个钩子就够，其余留给评论区）。

---

## 🧠 engram

**痛点句**（开场白，HN 首评/Reddit 首段可用）：

> Your notes are a second brain you can't query. Every tool that *can* query
> them wants them uploaded first.

**HN 标题候选**（80 字符内；A 为默认，反响平淡时换 B/C 再战别的渠道）：

- **A（隐私钩）**: `Show HN: Engram – a local, private memory layer for your notes (and your agents)`
- **B（自我进化钩）**: `Show HN: Engram – local memory for agents that gets better the more you use it`
- **C（反潮流钩）**: `Show HN: I built AI memory that never leaves your laptop (zero deps, BM25 + time)`

**30 秒证据**（评论区被质疑"又一个 RAG 玩具"时直接贴）：

```
$ npx @jnmetacode/engram recall "what did I decide about pricing"
  0.96  notes/pricing.md:1-6  2026-05-20   ← cited, dated
$ npx @jnmetacode/engram reinforce "what did I decide about pricing" pricing.md
$ npx @jnmetacode/engram recall "what did I decide about pricing"
  1.09  notes/pricing.md:1-6  2026-05-20   ← it learned
```

**一句话差异化**（被问"vs Mem0/Zep/Letta"时）：

> They're hosted memory platforms; engram is a local file you can `cat`. No
> account, no SDK, works offline with zero models — and recall is
> self-improving without any of your data leaving the machine.

---

## 🍳 skillet

**痛点句**：

> Agent skills are everywhere now. Sharing them is still copy-paste from
> random repos, with no versions and no way to find what exists.

**HN 标题候选**：

- **A（类比钩，默认）**: `Show HN: Skillet – npm for AI agent skills (zero-infra, Git-backed registry)`
- **B（机制钩）**: `Show HN: A package manager for agent skills where the registry is one JSON file`

**30 秒证据**：

```
$ npx @jnmetacode/skillet add pdf
✓ installed pdf → .claude/skills/pdf
  pinned 5754626 in skillet.lock.json    ← reproducible, like npm ci
```

**一句话差异化**：

> shadcn-style: the skill is copied into your repo where you can read and
> edit it — pinned to a commit SHA, reproducible for your whole team. The
> registry has no backend to trust or to die.

---

## 🔭 tracelet

**痛点句**（这是三个里共鸣最强的，先发评论区必引发"+1"）：

> Your agent is a black box. It calls an LLM, the LLM asks for a tool, the
> tool returns something weird, the next call does something dumb — and all
> you see is the final answer.

**HN 标题候选**：

- **A（类比钩，默认）**: `Show HN: Tracelet – local-first DevTools for AI agents (npx, no account)`
- **B（Network 面板钩）**: `Show HN: The Network tab for AI agents – every prompt, token and $ locally`

**30 秒证据**：GIF 本身（trace 实时流入 + `~$0.0039` 成本徽章）。文字版：

> `npx @jnmetacode/tracelet`, point any OTel exporter at :4318, and watch the
> execution tree stream in — prompts, tokens, the tool call that errored, and
> what the run cost.

**一句话差异化**：

> Langfuse/Phoenix are production warehouses. tracelet is the thing you keep
> open in a second window *while building* — in-memory, zero-dep, gone when
> you close it (unless you `--persist`).

---

## 🛠️ 套件级（umbrella / 插件 / X bio）

**一句话**（X bio、README tagline、HN 评论区点题）：

> Memory, skills, and eyes for your agent — zero deps, MCP-native, and
> nothing ever leaves your machine.

**进化闭环叙事**（评论区讲"三件套为什么是一个体系"）：

> tracelet is the senses, engram is memory that gets sharper with use,
> skillet is where lessons become instincts. The `self-evolve` skill wires
> them into one loop: observe the run → distill the lesson → remember it →
> reinforce what proved right → recall it next time. All local.

**Claude Code 人群的钩子**（r/ClaudeAI 等）：

> One command gives your agent persistent memory + a skill manager:
> `/plugin marketplace add jnMetaCode/local-agent-toolkit`

---

## 发帖节奏提醒（详见各 docs/LAUNCH.md）

- HN：周二/周三 8am PT；正文发首评；前 3 小时每评必回
- 标题只用一个钩子；第二个卖点放正文第一段；第三个留给评论区"补刀"
- 每个回复结尾都自然带回 30 秒证据或 GIF，不空辩
