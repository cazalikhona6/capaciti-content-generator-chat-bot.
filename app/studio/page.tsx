import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { AppHeader } from "@/components/app-header"
import { Workspace } from "@/components/workspace"

export default async function StudioPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader email={session.user.email} />
      <Workspace />
    </div>
  )
}
