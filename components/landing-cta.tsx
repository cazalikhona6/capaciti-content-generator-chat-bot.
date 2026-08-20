import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingCta({ isAuthed }: { isAuthed: boolean }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-24">
      <div className="brand-gradient relative overflow-hidden rounded-3xl px-6 py-16 text-center text-primary-foreground shadow-lg md:px-16">
        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Ready to write your next post in a minute, not an hour?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-primary-foreground/80">
          Sign in and turn your next brief into ready-to-share content.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            render={<Link href={isAuthed ? "/studio" : "/sign-up"} />}
            nativeButton={false}
            size="lg"
            variant="secondary"
            className="h-12 px-7 text-base"
          >
            {isAuthed ? "Open the Studio" : "Get started free"}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </section>
  )
}
