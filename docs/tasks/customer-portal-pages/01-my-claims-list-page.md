# Task 01: My Claims List Page (`/myclaims/`)

## Reference & Target

- **Reference Page**: `insurance-ui/src/features/my-iap/claim-requests/pages/my-claim-requests-page.tsx`
- **Reference Route**: `insurance-ui/src/routes/_app/myiap/myclaims/index.tsx`
- **Target Route**: `apps/iap-app/src/app/router/routes/_authenticated/myclaims/index.tsx`
- **Target Page**: `apps/iap-app/src/features/claim-requests/pages/index/my-claim-requests-page.tsx`

## Component Breakdown

1. **`MyClaimRequestsPage`** (`pages/index/my-claim-requests-page.tsx`):
   - Wraps content in `MyClaimRequestProvider`.
   - Manages `page` state (default `0`, page size `9`) and `filters` state (`MyClaimRequestsFilterValues`).
   - Owns TanStack Query `useQuery`:
     - Key: `['myClaimRequests', page, 9, filters]`
     - Calls `myClaimRequestService.getPage({ page, size: 9, filters, signal })`
     - Cache settings: `staleTime: 10 * 1000`, `gcTime: 10 * 1000`, `refetchOnWindowFocus: false`
2. **`MyClaimRequestsAlert`** (`pages/index/components/my-claim-requests-alert.tsx`):
   - Renders operational alert and informational banner at the top of the claims list.
3. **`MyClaimRequestPageHeader`** (`components/my-claim-request-page-header.tsx`):
   - Displays page title (`myiap.claimRequests.title`), description (`myiap.claimRequests.description`).
   - Action buttons:
     - Refresh button with loading spinner on `isFetching`.
     - Create claim button (`Button asChild`) linking to `/myclaims/create/` with `IconPlus`.
4. **`MyClaimRequestsFilter`** (`pages/index/components/my-claim-requests-filter.tsx`):
   - Controlled search and filter form.
   - Resets `page` to `0` on filter change.
5. **`MyClaimRequestCard`** (`pages/index/components/my-claim-request-card.tsx`):
   - Card representation of a single claim request:
     - Tracking number, insured national code, patient name, submit date, requested amount.
     - Status badge with semantic variant.
     - Action link to view details (`/myclaims/$id/`).
     - Delete action button triggering delete dialog if status allows.
6. **`MyClaimRequestDeleteDialog`** (`components/my-claim-request-delete-dialog.tsx`):
   - Confirmation dialog for deleting draft/unsubmitted claims.
   - Calls `myClaimRequestService.delete(id)`.
   - Invalidates `myClaimRequests` query cache on success.
7. **`Pagination`** (`@iap/ui` or shared component):
   - Top and bottom paginator showing current page, total pages, total elements.

## API & Schema Contract

- **Endpoint**: `GET /my/iap/claim-requests/page-full`
- **Request Parameters**:
  - `page`: number (0-indexed)
  - `size`: number (default 9)
  - `filters`: object containing filter query params
- **Response Schema**:
  - Validated by `pageClaimRequestSchema` (using `@iap/api-types` common page schema factory).
  - Array of `claimRequestSchema` items (`content ?? []`).

## Translation Keys

- `myiap.claimRequests.title`
- `myiap.claimRequests.description`
- `myiap.claimRequests.refresh`
- `myiap.claimRequests.create`
- `myiap.claimRequests.noResults`
- `myiap.claimRequests.noResultsDescription`
- `myiap.claimRequests.emptyAction`
- `common.loading`
- `errors.general.heading`
- `errors.general.description`
