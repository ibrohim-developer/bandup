import { GoogleGenerativeAI, GenerateContentRequest, GenerateContentResult } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const baseModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRetry(
  request: GenerateContentRequest,
  maxRetries = 4
): Promise<GenerateContentResult> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await baseModel.generateContent(request);
    } catch (err: unknown) {
      lastError = err;
      const status = (err as { status?: number })?.status;
      const message = (err as { message?: string })?.message;
      const is503 = status === 503 || message?.includes("503");

      if (is503 && attempt < maxRetries) {
        const delayMs = Math.min(1000 * 2 ** attempt, 16000); // 1s, 2s, 4s, 8s
        console.warn(`[gemini] 503 on attempt ${attempt + 1}, retrying in ${delayMs}ms...`);
        await sleep(delayMs);
        continue;
      }

      throw err;
    }
  }

  throw lastError;
}

export const geminiFlash = {
  generateContent: generateWithRetry,
};

export default genAI;
