// API client for the YouTube-clone backend hosted on Render.
// Override the base URL with NEXT_PUBLIC_API_URL if you move the backend.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://youtube-clone-api-e22t.onrender.com"

export interface ApiUser {
  _id: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiVideo {
  _id: string
  title: string
  description?: string
  videoUrl?: string
  video?: string
  thumbnailUrl?: string
  views?: number
  user?: ApiUser | string
  uploader?: ApiUser | string
  createdAt?: string
  updatedAt?: string
}

export interface LoginResponse {
  token: string
  user: ApiUser
}

function authHeaders(token?: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text()
  let data: unknown
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }
  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data
        ? (data as { message?: string }).message
        : null) ?? `Request failed (${res.status})`
    throw new Error(message)
  }
  return data as T
}

// ---- Videos ----
export async function fetchVideos(): Promise<ApiVideo[]> {
  const res = await fetch(`${API_BASE}/api/videos`, { cache: "no-store" })
  return handle<ApiVideo[]>(res)
}
export async function uploadVideo(
  params: {title: string;description: string;file: File},
  token: string,
): Promise<ApiVideo>{
  const form=new FormData()
  form.append("title",params.title)
  form.append("description",params.description)
  form.append("video",params.file)
  const res=await fetch(`${API_BASE}/api/videos`,{
    method: "POST",
    headers: authHeaders(token),   // <-- THIS LINE TO CHANGE
    body: form,
  })
export async function fetchVideo(id: string): Promise<ApiVideo> {
  const res = await fetch(`${API_BASE}/api/videos/${id}`, { cache: "no-store" })
  return handle<ApiVideo>(res)
}

export async function uploadVideo(
  params: { title: string; description: string; file: File },
  token: string,
): Promise<ApiVideo> {
  const form = new FormData()
  form.append("title", params.title)
  form.append("description", params.description)
  form.append("video", params.file)
  const res = await fetch(`${API_BASE}/api/videos`, {
    method: "POST",
    headers: authHeaders(token),
    body: form,
  })
  return handle<ApiVideo>(res)
}

// ---- Auth ----
export async function registerUser(params: {
  name: string
  email: string
  password: string
}): Promise<ApiUser> {
  const res = await fetch(`${API_BASE}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  })
  return handle<ApiUser>(res)
}

export async function loginUser(params: {
  email: string
  password: string
}): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  })
  return handle<LoginResponse>(res)
}

// Resolve a playable URL from a video record (backend field names vary).
export function resolveVideoSrc(v: ApiVideo): string | undefined {
  const raw = v.videoUrl ?? v.video
  if (!raw) return undefined
  if (raw.startsWith("http")) return raw
  return `${API_BASE}${raw.startsWith("/") ? "" : "/"}${raw}`
}
