import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingNav({ isAuthed }: { isAuthed: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="brand-gradient flex size-8 items-center justify-center rounded-lg text-primary-foreground shadow-sm">
            <Sparkles className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            CAPACITI Content Studio
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {isAuthed ? (
            <Button
              render={<Link href="/studio" />}
              nativeButton={false}
              size="sm"
              className="h-9 px-4"
            >
              Open Studio
            </Button>
          ) : (
            <>
              <Button
                render={<Link href="/sign-in" />}
                nativeButton={false}
                variant="ghost"
                size="sm"
                className="h-9 px-4"
              >
                Sign in
              </Button>
              <Button
                render={<Link href="/sign-up" />}
                nativeButton={false}
                size="sm"
                className="h-9 px-4"
              >
                Get started
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
