import { createOpenRouter } from "@openrouter/ai-sdk-provider"

export function createOpenRouterClient(apiKey: string) {
  return createOpenRouter({ apiKey })
}

// Default client using global key (fallback when no per-org key)
export function getOpenRouterModel(
  apiKey: string,
  model = "anthropic/claude-3-5-sonnet"
) {
  const openrouter = createOpenRouterClient(apiKey)
  return openrouter(model)
}
