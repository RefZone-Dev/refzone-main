import { createOpenAI } from "@ai-sdk/openai"

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
})

/**
 * Returns the AI model to use across all API routes.
 * Uses DeepSeek via the OpenAI-compatible chat completions API.
 */
export function getModel(modelId: string = "deepseek-chat") {
  return deepseek.chat(modelId)
}
