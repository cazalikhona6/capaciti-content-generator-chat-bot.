import { ClipboardList, MessagesSquare, SlidersHorizontal } from "lucide-react"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const FEATURES = [
  {
    icon: ClipboardList,
    title: "Brief in, draft out",
    description:
      "Give it a topic, a few key points, and your audience. Get a polished first draft instantly, no blank page required.",
  },
  {
    icon: SlidersHorizontal,
    title: "Dial in the voice",
    description:
      "Pick the content type, tone, and length. Every draft comes back on-brand and ready for the channel you have in mind.",
  },
  {
    icon: MessagesSquare,
    title: "Refine in conversation",
    description:
      'Not quite right? Just say "make it shorter" or "more playful" and watch it rewrite in real time.',
  },
] as const

export function LandingFeatures() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Everything you need to ship content faster
        </h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          A focused workspace that takes you from idea to publish-ready copy
          without the back-and-forth.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card
            key={feature.title}
            className="border-border/70 transition-colors hover:border-primary/40"
          >
            <CardHeader>
              <div className="brand-gradient mb-2 flex size-11 items-center justify-center rounded-xl text-primary-foreground shadow-sm">
                <feature.icon className="size-5" />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <CardDescription className="text-pretty leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
