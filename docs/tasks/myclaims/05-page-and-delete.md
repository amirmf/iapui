# Task 05 — Page composition and deletion

## Evidence

Reference files under `src/features/my-iap/claim-requests/`: `pages/my-claim-requests-page.tsx`, `components/my-claim-request-page-header.tsx`, `components/my-claim-requests-alert.tsx`, `components/my-claim-request-delete-dialog.tsx`, `context/my-claim-request-context.tsx`, `services/my-claim-request-service.ts`. Pagination source: `src/components/pagination.tsx`; confirmation: `src/components/dialogs/confirm-dialog.tsx`.

## Implement in small units

- `MyClaimRequestsPage` wraps `MyClaimRequestsPageContent` in `MyClaimRequestProvider`; route delegates to its feature public export and retains `crumb: 'myClaims'`.
- Query key `['myClaimRequests', page, 9, filters]`, page initially 0, filter application resets it to 0. Keep previous data, no focus refetch, stale and GC time each 10000 ms. Forward AbortSignal.
- `myClaimRequestService.getPage`: GET `/my/iap/claim-requests/page-full`, service defaults page 0, size 10; page explicitly supplies size 9. Validate request and response at boundary, serialize filters with public `transformApiFilterParams` per architecture.
- Header title `myiap.claimRequests.title` fallback `My Claim Requests`; description fallback `Review your submitted insurance claim requests.` Refresh disabled during loading/fetching, icon spins on fetching; create links `/myclaims/create/`.
- `MyClaimRequestsAlert`: exact treatment-cost title, two steps and external links `https://alborzinsurance.ir/InsuredCode` and `https://eit.alborzinsurance.ir/BimeSiteMVC/Dr/BimeshodeDmgEstelam/BimeshodeDmgEstelam`. Tenant light background/border and theme-sensitive icon match source.
- Error alert can coexist with empty state. Loading uses `common.loading`. Empty with active applied filters uses `noResults` and `noResultsDescription`; unfiltered empty uses `emptyAction` create link.
- `Pagination`: top border-bottom and bottom border-top; hide for <=1 pages; previous/next disabled during fetch and at boundary. Exact count/page/previous/next translation keys. Grid one column, md two, lg three.
- Store keeps only selected row and delete dialog state; provider resets on unmount. Provider belongs `context/provider`, Zustand belongs `context/store`.
- `MyClaimRequestDeleteDialog`: DELETE `/my/iap/claim-requests/{id}` only with truthy id. Confirmation title/description source keys, shared `@iap/dialogs` reference presentation; pending disables actions. Successful mutation calls `refetch` without awaiting, shows `common.deleteSuccess`, closes, clears row after 500 ms. Failure leaves confirmation open, handled by existing global query error handling. Cancel closes and delayed cleanup. Cancel timers on unmount to avoid leaking across visits.

## Acceptance

Focused tests cover request path/query/defaults/signal, pagination visibility/boundaries, page filter reset and loading/error/empty branches, deletion success/pending/failure sequencing. Typecheck, lint, architecture check and diff check must pass. No live-backend or pixel identity claims from unit tests.

Status: complete.

