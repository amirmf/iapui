import type { AuthUser } from '@iap/api-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthSessionState = {
  accessToken: string | null
  clearSession: () => void
  setSession: (session: { accessToken: string; user: AuthUser }) => void
  user: AuthUser | null
}

export const useAuthStore = create<AuthSessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      clearSession: () => set({ accessToken: null, user: null }),
      setSession: ({ accessToken, user }) => set({ accessToken, user }),
      user: null,
    }),
    {
      migrate: (persistedState) => {
        const persisted = persistedState as { accessToken?: unknown }

        return {
          accessToken:
            typeof persisted.accessToken === 'string'
              ? persisted.accessToken
              : null,
          user: null,
        }
      },
      name: 'iap-auth-session',
      partialize: (state) => ({
        accessToken: state.accessToken,
        // The access token is the durable session credential. The user is
        // intentionally refreshed from /auth/me after a page reload so roles
        // and account access cannot become stale in local storage.
        user: null,
      }),
      version: 1,
    }
  )
)
