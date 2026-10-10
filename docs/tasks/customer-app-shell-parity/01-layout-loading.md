# Task 01: Layout Loading Component

## Objective

Extract the loading screen currently inlined in `AppShell` into a dedicated `LayoutLoading` component matching `insurance-ui` (`src/components/layout/layout-loading.tsx`).

## Reference Implementation

In `insurance-ui/src/components/layout/layout-loading.tsx`:
```tsx
import { PropsWithChildren } from 'react'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/auth-context.tsx'

function LayoutLoading({ children }: PropsWithChildren) {
  const { isLoading, isAuthenticated } = useAuth()
  const { t } = useTranslation()

  if (isLoading || !isAuthenticated) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
        <span className='ml-2'>{t('auth.login.loading')}</span>
      </div>
    )
  }
  return <>{children}</>
}

export default LayoutLoading
```

## Target Implementation Specification

- File path: `apps/iap-app/src/shared/app-shell/layout-loading.tsx`
- Consumes `useAuthSession()` from `@iap/auth`.
- If `isLoading || !isAuthenticated || !user`:
  - Renders `<div className='flex min-h-screen items-center justify-center bg-background text-foreground' aria-busy='true'>`
  - Uses `<Loader2 className='size-8 animate-spin' />` (or `<Spinner size="lg" />`)
  - Uses `t('auth.login.loading')` (fallback to `t('shell.loading')` or "در حال بررسی نشست...").
- When authenticated and loaded, renders `<>{children}</>`.
- Export: `export function LayoutLoading({ children }: PropsWithChildren)`.
