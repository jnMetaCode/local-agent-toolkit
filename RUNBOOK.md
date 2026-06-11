# Release runbook — from zero to launched

English | [简体中文](./RUNBOOK.zh-CN.md)

> **STATUS (2026-06-11): PUBLISHED.** All three packages are live on npm
> (published from this machine's logged-in `jnmetacode` account, every release tagged
> with GitHub releases) and verified with a clean cache:
> [@jnmetacode/engram](https://www.npmjs.com/package/@jnmetacode/engram) ·
> [@jnmetacode/skillet](https://www.npmjs.com/package/@jnmetacode/skillet) ·
> [@jnmetacode/tracelet](https://www.npmjs.com/package/@jnmetacode/tracelet).
> Section 1 has ONE remaining optional item: add the `NPM_TOKEN` secret so
> *future* tag pushes publish automatically from CI (the workflow currently
> skips publish gracefully when the secret is absent). Next up: **section 3 —
> launch.**

## 1. The 30 minutes only you can do (P0)

1. **Claim the npm scope.** Register the npm username `jnmetacode`
   (https://www.npmjs.com/signup). If the username is taken, create an **org**
   named `jnmetacode` instead — orgs grant the same `@jnmetacode/*` scope, free
   for public packages. (Last-resort fallback: `@jn-metacode`, then update
   `package.json` + READMEs in all three repos.)
2. **Mint an Automation token** (npmjs.com → Access Tokens → *Automation*) and
   add it as the `NPM_TOKEN` Actions secret on **each** repo:
   ```bash
   for r in engram skillet tracelet; do
     gh secret set NPM_TOKEN --repo jnMetaCode/$r --body "<token>"
   done
   ```
3. **Tag** (this triggers `.github/workflows/publish.yml`: tests → `npm publish
   --provenance --access public`):
   ```bash
   for r in engram skillet tracelet; do
     (cd $r && git tag v0.1.0 && git push --tags)
   done
   ```
4. **Verify from a clean directory** (no checkout needed):
   ```bash
   npx @jnmetacode/engram --version
   npx @jnmetacode/skillet search pdf
   npx @jnmetacode/tracelet --help
   ```

## 2. Post-publish touch-ups (ask the assistant, ~10 min)

- Switch the Claude Code plugin's MCP commands from `npx github:jnMetaCode/…`
  to `npx @jnmetacode/…` (faster, registry-cached) in
  `.claude-plugin/plugin.json`, bump plugin version, push.
- Re-run the tarball rehearsal against the *published* packages.

## 3. Launch sequence (one tool at a time, ~2 weeks apart)

Order: **engram → skillet → tracelet** (strongest differentiator first; each
launch cross-links the umbrella repo, which lifts the other two).

Per launch, the playbook lives in `<tool>/docs/LAUNCH.md` — finalized Show HN
title + body, channel list, and reply guidance. The short version:

- Post Tue/Wed ~8am PT. Reply to **every** comment for the first 3 hours.
- The GIF is at the top of each README; the `examples/` folder is the 30-second
  proof. Don't ship new features during launch week — fix what commenters hit.
- Watch the feedback funnels: engram has a `recall-quality` issue template
  (bad query → test case), skillet has `skill-submission` (registry growth).

## What's already verified (don't re-do)

- CI green on 3 OS × Node 18/20/22, all repos; umbrella runs a weekly
  cross-repo end-to-end recipe.
- Tarball rehearsal: `npm pack` → global install → real workflows, all three.
- Hero GIFs recorded (reproducible: vhs tapes / Playwright script in `docs/`).
- XSS probe on tracelet's viewer; path-traversal guard in skillet; binary-PDF
  garbage guards in engram.
- Claude Code plugin installs from GitHub:
  `/plugin marketplace add jnMetaCode/local-agent-toolkit`.
- Registry: 22 verified skills; gallery live at
  https://jnmetacode.github.io/skillet/.
