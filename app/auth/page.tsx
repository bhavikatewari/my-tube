"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { PlaySquare, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

function AuthForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get("next") ?? "/"
  const { login, register } = useAuth()

  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (mode === "login") {
        await login(email, password)
      } else {
        await register(name, email, password)
      }
      router.push(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <PlaySquare className="size-9 text-primary" />
        <h1 className="text-xl font-bold">
          {mode === "login" ? "Sign in to MyTube" : "Create your account"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "login"
            ? "Welcome back. Enter your details."
            : "Join to upload and share videos."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {mode === "register" && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus:border-primary"
            />
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus:border-primary"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={submitting} className="mt-1 gap-2">
          {submitting && <Loader2 className="size-4 animate-spin" />}
          {mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "login" ? "New to MyTube? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login")
            setError(null)
          }}
          className="font-medium text-primary hover:underline"
        >
          {mode === "login" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </div>
  )
}

export default function AuthPage() {
  return (
    <main className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-10">
      <Suspense fallback={<Loader2 className="size-6 animate-spin text-muted-foreground" />}>
        <AuthForm />
      </Suspense>
    </main>
  )
}
