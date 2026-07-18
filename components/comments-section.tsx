"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import {
  addComment,
  getComments,
  removeComment,
  type LocalComment,
} from "@/lib/social"

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return "just now"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

export function CommentsSection({ videoId }: { videoId: string }) {
  const { user } = useAuth()
  const [comments, setComments] = useState<LocalComment[]>([])
  const [text, setText] = useState("")

  const refresh = useCallback(() => setComments(getComments(videoId)), [videoId])

  useEffect(() => {
    refresh()
    window.addEventListener("yt-social-change", refresh)
    return () => window.removeEventListener("yt-social-change", refresh)
  }, [refresh])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || !user) return
    addComment(videoId, user.name, trimmed)
    setText("")
  }

  return (
    <section className="mt-6">
      <h2 className="mb-4 text-base font-semibold">
        {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
      </h2>

      {user ? (
        <form onSubmit={submit} className="mb-6 flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
              className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="mt-2 flex justify-end">
              <Button type="submit" size="sm" disabled={!text.trim()}>
                Comment
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <p className="mb-6 text-sm text-muted-foreground">
          <Link href="/auth" className="text-primary underline">
            Sign in
          </Link>{" "}
          to add a comment.
        </p>
      )}

      <ul className="flex flex-col gap-4">
        {comments.length === 0 ? (
          <li className="text-sm text-muted-foreground">
            No comments yet. Be the first!
          </li>
        ) : (
          comments.map((c) => (
            <li key={c.id} className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
                {c.author.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{c.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(c.createdAt)}
                  </span>
                </p>
                <p className="whitespace-pre-wrap text-sm text-foreground/90">
                  {c.text}
                </p>
              </div>
              {user?.name === c.author && (
                <button
                  type="button"
                  onClick={() => removeComment(c.id)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="Delete comment"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </li>
          ))
        )}
      </ul>
    </section>
  )
}
