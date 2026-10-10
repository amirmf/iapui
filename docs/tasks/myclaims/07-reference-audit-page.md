# Reference audit: MyClaimRequestsPage

Compared on 2026-10-10:
- Reference: `insurance-ui/src/routes/_app/myiap/myclaims/index.tsx` and `src/features/my-iap/claim-requests/pages/my-claim-requests-page.tsx`.
- Target: `iap-ui/apps/iap-app/src/app/router/routes/_authenticated/myclaims/index.tsx` and `src/features/my-claims/**`.

## Verified parity and intentional architectural adaptations

1. **Route composition**: both routes render `MyClaimRequestsPage` and expose `crumb: 'myClaims'`. Target route uses `/_authenticated/myclaims/`, required by iap-app's authenticated portal router.
2. **Provider boundary**: both export a page wrapper that mounts `MyClaimRequestProvider` and a content component. Target provider lives under `context/provider` and uses the target store module; behavior is identical (reset on unmount).
3. **Query contract**: target `myClaimRequestsQueryOptions` has the reference `PAGE_SIZE = 9`, query key (`myClaimRequests`, page, size, filters), abort signal, `refetchOnWindowFocus: false`, placeholder data, 10-second stale and GC times. It is equivalent to the reference inline `useQuery`.
4. **Composition order**: alert, delete dialog, header, filter, error alert, then results are rendered in the same order.
5. **State and filtering**: page starts at 0, filters start as `{}`, active-filter detection handles arrays and scalar values, and filter changes reset page to 0 exactly as reference.
6. **Header actions**: target `MyClaimRequestPageActions` renders refresh and create actions with the same labels, icons, disabled/loading behavior, and gap. Target create link is `/myclaims/create/`, the authenticated portal equivalent of reference `/myiap/myclaims/create`.
7. **Results**: target `MyClaimRequestsResults` preserves loading text, two paginations, card grid breakpoints/classes, empty filtered state, and empty create CTA. Target create link is the authenticated portal equivalent.
8. **Direct dependencies**: alert links, translations, delete mutation/toast, dialog lifecycle cleanup, pagination controls, and filter/card contracts were compared against their reference counterparts. No behavioral discrepancy was found; `presentation='reference'`, `cn`, and target aliases are design-system/architecture adaptations.

## Discrepancies / acceptance tasks

- [x] Preserve exact reference query behavior in a reusable target query-options function (verified in `queries/my-claim-requests-query.ts`).
- [x] Preserve exact reference result branching and pagination/card markup (verified in `components/my-claim-requests-results.tsx`).
- [x] Preserve exact reference action behavior and translation keys (verified in `components/my-claim-request-page-actions.tsx`).
- [x] Preserve provider reset and delete dialog lifecycle (verified in `context/provider/my-claim-request-provider.tsx` and `components/my-claim-request-delete-dialog.tsx`).
- [x] Record route differences as intentional authenticated-portal adaptation; no source-level change is required.

## Evidence checklist

The following reference symbols were located and matched: `MyClaimRequestsPageContent`, `MyClaimRequestProvider`, `MyClaimRequestsAlert`, `MyClaimRequestDeleteDialog`, `MyClaimRequestPageHeader`, `MyClaimRequestsFilter`, `MyClaimRequestsResults` (target extraction), `Pagination` (target extraction), `myClaimRequestService.getPage`, `PAGE_SIZE`, `myiap.claimRequests.*`, `errors.general.*`, and `common.loading`.

## Component closure comparison matrix

| Source responsibility | Target owner | Result |
|---|---|---|
| Page query and filter reset | `my-claim-requests-page.tsx`, `queries/my-claim-requests-query.ts` | Behavior equal; query extracted for feature boundary |
| Header actions | `components/my-claim-request-page-actions.tsx` | Behavior equal; source action JSX extracted |
| Result branches/cards/pagination | `components/my-claim-requests-results.tsx` | Behavior equal; source conditional JSX extracted |
| Alert | `components/my-claim-requests-alert.tsx` | Behavior equal; public primitive/theme adaptation |
| Delete | `components/my-claim-request-delete-dialog.tsx` | Behavior equal; public dialog adaptation and timer cleanup |
| Store/provider | `context/store`, `context/provider` | Behavior equal; architecture ownership split |

Status: complete.
