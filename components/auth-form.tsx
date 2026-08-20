"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"

type Mode = "sign-in" | "sign-up"

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const isSignUp = mode === "sign-up"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0],
        })
        if (error) {
          setError(error.message ?? "Could not create your account.")
          return
        }
      } else {
        const { error } = await authClient.signIn.email({ email, password })
        if (error) {
          setError("Incorrect email or password.")
          return
        }
      }
      router.push("/studio")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        {isSignUp && (
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="email">Work email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@capaciti.org.za"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder="••••••••"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isSignUp && (
            <FieldDescription>At least 8 characters.</FieldDescription>
          )}
        </Field>

        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Spinner data-icon="inline-start" />}
          {isSignUp ? "Create account" : "Sign in"}
        </Button>

        <FieldDescription className="text-center">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <Link href="/sign-in">Sign in</Link>
            </>
          ) : (
            <>
              New to CAPACITI Content Studio?{" "}
              <Link href="/sign-up">Create an account</Link>
            </>
          )}
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
