---
name: tracelet-instrument
description: Instrument an AI agent or LLM app with OpenTelemetry and watch its runs live in tracelet (local DevTools). Use when asked to add tracing/observability to an agent, or to debug what an agent actually did.
version: 1.0.0
license: MIT
keywords: [observability, opentelemetry, otlp, tracing, debugging, tracelet, agents]
homepage: https://github.com/jnMetaCode/tracelet
---

# tracelet-instrument

Goal: make an agent's execution visible — every LLM call, tool call, prompt,
token count and latency — without sending anything to a cloud service.
[tracelet](https://github.com/jnMetaCode/tracelet) is a local OTLP collector +
UI; any OpenTelemetry exporter pointed at `http://127.0.0.1:4318` shows up live.

## Procedure

1. **Start the collector** (keep it running in a terminal):

   ```bash
   npx @jnmetacode/tracelet        # ingests OTLP on :4318, UI on :4321
   ```

2. **Point the app's exporter at it.** For most OpenTelemetry SDKs the zero-code
   route is environment variables:

   ```bash
   export OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318
   export OTEL_SERVICE_NAME=my-agent
   ```

3. **Framework-specific wiring** (pick the one that matches the codebase):

   **Vercel AI SDK** — pass telemetry on each call and register a Node tracer:

   ```js
   const result = await generateText({
     model, prompt,
     experimental_telemetry: { isEnabled: true },
   });
   ```

   **OpenTelemetry JS (manual spans)**:

   ```js
   import { NodeSDK } from '@opentelemetry/sdk-node';
   import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
   new NodeSDK({ traceExporter: new OTLPTraceExporter({ url: 'http://127.0.0.1:4318/v1/traces' }) }).start();
   ```

   **Python**: `pip install opentelemetry-sdk opentelemetry-exporter-otlp-proto-http`,
   then the same `OTEL_EXPORTER_OTLP_ENDPOINT` env var works.

4. **Name spans so the waterfall reads like the agent's plan**: one root span per
   run (`agent.run`), one child per tool call (`tool.<name>`) and per model call.
   Attach `gen_ai.request.model`, `input.value`, `output.value` attributes —
   tracelet recognizes the GenAI/OpenInference conventions and renders prompts,
   tokens and tool I/O.

5. **Verify**: trigger one agent run, open `http://127.0.0.1:4321`, and confirm
   the trace shows the expected span tree with prompts/tokens. If nothing
   arrives, the exporter is usually pointed at the wrong port (4318) or batching
   hasn't flushed — force a flush/shutdown on process exit.

Both OTLP/HTTP **protobuf** (SDK default) and **JSON** are accepted — no
exporter config gymnastics needed.
