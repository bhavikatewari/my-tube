"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { Menu, Search, Upload, PlaySquare, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

function SearchBar() {
  const router = useRouter()
  const params = useSearchParams()
  const [q, setQ] = useState(params.get("q") ?? "")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = q.trim()
    router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/")
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-1 items-center justify-center">
      <div className="flex w-full max-w-xl items-center">
        <div className="flex flex-1 items-center rounded-l-full border border-border bg-secondary/40 px-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            aria-label="Search videos"
            className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="submit"
          aria-label="Search"
          className="flex h-10 items-center rounded-r-full border border-l-0 border-border bg-secondary px-5 text-foreground hover:bg-secondary/80"
        >
          <Search className="size-5" />
        </button>
      </div>
    </form>
  )
}

export function SiteHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 flex items-center gap-4 border-b border-border bg-background/95 px-4 py-2 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Menu" className="hidden md:inline-flex">
          <Menu className="size-5" />
        </Button>
        <Link href="/" className="flex items-center gap-1.5">
          <PlaySquare className="size-7 text-primary" />
          <span className="text-lg font-bold tracking-tight">MyTube</span>
        </Link>
      </div>

      <Suspense fallback={<div className="flex-1" />}>
        <SearchBar />
      </Suspense>

      <div className="flex items-center gap-2">
        <Button render={<Link href="/upload" />} variant="ghost" size="sm" className="gap-2">
          <Upload className="size-5" />
          <span className="hidden sm:inline">Upload</span>
        </Button>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
              <User className="size-4" />
              {user.name}
            </span>
            <Button variant="ghost" size="icon" aria-label="Log out" onClick={logout}>
              <LogOut className="size-5" />
            </Button>
          </div>
        ) : (
          <Button render={<Link href="/auth" />} size="sm">
            Sign in
          </Button>
        )}
      </div>
    </header>
  )
}
