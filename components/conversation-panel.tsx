"use client"

import { useEffect, useRef, useState } from "react"
import type { UIMessage } from "ai"
import { Copy, RotateCcw, Send, Sparkles, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

function textOf(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export function ConversationPanel({
  messages,
  status,
  error,
  firstTopic,
  contentTypeLabel,
  onFollowUp,
  onStop,
  onReset,
  onCopy,
}: {
  messages: UIMessage[]
  status: "submitted" | "streaming" | "ready" | "error"
  error: Error | undefined
  firstTopic: string
  contentTypeLabel: string
  onFollowUp: (text: string) => void
  onStop: () => void
  onReset: () => void
  onCopy: (text: string) => void
}) {
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const busy = status === "submitted" || status === "streaming"
  const hasContent = messages.length > 0

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, status])

  function submit() {
    const value = input.trim()
    if (!value || busy) return
    onFollowUp(value)
    setInput("")
  }

  return (
    <div className="flex min-h-[60vh] flex-col overflow-hidden rounded-xl border bg-card lg:min-h-0">
      <header className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Generated content</h2>
        </div>
        {hasContent && (
          <Button variant="ghost" size="sm" onClick={onReset} disabled={busy}>
            <RotateCcw data-icon="inline-start" />
            New
          </Button>
        )}
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {!hasContent ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="size-6" />
            </div>
            <div className="max-w-xs">
              <p className="font-medium">Nothing generated yet</p>
              <p className="text-pretty text-sm text-muted-foreground">
                Fill in the brief on the left and hit Generate. Then refine the
                result by chatting below.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => {
              const text = textOf(message)

              // Hide the verbose auto-built first prompt; show a compact chip.
              if (index === 0 && message.role === "user") {
                return (
                  <div key={message.id} className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{contentTypeLabel}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {firstTopic}
                    </span>
                  </div>
                )
              }

              if (message.role === "user") {
                return (
                  <div key={message.id} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                      {text}
                    </div>
                  </div>
                )
              }

              return (
                <div key={message.id} className="group flex flex-col gap-2">
                  <div className="rounded-2xl rounded-tl-sm border bg-background px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
                    {text || (
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <Spinner /> Writing…
                      </span>
                    )}
                  </div>
                  {text && (
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCopy(text)}
                      >
                        <Copy data-icon="inline-start" />
                        Copy
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}

            {status === "submitted" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner /> Thinking…
              </div>
            )}

            {status === "error" && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive"
              >
                {error?.message && !error.message.includes("401")
                  ? error.message
                  : "Your session expired. Please sign in again."}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t p-3">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing &&
                e.keyCode !== 229
              ) {
                e.preventDefault()
                submit()
              }
            }}
            rows={1}
            placeholder={
              hasContent
                ? "Refine it… e.g. make it shorter, add emojis, more formal"
                : "Generate something first, then refine it here"
            }
            disabled={!hasContent && !busy}
            className="max-h-32 min-h-10 flex-1 resize-none"
          />
          {busy ? (
            <Button type="button" variant="secondary" onClick={onStop}>
              <Square data-icon="inline-start" />
              Stop
            </Button>
          ) : (
            <Button
              type="button"
              onClick={submit}
              disabled={!input.trim() || !hasContent}
            >
              <Send data-icon="inline-start" />
              Send
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
