import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  evidence: z.string().max(8000),
  question: z.string().max(1000).nullable(),
});

const SYSTEM = `You are the BhuSetu AI Investigator, a decision-support assistant for geospatial land-record conflicts.
Rules: never claim to know the legally correct boundary; never declare any source the truth; distinguish source facts, system findings and your own interpretation; state uncertainty and evidence gaps; this is demo data, not official records. Be concise (under 220 words), plain text with short headings.`;

export const investigate = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false as const, error: "AI is not configured." };
    const { streamText } = await import("ai");
    const { createOpenAI } = await import("@ai-sdk/openai");
    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    const prompt = data.question
      ? `Evidence:\n${data.evidence}\n\nInvestigator question: ${data.question}`
      : `Evidence:\n${data.evidence}\n\nWrite an investigation summary with: What was observed; Supporting evidence; Evidence introducing uncertainty; Possible contributing factors; Evidence gaps; Suggested investigation focus; Confidence explanation.`;
    try {
      const result = streamText({
        model: lovable.responses("openai/gpt-6-astra"),
        system: SYSTEM,
        prompt,
        providerOptions: { openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] } },
      });
      const text = await result.text;
      return { ok: true as const, text: text || "The AI returned no answer. Try again." };
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      const msg = status === 402 ? "AI credits are used up. Add credits in Settings → Plans & credits." : status === 429 ? "Too many requests — wait a moment and try again." : "AI request failed. Try again later.";
      return { ok: false as const, error: msg };
    }
  });
