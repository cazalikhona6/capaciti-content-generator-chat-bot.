// Central content-generation configuration + prompt architecture.
//
// The MODEL is defined in exactly one place so it stays configurable.
// Every user-facing option (content type, tone, length, audience) is a
// closed set of values validated server-side; free-text fields are treated
// strictly as *content*, never as instructions that can override the system
// prompt. This keeps the prompt architecture (ROLE / CONTEXT / TASK / TONE /
// LENGTH / AUDIENCE / CONSTRAINTS / OUTPUT FORMAT) intact.

export const CONTENT_MODEL = "google/gemini-2.5-flash"

export const CONTENT_TYPES = {
  "social-post": {
    label: "Social media post",
    guidance:
      "A punchy social media post. Lead with a hook, keep sentences short, and end with a clear call to action. Use line breaks for readability. A few relevant hashtags are welcome but do not overdo it.",
  },
  email: {
    label: "Email",
    guidance:
      "A well-structured email with a subject line, a greeting, a clear body, and a sign-off. Keep paragraphs short and scannable.",
  },
  announcement: {
    label: "Announcement",
    guidance:
      "A clear announcement. State the news up front, then give the essential details (who, what, when, where, why), and close with next steps.",
  },
  "blog-intro": {
    label: "Blog intro",
    guidance:
      "An engaging opening for a blog article. Set up the topic, establish why it matters to the reader, and preview what the piece will cover.",
  },
  "job-post": {
    label: "Job / opportunity post",
    guidance:
      "A compelling opportunity post. Describe the role or programme, who it is for, the key benefits, and how to apply. Be inclusive and encouraging.",
  },
} as const

export type ContentType = keyof typeof CONTENT_TYPES

export const TONES = {
  professional: "Professional and polished",
  friendly: "Warm, friendly, and approachable",
  inspiring: "Inspiring and motivational",
  playful: "Playful and energetic",
  formal: "Formal and authoritative",
} as const

export type Tone = keyof typeof TONES

export const LENGTHS = {
  short: "Short — get straight to the point in a few sentences.",
  medium: "Medium — a balanced amount of detail.",
  long: "Long — thorough and detailed, but never padded.",
} as const

export type Length = keyof typeof LENGTHS

export interface Brief {
  contentType: ContentType
  topic: string
  tone: Tone
  length: Length
  audience: string
  keyPoints: string
}

export function isValidBrief(input: unknown): input is Brief {
  if (typeof input !== "object" || input === null) return false
  const b = input as Record<string, unknown>
  return (
    typeof b.contentType === "string" &&
    b.contentType in CONTENT_TYPES &&
    typeof b.topic === "string" &&
    b.topic.trim().length > 0 &&
    typeof b.tone === "string" &&
    b.tone in TONES &&
    typeof b.length === "string" &&
    b.length in LENGTHS &&
    typeof b.audience === "string" &&
    typeof b.keyPoints === "string"
  )
}

const ROLE =
  "You are CAPACITI's expert content assistant. CAPACITI is a tech talent accelerator that develops digital skills and creates pathways into tech careers for young people. You write clear, engaging, on-brand content for the CAPACITI team."

const GLOBAL_CONSTRAINTS = [
  "Write in a way that is inclusive, encouraging, and free of jargon unless the audience expects it.",
  "Never invent specific facts, statistics, dates, names, or quotes that were not provided in the brief. If a detail is needed but missing, keep the wording general rather than fabricating it.",
  "Return only the finished content itself — no preamble like 'Here is your post', no explanations, and no surrounding quotation marks.",
  "Use plain text suitable for pasting directly into the target channel. Do not wrap the output in markdown code fences.",
]

/**
 * Builds the structured system prompt from a validated brief.
 * Free-text fields (topic, audience, keyPoints) are clearly delimited so the
 * model treats them as subject matter, not as instructions.
 */
export function buildSystemPrompt(brief: Brief): string {
  const typeGuidance = CONTENT_TYPES[brief.contentType].guidance
  const audience = brief.audience.trim() || "a general CAPACITI audience"

  return [
    `# ROLE\n${ROLE}`,
    `# TASK\nWrite one piece of ${CONTENT_TYPES[brief.contentType].label.toLowerCase()} content.\n${typeGuidance}`,
    `# TONE\n${TONES[brief.tone]}.`,
    `# LENGTH\n${LENGTHS[brief.length]}`,
    `# AUDIENCE\nThe content is aimed at: """${audience}"""`,
    `# CONSTRAINTS\n${GLOBAL_CONSTRAINTS.map((c) => `- ${c}`).join("\n")}`,
    `# OUTPUT FORMAT\nProduce ready-to-publish content and nothing else.`,
  ].join("\n\n")
}

/** The first user turn: the topic and key points from the brief. */
export function buildInitialUserMessage(brief: Brief): string {
  const parts = [`Topic / brief: """${brief.topic.trim()}"""`]
  if (brief.keyPoints.trim()) {
    parts.push(`Key points to include: """${brief.keyPoints.trim()}"""`)
  }
  parts.push("Please write the content now.")
  return parts.join("\n\n")
}
