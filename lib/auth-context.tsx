"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { loginUser, registerUser, type ApiUser } from "@/lib/api"

interface AuthState {
  user: ApiUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const STORAGE_KEY = "yt_clone_auth"

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { token: string; user: ApiUser }
        setToken(parsed.token)
        setUser(parsed.user)
      }
    } catch {
      // ignore corrupted storage
    }
    setLoading(false)
  }, [])

  const persist = useCallback((t: string, u: ApiUser) => {
    setToken(t)
    setUser(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: t, user: u }))
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await loginUser({ email, password })
      persist(res.token, res.user)
    },
    [persist],
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await registerUser({ name, email, password })
      const res = await loginUser({ email, password })
      persist(res.token, res.user)
    },
    [persist],
  )

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
