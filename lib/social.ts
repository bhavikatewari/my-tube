"use client"

// Client-only likes & comments. NOTE: the backend does not expose likes or
// comments endpoints, so this data lives entirely in the browser via
// localStorage. It is per-browser and never synced to the server.

export interface LocalComment {
  id: string
  videoId: string
  author: string
  text: string
  createdAt: number
}

const LIKES_KEY = "yt_clone_likes"
const COMMENTS_KEY = "yt_clone_comments"

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new Event("yt-social-change"))
  } catch {
    // storage full / unavailable — ignore
  }
}

// ---- Likes (a set of liked video ids for this browser) ----
export function getLikedIds(): string[] {
  return readJSON<string[]>(LIKES_KEY, [])
}

export function isLiked(videoId: string): boolean {
  return getLikedIds().includes(videoId)
}

export function toggleLike(videoId: string): boolean {
  const ids = new Set(getLikedIds())
  let liked: boolean
  if (ids.has(videoId)) {
    ids.delete(videoId)
    liked = false
  } else {
    ids.add(videoId)
    liked = true
  }
  writeJSON(LIKES_KEY, Array.from(ids))
  return liked
}

// ---- Comments ----
export function getComments(videoId: string): LocalComment[] {
  const all = readJSON<LocalComment[]>(COMMENTS_KEY, [])
  return all
    .filter((c) => c.videoId === videoId)
    .sort((a, b) => b.createdAt - a.createdAt)
}

export function addComment(
  videoId: string,
  author: string,
  text: string,
): LocalComment {
  const all = readJSON<LocalComment[]>(COMMENTS_KEY, [])
  const comment: LocalComment = {
    id: crypto.randomUUID(),
    videoId,
    author,
    text,
    createdAt: Date.now(),
  }
  writeJSON(COMMENTS_KEY, [comment, ...all])
  return comment
}

export function removeComment(id: string) {
  const all = readJSON<LocalComment[]>(COMMENTS_KEY, [])
  writeJSON(
    COMMENTS_KEY,
    all.filter((c) => c.id !== id),
  )
}
