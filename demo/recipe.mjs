#!/usr/bin/env node
// End-to-end recipe: one agent run that uses all three tools, locally.
//
//   1. skillet installs a skill into the project   (capability)
//   2. engram remembers a decision, then recalls it (memory)
//   3. the run is traced into tracelet via OTLP      (observability)
//
// Everything runs on your machine. Zero external dependencies (Node 18+ fetch).
//   node demo/recipe.mjs
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const node = process.execPath;
const proj = mkdtempSync(join(tmpdir(), 'agentkit-demo-'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const c = { dim: (s) => `\x1b[2m${s}\x1b[0m`, b: (s) => `\x1b[1m${s}\x1b[0m`, g: (s) => `\x1b[32m${s}\x1b[0m` };

const procs = [];
function start(name, args, opts = {}) {
  const p = spawn(node, args, { stdio: 'ignore', ...opts });
  procs.push(p);
  return p;
}
function runCapture(args, opts = {}) {
  return new Promise((resolve) => {
    const p = spawn(node, args, { ...opts });
    let out = '';
    p.stdout.on('data', (d) => (out += d));
    p.stderr.on('data', (d) => (out += d));
    p.on('close', (code) => resolve({ code, out: out.trim() }));
  });
}
async function waitFor(url, opts, ms = 8000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      const r = await fetch(url, { ...opts, signal: AbortSignal.timeout(500) });
      if (r.ok) return true;
    } catch {}
    await sleep(150);
  }
  throw new Error(`timed out waiting for ${url}`);
}
function cleanup() {
  for (const p of procs) try { p.kill(); } catch {}
  try { rmSync(proj, { recursive: true, force: true }); } catch {}
}
process.on('exit', cleanup);
process.on('SIGINT', () => { cleanup(); process.exit(1); });

const ENGRAM = 'http://127.0.0.1:7077';
const TRACE_INGEST = 'http://127.0.0.1:4318/v1/traces';
const TRACE_UI = 'http://127.0.0.1:4321';

async function main() {
  console.log(c.b('\n🛠  local agent toolkit — end-to-end recipe\n'));

  // boot the two local servers
  start('engram', [join(ROOT, 'engram/src/cli.js'), 'serve', '--port', '7077', '--store', join(proj, 'memory.json')]);
  start('tracelet', [join(ROOT, 'tracelet/src/cli.js'), '--port', '4318', '--ui-port', '4321', '--no-open']);
  await waitFor(`${ENGRAM}/stats`);
  await waitFor(`${TRACE_UI}/api/traces`);
  console.log(c.dim('  started engram (memory) + tracelet (tracing), 100% local\n'));

  // 1) skillet — install a capability into the project
  const add = await runCapture(
    [join(ROOT, 'skillet/src/cli.js'), 'add', join(ROOT, 'demo/skills/note-taker')],
    { cwd: proj, env: { ...process.env, NO_COLOR: '1' } }
  );
  console.log(`${c.g('1) skillet')}  ${add.out.split('\n').find((l) => l.includes('installed')) || add.out}`);

  // 2) engram — remember a decision, then recall it
  const fact = 'On 2026-09-15 we shipped v1 with usage-based pricing and a free tier.';
  await fetch(`${ENGRAM}/remember`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: fact, source: 'recipe' }) });
  const rec = await (await fetch(`${ENGRAM}/recall`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query: 'when did we ship and what pricing' }) })).json();
  const hit = rec.results?.[0];
  console.log(`${c.g('2) engram ')}  remembered a decision, recalled it: ${c.dim(hit ? `"${hit.snippet}" (${hit.date || 'now'})` : '(none)')}`);

  // 3) tracelet — emit an OTLP trace of this "agent run"
  const ns = (ms) => String(Date.now() * 1e6 + ms * 1e6);
  const sv = (v) => ({ stringValue: v });
  const span = (id, parent, name, kind, off, dur, attrs) => ({
    traceId: 'a1b2c3d4e5f60718a1b2c3d4e5f60718', spanId: id, parentSpanId: parent || '',
    name, kind: 1, startTimeUnixNano: ns(off), endTimeUnixNano: ns(off + dur),
    status: { code: 1 }, attributes: Object.entries(attrs || {}).map(([k, v]) => ({ key: k, value: v })),
  });
  const otlp = { resourceSpans: [{ resource: { attributes: [{ key: 'service.name', value: sv('note-taker-agent') }] },
    scopeSpans: [{ scope: { name: 'recipe' }, spans: [
      span('1111111111111111', '', 'agent.run', 1, 0, 900, { 'openinference.span.kind': sv('AGENT'), 'input.value': sv('remember our launch decision') }),
      span('2222222222222222', '1111111111111111', 'engram.recall', 1, 120, 80, { 'openinference.span.kind': sv('TOOL'), 'tool.name': sv('engram_recall'), 'output.value': sv(hit?.snippet || '') }),
      span('3333333333333333', '1111111111111111', 'ai.generateText', 1, 250, 500, { 'gen_ai.system': sv('anthropic'), 'gen_ai.request.model': sv('claude-sonnet-4.5'), 'ai.response.text': sv('Noted: shipped 2026-09-15, usage-based pricing.') }),
    ] }] }] };
  await fetch(TRACE_INGEST, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(otlp) });
  await sleep(150);
  const traces = await (await fetch(`${TRACE_UI}/api/traces`)).json();
  const t = traces[0];
  console.log(`${c.g('3) tracelet')}  traced the run: ${c.dim(`${t?.spanCount} spans · ${t?.llmCalls} LLM · ${t?.toolCalls} tool · ${t?.tokens} tok`)}`);

  console.log(c.b('\n✓ One agent run: it had a skill, used memory, and was fully observable — all local.'));
  console.log(c.dim(`  Open ${TRACE_UI} to see the execution tree (the servers stop when this script exits).\n`));
}

main().then(() => process.exit(0)).catch((e) => { console.error('recipe failed:', e.message); process.exit(1); });
