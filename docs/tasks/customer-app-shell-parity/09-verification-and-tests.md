# Task 09: Verification and Tests

## Objective

Run verification gates (`typecheck`, `lint`, `build`) and add component-level unit tests for `MyIapLayout` and its subcomponents.

## Verification Checklist

1. `pnpm --filter iap-app typecheck`: Must pass cleanly.
2. `pnpm --filter iap-app lint`: Must pass cleanly with zero ESLint/boundary errors.
3. `pnpm --filter iap-app build`: Must build the customer app successfully.
4. Unit Tests in `apps/iap-app/src/shared/app-shell/test/`:
   - `layout-loading.test.tsx`: Test loading state and authenticated children rendering.
   - `my-iap-header.test.tsx`: Test branding, logo, navigation links, panel switcher, and user actions.
   - `my-iap-user-actions.test.tsx`: Test user display name, email, avatar fallback, and sign out trigger.
   - `my-iap-bottom-nav.test.tsx`: Test mobile nav links, active colors, and support button.
   - `my-iap-footer.test.tsx`: Test footer links and copyright.
