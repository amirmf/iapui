# My Claims detail page implementation

The initial task outline below is historical. The complete audit and implementation evidence are in [reference-parity-audit.md](reference-parity-audit.md), with focused tasks 01–05.

Source of truth: `insurance-ui/src/features/my-iap/claim-requests/pages/my-claim-request-detail-page.tsx` and its imported components. The current `iap-app` route is `apps/iap-app/src/app/router/routes/_authenticated/myclaims/$id.index.tsx`.

## Task 1 — route and page composition

Keep the route thin and compose `MyClaimRequestDetailPage` from `features/my-claims`. Preserve the route breadcrumb key `claimDetails`, dynamic `id`, authenticated layout, and the `/myclaims/$id/` URL. The page renders the reference header, error alert, loading state, claim card, details, actions, result/objection area, attachments, and back link.

## Task 2 — detail query and service contract

Add `myClaimRequestService.getById(id, { signal })`, validating the id with `claimRequestIdSchema`, calling `GET /my/iap/claim-requests/{id}`, and parsing `claimRequestSchema`. Add a TanStack Query definition keyed by `['myClaimRequest', id]`, enabled only with an id, with 5-second stale and garbage-collection windows.

## Task 3 — detail information components

Port the reference `MyClaimRequestDetailInfoList` and `MyClaimRequestReadonlyItems` into page-owned components. Use the existing app constants in `features/my-claims/constants/claim-status-constant.ts`, `getClaimRequestDisplayStatus`, `myIapFindTimeStamp`, and date formatting utilities. Preserve all fields and translation keys: beneficiary, amount, totalSumAmount, status, subInsuredPerson, mobileNumber, submitDate, createdAt, assessedAt, returnedAt, paidAt, extPaymentDate, policyNumber, docType, businessKey. Compose classes with `cn`.

## Task 4 — actions and results

Port delete and adjustment actions with the same status eligibility and translation keys (`myiap.claimRequest.actions.*`, `myiap.claimRequest.deleteDialog.*`). Use the app's shared confirmation dialog and query invalidation keys. Port result reasons, objections, assessment-result support action, and objection form using the existing app capabilities; do not invent API contracts.

## Task 5 — attachments and translations

Inspect the existing attachment/file viewer public API before wiring it. Reuse the reference translation keys and existing `common`, `errors`, `claimRequests`, and `myiap.claimRequest` locale entries. Add only missing translations after confirming their absence in both supported locales.

## Verification

Run the affected app typecheck, lint, tests, and route generation. Record any reference behavior that cannot be represented by current `iap-app` public APIs rather than inventing a substitute.
