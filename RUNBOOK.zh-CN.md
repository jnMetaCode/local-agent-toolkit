# 发布手册 —— 从零到上线（中文版）

[English](./RUNBOOK.md) | 简体中文

> **状态（2026-06-11）：已发布上线。** 三个包已全部发布到 npm（用本机已登录的
> `jnmetacode` 账号发布，每个版本均已打 tag 并创建 GitHub release），且已用干净
> 缓存验证可用：
> [@jnmetacode/engram](https://www.npmjs.com/package/@jnmetacode/engram) ·
> [@jnmetacode/skillet](https://www.npmjs.com/package/@jnmetacode/skillet) ·
> [@jnmetacode/tracelet](https://www.npmjs.com/package/@jnmetacode/tracelet)。
> 第 1 节只剩一项**可选**事项：配置 `NPM_TOKEN` secret，让*以后*推 tag 时 CI
> 自动发布（当前没有该 secret 时工作流会优雅跳过发布步骤，不会报错）。
> 下一步：**第 3 节——正式对外发布（Show HN）。**

## 1. 只有你能做的 30 分钟（P0）

1. **注册 npm scope。** 到 https://www.npmjs.com/signup 注册用户名
   `jnmetacode`。如果用户名被占用，就改为创建一个名为 `jnmetacode` 的
   **组织（org）**——组织同样拥有 `@jnmetacode/*` 这个 scope，公开包免费。
   （最后兜底方案：改用 `@jn-metacode`，然后需要更新三个仓库的
   `package.json` 和 README。）
2. **生成 Automation 令牌**（npmjs.com → Access Tokens → 选 *Automation*
   类型），然后把它设置为**每个**仓库的 `NPM_TOKEN` Actions secret：
   ```bash
   for r in engram skillet tracelet; do
     gh secret set NPM_TOKEN --repo jnMetaCode/$r --body "<粘贴你的令牌>"
   done
   ```
3. **打 tag**（这会触发 `.github/workflows/publish.yml`：先跑测试，再
   `npm publish --provenance --access public` 自动发布）：
   ```bash
   for r in engram skillet tracelet; do
     (cd $r && git tag v0.1.0 && git push --tags)
   done
   ```
4. **在干净目录验证**（无需 clone 任何代码）：
   ```bash
   npx @jnmetacode/engram --version
   npx @jnmetacode/skillet search pdf
   npx @jnmetacode/tracelet --help
   ```

## 2. 发布后的收尾（交给助手做，约 10 分钟）

- 把 Claude Code 插件里 MCP server 的启动命令从 `npx github:jnMetaCode/…`
  切换到 `npx @jnmetacode/…`（走 npm 缓存，启动更快），升插件版本号并推送。
- 对**已发布的正式包**重跑一遍 tarball 安装彩排。

## 3. 发布节奏（一次发一个，间隔约两周）

顺序：**engram → skillet → tracelet**（差异化最强的先发；每次发布都通过
umbrella 仓库互相引流，带动另外两个）。

标题/钩子/回怼话术见 [`LAUNCH-HOOKS.md`](./LAUNCH-HOOKS.md)。中文社区（公众号/抖音/即刻/掘金）专用文案见 [`LAUNCH-ZH.md`](./LAUNCH-ZH.md)。每个工具的完整发布攻略在 `<工具>/docs/LAUNCH.md` 里——包括定稿的
Show HN 标题和正文、渠道清单、回帖策略。要点：

- 周二/周三早上 8 点（太平洋时间）发帖。**前 3 小时回复每一条评论。**
- 每个 README 顶部都有演示 GIF；`examples/` 目录是"30 秒见效"的证明。
- 发布周冻结新功能——只修评论区里用户实际撞到的问题。
- 盯紧两个反馈漏斗：engram 的 `recall-quality` issue 模板（坏查询直接
  变成测试用例）、skillet 的 `skill-submission` 模板（registry 内容增长）。

## 已验证清单（不用重做）

- 四个仓库 CI 全绿（3 系统 × Node 18/20/22）；umbrella 每周自动跑一次
  跨仓库端到端集成测试。
- Tarball 彩排：`npm pack` → 隔离环境全局安装 → 真实工作流，三个全过。
- 三个 hero GIF 已录制（可复现：录制脚本在各自 `docs/` 下）。
- 安全检查：tracelet viewer 通过 XSS 探针；skillet 有路径穿越防护；
  engram 有 PDF 二进制垃圾三层防线。
- Claude Code 插件可直接从 GitHub 安装：
  `/plugin marketplace add jnMetaCode/local-agent-toolkit`。
- Registry：22 个已逐一验证的技能；gallery 在线：
  https://jnmetacode.github.io/skillet/。
- engram 召回质量基准：hit@1 92% / hit@3 100%（25 条自然语言查询），
  已作为阈值断言接入 CI，排序回归会直接挂测试。
