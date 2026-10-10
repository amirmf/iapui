# Task 07 — Complete reference comparison

## Page and route
- Reference page uses the shared reference header default back route and navigates to `/myiap/myclaims`; target uses the authenticated route equivalent `/myclaims/`.
- Preserve the target router's canonical URL while documenting the mapping; no route business logic is allowed.

## Form component contract
- Match reference child component names and order exactly.
- Match default values, optional `isForeign`, first-error focus/scroll, mutation success/error behavior, and reset payload.
- Match semantic alert icon/classes and destructive required markers.
- Keep the current workspace's `@iap/ui` DatePicker/Input API where its public contract differs from the reference API.

## API/schema/translation
- Every endpoint used by the reference must have a feature service/query owner and Zod request/response validation.
- Every translation key must exist in the current locale resource with the reference value.
- No page component may import transport clients directly.

## Architecture verification
- `src/app` route only composes the feature page.
- `features/my-claims/model` owns form and bank schemas.
- `features/my-claims/services` owns HTTP and response parsing.
- `features/my-claims/queries` owns TanStack Query definitions.
- Page-owned UI stays below `features/my-claims/pages/create/components`.
