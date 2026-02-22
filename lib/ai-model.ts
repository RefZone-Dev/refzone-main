import { openai } from "@ai-sdk/openai"

/**
 * Returns the AI model to use across all API routes.
 * Uses @ai-sdk/openai provider which reads OPENAI_API_KEY from env.
 */
export function getModel(modelId: string = "gpt-4o-mini") {
  return openai(modelId)
}
