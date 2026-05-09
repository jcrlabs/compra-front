import { create } from 'zustand'

interface User { id: string; email: string; name: string }

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

const storedToken = localStorage.getItem('token')
const storedUser = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null } })()

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  user: storedUser,
  isAuthenticated: !!storedToken,
  setAuth: (token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ token, user, isAuthenticated: true })
  },
  clearAuth: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null, isAuthenticated: false })
  },
}))
