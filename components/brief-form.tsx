"use client"

import { Wand2 } from "lucide-react"
import {
  CONTENT_TYPES,
  LENGTHS,
  TONES,
  type Brief,
  type ContentType,
  type Length,
  type Tone,
} from "@/lib/content/prompt"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function BriefForm({
  brief,
  onChange,
  onSubmit,
  busy,
}: {
  brief: Brief
  onChange: (patch: Partial<Brief>) => void
  onSubmit: () => void
  busy: boolean
}) {
  const canSubmit = brief.topic.trim().length > 0 && !busy

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (canSubmit) onSubmit()
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="contentType">Content type</FieldLabel>
          <Select
            value={brief.contentType}
            onValueChange={(v) => onChange({ contentType: v as ContentType })}
          >
            <SelectTrigger id="contentType" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(CONTENT_TYPES).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="topic">What is it about?</FieldLabel>
          <Textarea
            id="topic"
            rows={3}
            placeholder="e.g. Applications are open for our 2026 Data Analytics programme"
            value={brief.topic}
            onChange={(e) => onChange({ topic: e.target.value })}
          />
          <FieldDescription>
            The main message or announcement. This is required.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="keyPoints">Key points (optional)</FieldLabel>
          <Textarea
            id="keyPoints"
            rows={3}
            placeholder="Deadline 30 June, no experience needed, fully funded, apply online"
            value={brief.keyPoints}
            onChange={(e) => onChange({ keyPoints: e.target.value })}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="audience">Audience (optional)</FieldLabel>
          <Input
            id="audience"
            placeholder="e.g. young graduates in Cape Town"
            value={brief.audience}
            onChange={(e) => onChange({ audience: e.target.value })}
          />
        </Field>

        <Field>
          <FieldLabel>Tone</FieldLabel>
          <Select
            value={brief.tone}
            onValueChange={(v) => onChange({ tone: v as Tone })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(TONES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>Length</FieldLabel>
          <ToggleGroup
            value={[brief.length]}
            onValueChange={(v) => {
              const next = v[v.length - 1] as Length | undefined
              if (next) onChange({ length: next })
            }}
            variant="outline"
            className="w-full [&>*]:flex-1"
          >
            {Object.keys(LENGTHS).map((key) => (
              <ToggleGroupItem key={key} value={key} className="capitalize">
                {key}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Field>

        <Button type="submit" disabled={!canSubmit} className="w-full">
          {busy ? <Spinner data-icon="inline-start" /> : <Wand2 data-icon="inline-start" />}
          Generate content
        </Button>
      </FieldGroup>
    </form>
  )
}
