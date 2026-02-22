import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

/**
 * Returns the AI model to use across all API routes.
 * Uses Groq for fast, free LLM inference.
 */
export function getModel(modelId: string = "llama-3.3-70b-versatile") {
  return groq(modelId)
}
