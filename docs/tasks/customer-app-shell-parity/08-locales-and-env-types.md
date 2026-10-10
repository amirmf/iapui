# Task 08: Locales and Vite Environment Types

## Objective

Ensure all required translation keys exist in `apps/iap-app/src/shared/i18n/locales/fa/common.json` and `vite-env.d.ts` is fully typed for tenant environment variables.

## Required Keys

1. `myiap.nav.specialDiseases`: `"بیماری‌های خاص"`
2. `myiap.nav.preAuths`: `"معرفی نامه های درمانی"`
3. `auth.login.loading`: `"در حال بررسی نشست..."`
4. `shell.loading`: `"در حال بررسی نشست..."`
5. `common.signOut`: `"خروج"`
6. `common.theme.toggle`: `"تغییر حالت شب و روز"`

## Vite Environment Types

In `apps/iap-app/src/vite-env.d.ts`:
```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_IAP_ADMIN_DOMAIN_URL: string
  readonly VITE_IAP_APP_DOMAIN_URL: string
  readonly VITE_LOGIN_COMPANY: string
  readonly VITE_LOGIN_LOGO: string
  readonly VITE_LOGIN_TITLE: string
  readonly VITE_MY_IAP_NAV_BACKGROUND: string
  readonly VITE_MY_IAP_NAV_BACKGROUND_DARK: string
}
```
