import { create } from "./strapi/api";

type Model = "gemini-2.5-pro" | "gemini-2.5-flash";
type ModuleName = "writing" | "speaking" | "quiz";

// Vertex AI pricing per 1M tokens (USD), as of Jan 2026.
// Audio input is metered in tokens at 32 tokens/sec for Gemini 2.5.
const PRICING: Record<Model, { input: number; output: number }> = {
  "gemini-2.5-pro": { input: 1.25, output: 10 },
  "gemini-2.5-flash": { input: 0.3, output: 2.5 },
};

interface UsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

export function computeCost(
  model: Model,
  inputTokens: number,
  outputTokens: number
): number {
  const p = PRICING[model];
  return (inputTokens * p.input + outputTokens * p.output) / 1_000_000;
}

interface LogParams {
  userId: number | string | null;
  module: ModuleName;
  model: Model;
  usage: UsageMetadata | undefined;
  audioSeconds?: number;
  success?: boolean;
  context?: Record<string, unknown>;
}

export async function logAIUsage(params: LogParams): Promise<void> {
  const inputTokens = params.usage?.promptTokenCount ?? 0;
  const outputTokens = params.usage?.candidatesTokenCount ?? 0;
  const cost = computeCost(params.model, inputTokens, outputTokens);

  // Console line for live monitoring during dev / tail in prod.
  console.log(
    `[ai-cost] ${params.module} | ${params.model} | in=${inputTokens} out=${outputTokens}` +
      (params.audioSeconds ? ` audio=${params.audioSeconds}s` : "") +
      ` | $${cost.toFixed(5)} | user=${params.userId ?? "anon"}` +
      (params.success === false ? " | FAILED" : "")
  );

  try {
    await create("ai-usage-logs", {
      user: params.userId ?? null,
      module: params.module,
      model: params.model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      audio_seconds: params.audioSeconds ?? null,
      cost_usd: Number(cost.toFixed(6)),
      success: params.success ?? true,
      context: params.context ?? null,
    });
  } catch (err) {
    // Never let logging failure break the user-facing flow.
    console.error("[ai-cost] failed to persist log:", err);
  }
}
