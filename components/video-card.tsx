import Link from "next/link"
import { PlayCircle } from "lucide-react"
import { resolveVideoSrc, type ApiVideo } from "@/lib/api"

function uploaderName(v: ApiVideo): string {
  const u = v.user ?? v.uploader
  if (u && typeof u === "object" && "name" in u) return u.name
  return "Unknown channel"
}

function timeAgo(iso?: string): string {
  if (!iso) return ""
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${Math.max(mins, 1)} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} mo ago`
  return `${Math.floor(months / 12)} yr ago`
}

export function VideoCard({ video }: { video: ApiVideo }) {
  const src = resolveVideoSrc(video)
  const initial = uploaderName(video).charAt(0).toUpperCase()

  return (
    <Link href={`/watch/${video._id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-secondary">
        {video.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnailUrl || "/placeholder.svg"}
            alt={video.title}
            className="size-full object-cover transition-transform group-hover:scale-105"
          />
        ) : src ? (
          <video
            src={src}
            muted
            preload="metadata"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <PlayCircle className="size-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {initial}
        </div>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground text-pretty">
            {video.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{uploaderName(video)}</p>
          <p className="text-xs text-muted-foreground">
            {typeof video.views === "number" ? `${video.views} views · ` : ""}
            {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  )
}
