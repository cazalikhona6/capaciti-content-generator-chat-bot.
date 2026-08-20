import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { LandingNav } from "@/components/landing-nav"
import { LandingHero } from "@/components/landing-hero"
import { LandingFeatures } from "@/components/landing-features"
import { LandingCta } from "@/components/landing-cta"

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const isAuthed = Boolean(session?.user)

  return (
    <div className="flex min-h-svh flex-col">
      <LandingNav isAuthed={isAuthed} />
      <main className="flex-1">
        <LandingHero isAuthed={isAuthed} />
        <LandingFeatures />
        <LandingCta isAuthed={isAuthed} />
      </main>
      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>CAPACITI Content Studio</p>
          <p>Draft. Refine. Publish.</p>
        </div>
      </footer>
    </div>
  )
}
