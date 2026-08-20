"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Sparkles } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function AppHeader({ email }: { email: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function signOut() {
    setLoading(true)
    await authClient.signOut()
    router.push("/sign-in")
    router.refresh()
  }

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">CAPACITI Content Studio</p>
            <p className="text-xs text-muted-foreground">AI content generator</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {email}
          </span>
          <Button variant="outline" size="sm" onClick={signOut} disabled={loading}>
            {loading ? <Spinner data-icon="inline-start" /> : <LogOut data-icon="inline-start" />}
            Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}
