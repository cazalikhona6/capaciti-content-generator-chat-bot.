import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingHero({ isAuthed }: { isAuthed: boolean }) {
  return (
    <section className="relative overflow-hidden">
      <div className="brand-glow pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 py-24 text-center md:py-32">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
          <Sparkles className="size-3.5 text-accent" />
          AI content, on-brand for CAPACITI
        </span>

        <h1 className="max-w-3xl text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          From a quick brief to{" "}
          <span className="brand-text">brilliant content</span> in seconds.
        </h1>

        <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Draft social posts, emails, and announcements from a short brief, then
          refine every line in a conversation until it sounds exactly right.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {isAuthed ? (
            <Button
              render={<Link href="/studio" />}
              nativeButton={false}
              size="lg"
              className="h-12 px-7 text-base"
            >
              Open the Studio
              <ArrowRight data-icon="inline-end" />
            </Button>
          ) : (
            <>
              <Button
                render={<Link href="/sign-up" />}
                nativeButton={false}
                size="lg"
                className="h-12 px-7 text-base"
              >
                Start creating free
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                render={<Link href="/sign-in" />}
                nativeButton={false}
                size="lg"
                variant="outline"
                className="h-12 px-7 text-base"
              >
                I already have an account
              </Button>
            </>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Built for the CAPACITI team &middot; No credit card to get started
        </p>
      </div>
    </section>
  )
}
