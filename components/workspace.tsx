"use client"

import { useMemo, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { toast } from "sonner"
import {
  buildInitialUserMessage,
  CONTENT_TYPES,
  type Brief,
} from "@/lib/content/prompt"
import { BriefForm } from "@/components/brief-form"
import { ConversationPanel } from "@/components/conversation-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const DEFAULT_BRIEF: Brief = {
  contentType: "social-post",
  topic: "",
  tone: "friendly",
  length: "medium",
  audience: "",
  keyPoints: "",
}

export function Workspace() {
  const [brief, setBrief] = useState<Brief>(DEFAULT_BRIEF)
  // Keep the latest brief in a ref so every request (initial + follow-ups)
  // sends the current brief to the server, which owns the system prompt.
  const briefRef = useRef(brief)
  briefRef.current = brief

  const { messages, sendMessage, status, setMessages, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/generate",
      prepareSendMessagesRequest: ({ messages }) => ({
        body: { messages, brief: briefRef.current },
      }),
    }),
  })

  const [firstTopic, setFirstTopic] = useState("")

  const busy = status === "submitted" || status === "streaming"

  function patchBrief(patch: Partial<Brief>) {
    setBrief((prev) => ({ ...prev, ...patch }))
  }

  function handleGenerate() {
    if (!brief.topic.trim() || busy) return
    setMessages([])
    setFirstTopic(brief.topic.trim())
    sendMessage({ text: buildInitialUserMessage(brief) })
  }

  function handleFollowUp(text: string) {
    if (!text.trim() || busy) return
    sendMessage({ text })
  }

  function handleReset() {
    stop()
    setMessages([])
    setFirstTopic("")
  }

  const contentTypeLabel = useMemo(
    () => CONTENT_TYPES[brief.contentType].label,
    [brief.contentType],
  )

  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-6 lg:grid-cols-[380px_1fr]">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Content brief</CardTitle>
          </CardHeader>
          <CardContent>
            <BriefForm
              brief={brief}
              onChange={patchBrief}
              onSubmit={handleGenerate}
              busy={busy}
            />
          </CardContent>
        </Card>
      </div>

      <ConversationPanel
        messages={messages}
        status={status}
        error={error}
        firstTopic={firstTopic}
        contentTypeLabel={contentTypeLabel}
        onFollowUp={handleFollowUp}
        onStop={stop}
        onReset={handleReset}
        onCopy={(text) => {
          navigator.clipboard.writeText(text).then(
            () => toast.success("Copied to clipboard"),
            () => toast.error("Could not copy"),
          )
        }}
      />
    </div>
  )
}
