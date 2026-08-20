import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { AuthForm } from "@/components/auth-form"
import { AuthShell } from "@/components/auth-shell"

export default async function SignUpPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect("/")

  return (
    <AuthShell
      title="Create your account"
      description="Join the CAPACITI team and generate content in seconds."
    >
      <AuthForm mode="sign-up" />
    </AuthShell>
  )
}
