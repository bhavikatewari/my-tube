"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { mutate } from "swr"
import { Upload, Film, Loader2 } from "lucide-react"
import { uploadVideo } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

export default function UploadPage() {
  const router = useRouter()
  const { user, token, loading } = useAuth()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) router.replace("/auth?next=/upload")
  }, [loading, user, router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!token) {
      setError("You must be signed in to upload.")
      return
    }
    if (!file) {
      setError("Please choose a video file.")
      return
    }
    setSubmitting(true)
    try {
      const created = await uploadVideo({ title, description, file }, token)
      await mutate("videos")
      router.push(`/watch/${created._id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.")
      setSubmitting(false)
    }
  }

  if (loading || !user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">Upload a video</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Share your video with the MyTube community.
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-secondary/30 px-6 py-12 text-center transition-colors hover:border-primary/60"
        >
          <Film className="size-10 text-muted-foreground" />
          {file ? (
            <span className="text-sm font-medium">{file.name}</span>
          ) : (
            <>
              <span className="text-sm font-medium">Click to select a video file</span>
              <span className="text-xs text-muted-foreground">MP4, WebM, and more</span>
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a title that describes your video"
            className="h-10 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell viewers about your video"
            rows={4}
            className="rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={submitting} className="gap-2">
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Publish
              </>
            )}
          </Button>
          <Button render={<Link href="/" />} nativeButton={false} type="button" variant="ghost">
            Cancel
          </Button>
        </div>
      </form>
    </main>
  )
}
