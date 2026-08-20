import { auth } from "@/lib/auth"
import { buildSystemPrompt, CONTENT_MODEL, isValidBrief } from "@/lib/content/prompt"
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"
import { headers } from "next/headers"

// Allow streaming responses up to 30 seconds.
export const maxDuration = 30

export async function POST(req: Request) {
  // Auth gate: only signed-in users can generate content.
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 })
  }

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return new Response("Invalid JSON", { status: 400 })
  }

  const { messages, brief } = (payload ?? {}) as {
    messages?: UIMessage[]
    brief?: unknown
  }

  // The brief drives the system prompt. It is validated against a closed set
  // of options server-side, so the client can never inject its own system
  // instructions — free text is only ever used as subject matter.
  if (!isValidBrief(brief)) {
    return new Response("Invalid or missing brief", { status: 400 })
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("No messages provided", { status: 400 })
  }

  const result = streamText({
    model: CONTENT_MODEL,
    system: buildSystemPrompt(brief),
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
