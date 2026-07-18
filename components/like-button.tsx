"use client"

import { useEffect, useState } from "react"
import { ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getLikedIds, isLiked, toggleLike } from "@/lib/social"

export function LikeButton({ videoId }: { videoId: string }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)

  // Seed a stable pseudo-count from the id so it looks populated.
  useEffect(() => {
    let base = 0
    for (const ch of videoId) base = (base + ch.charCodeAt(0)) % 900
    setCount(base + 42)
    setLiked(isLiked(videoId))
  }, [videoId])

  useEffect(() => {
    const sync = () => setLiked(isLiked(videoId))
    window.addEventListener("yt-social-change", sync)
    return () => window.removeEventListener("yt-social-change", sync)
  }, [videoId])

  function onClick() {
    const nowLiked = toggleLike(videoId)
    setLiked(nowLiked)
  }

  const shown = count + (liked ? 1 : 0)

  return (
    <Button
      type="button"
      variant={liked ? "default" : "secondary"}
      onClick={onClick}
      className="gap-2"
      aria-pressed={liked}
    >
      <ThumbsUp className="size-4" />
      {shown.toLocaleString()}
    </Button>
  )
}
