import { PostHog } from "posthog-node"

export function createPostHogServer(apiKey: string, host: string) {
  return new PostHog(apiKey, { host, flushAt: 1, flushInterval: 0 })
}

export type PostHogServer = ReturnType<typeof createPostHogServer>
