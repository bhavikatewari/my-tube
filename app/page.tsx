"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Upload, VideoOff } from "lucide-react"
import { fetchVideos, type ApiVideo } from "@/lib/api"
import { VideoCard } from "@/components/video-card"
import { Button } from "@/components/ui/button"

function HomeFeed() {
  const params = useSearchParams()
  const query = (params.get("q") ?? "").toLowerCase()
  const { data, error, isLoading } = useSWR<ApiVideo[]>("videos", fetchVideos, {
    revalidateOnFocus: false,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-video w-full animate-pulse rounded-xl bg-secondary" />
            <div className="flex gap-3">
              <div className="size-9 shrink-0 animate-pulse rounded-full bg-secondary" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-4/5 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-2/5 animate-pulse rounded bg-secondary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <VideoOff className="size-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {"Couldn't reach the backend. It may be waking up — try again in a moment."}
        </p>
      </div>
    )
  }

  const videos = data ?? []
  const filtered = query
    ? videos.filter((v) => v.title?.toLowerCase().includes(query))
    : videos

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <VideoOff className="size-10 text-muted-foreground" />
        <div>
          <p className="font-medium">
            {query ? `No videos match "${query}"` : "No videos yet"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {query ? "Try a different search." : "Be the first to upload one."}
          </p>
        </div>
        {!query && (
          <Button render={<Link href="/upload" />} className="gap-2">
            <Upload className="size-4" />
            Upload a video
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filtered.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  )
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-6">
      <Suspense fallback={null}>
        <HomeFeed />
      </Suspense>
    </main>
  )
}
