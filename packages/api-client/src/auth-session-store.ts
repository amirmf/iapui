import type { AuthUser } from '@iap/api-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthSessionState = {
  accessToken: string | null
  clearSession: () => void
  setSession: (session: { accessToken: string; user: AuthUser }) => void
  user: AuthUser | null
}

export const useAuthSessionStore = create<AuthSessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      clearSession: () => set({ accessToken: null, user: null }),
      setSession: ({ accessToken, user }) => set({ accessToken, user }),
      user: null,
    }),
    {
      name: 'iap-auth-session',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
)
