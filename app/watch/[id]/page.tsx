"use client"

import { use } from "react"
import useSWR from "swr"
import Link from "next/link"
import { ArrowLeft, VideoOff } from "lucide-react"
import { fetchVideo, fetchVideos, resolveVideoSrc, type ApiVideo } from "@/lib/api"
import { VideoCard } from "@/components/video-card"
import { Button } from "@/components/ui/button"

function uploaderName(v: ApiVideo): string {
  const u = v.user ?? v.uploader
  if (u && typeof u === "object" && "name" in u) return u.name
  return "Unknown channel"
}

export default function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: video, error, isLoading } = useSWR<ApiVideo>(
    ["video", id],
    () => fetchVideo(id),
    { revalidateOnFocus: false },
  )
  const { data: all } = useSWR<ApiVideo[]>("videos", fetchVideos, {
    revalidateOnFocus: false,
  })

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-[1600px] px-4 py-6">
        <div className="aspect-video w-full max-w-4xl animate-pulse rounded-xl bg-secondary" />
      </main>
    )
  }

  if (error || !video) {
    return (
      <main className="mx-auto flex w-full max-w-[1600px] flex-col items-center gap-4 px-4 py-24 text-center">
        <VideoOff className="size-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">This video could not be loaded.</p>
        <Button render={<Link href="/" />} variant="secondary">
          Back to home
        </Button>
      </main>
    )
  }

  const src = resolveVideoSrc(video)
  const related = (all ?? []).filter((v) => v._id !== video._id).slice(0, 8)
  const initial = uploaderName(video).charAt(0).toUpperCase()

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-6">
      <Button render={<Link href="/" />} variant="ghost" size="sm" className="mb-4 gap-2">
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
            {src ? (
              <video src={src} controls autoPlay className="size-full" />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                No playable source
              </div>
            )}
          </div>

          <h1 className="mt-4 text-xl font-semibold text-pretty">{video.title}</h1>

          <div className="mt-3 flex items-center gap-3 border-b border-border pb-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
              {initial}
            </div>
            <div>
              <p className="font-medium">{uploaderName(video)}</p>
              {typeof video.views === "number" && (
                <p className="text-xs text-muted-foreground">{video.views} views</p>
              )}
            </div>
          </div>

          {video.description && (
            <div className="mt-4 rounded-xl bg-secondary/50 p-4">
              <p className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
                {video.description}
              </p>
            </div>
          )}
        </div>

        <aside className="w-full shrink-0 lg:w-96">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            Up next
          </h2>
          <div className="flex flex-col gap-4">
            {related.length === 0 ? (
              <p className="text-sm text-muted-foreground">No other videos yet.</p>
            ) : (
              related.map((v) => <VideoCard key={v._id} video={v} />)
            )}
          </div>
        </aside>
      </div>
    </main>
  )
}
