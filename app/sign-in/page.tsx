import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { AuthForm } from "@/components/auth-form"
import { AuthShell } from "@/components/auth-shell"

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect("/")

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to start drafting on-brand content."
    >
      <AuthForm mode="sign-in" />
    </AuthShell>
  )
}
