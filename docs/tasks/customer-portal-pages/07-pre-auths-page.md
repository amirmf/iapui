# Task 07: Pre-Authorizations Page (`/pre-auths/`)

## Reference & Target

- **Reference Page**: `insurance-ui/src/features/my-iap/pre-auths/pages/pre-auths-page.tsx`
- **Reference Route**: `insurance-ui/src/routes/_app/myiap/pre-auths/index.tsx`
- **Target Route**: `apps/iap-app/src/app/router/routes/_authenticated/pre-auths/index.tsx`
- **Target Page**: `apps/iap-app/src/features/pre-auths/pages/index/pre-auths-page.tsx`

## Component Breakdown

1. **`PreAuthsPage`** (`pages/index/pre-auths-page.tsx`):
   - Manages `filters` (`PreAuthFilterValues | null`) and `page` state (default `0`, size `9`).
   - TanStack Query hook: `usePreAuths(request)`:
     - Query key: `['preAuths', request]`
     - Calls `preAuthService.getPage(request, signal)`
   - Includes automatic page retreat effect with `ConfirmDialog` when a page > 0 returns empty content.
2. **`MyClaimRequestPageHeader`** (`components/my-claim-request-page-header.tsx`):
   - Title: `myiap.preAuths.title`.
   - Description: `myiap.preAuths.description`.
   - Refresh button enabled only when filters are active.
3. **`PreAuthFilter`** (`pages/index/components/pre-auth-filter.tsx`):
   - Filter inputs for patient national code, medical center, date range.
   - Triggers `onApply` (resets page to 0) or `onClear`.
4. **`PreAuthCard`** (`pages/index/components/pre-auth-card.tsx`):
   - Displays pre-authorization voucher card:
     - Pre-auth number and tracking code.
     - Medical provider / center name.
     - Authorized service category and ceiling amount.
     - Issue date, expiration date, and validity status.
5. **`Pagination`**:
   - Double pagination controls with custom count translation (`myiap.preAuths.pagination`).
6. **`ConfirmDialog`**:
   - Boundary step-back dialog preventing user stuck on empty pages after records change.

## API & Schema Contract

- **Endpoint**: `GET /my/iap/pre-auths/page-full`
- **Request Parameters**:
  - `page`: number (0-indexed)
  - `size`: number (default 9)
  - `filters`: object containing active filter values
- **Response Schema**:
  - `pagePreAuthSchema` validating array of `preAuthSchema` items.

## Translation Keys

- `myiap.preAuths.title`
- `myiap.preAuths.description`
- `myiap.preAuths.refresh`
- `myiap.preAuths.selectFilters`
- `myiap.preAuths.empty`
- `myiap.preAuths.emptyDescription`
- `myiap.preAuths.pagination`
- `myiap.preAuths.endOfListDialog.title`
- `myiap.preAuths.endOfListDialog.desc`
- `common.loading`
