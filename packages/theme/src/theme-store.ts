import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const THEME_STORAGE_KEY = 'iap-theme'

export type Theme = 'dark' | 'light'

type ThemeStore = {
  setTheme: (theme: Theme) => void
  theme: Theme
  toggleTheme: () => void
}

function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light'
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  try {
    const value: unknown = JSON.parse(
      window.localStorage.getItem(THEME_STORAGE_KEY) ?? '{}'
    )

    if (
      typeof value === 'object' &&
      value !== null &&
      'state' in value &&
      typeof value.state === 'object' &&
      value.state !== null &&
      'theme' in value.state &&
      isTheme(value.state.theme)
    ) {
      return value.state.theme
    }
  } catch {
    // Invalid persisted data falls back to the explicit light default.
  }

  return 'light'
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.classList.remove('dark', 'light')
  root.classList.add(theme)
  root.style.colorScheme = theme
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
      toggleTheme: () => {
        get().setTheme(get().theme === 'light' ? 'dark' : 'light')
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: ({ theme }) => ({ theme }),
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        applyTheme(state?.theme ?? 'light')
      },
    }
  )
)
