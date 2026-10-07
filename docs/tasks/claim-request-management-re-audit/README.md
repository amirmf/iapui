# ClaimRequestManagementPage parity re-audit

Reference: `/home/sadegh/Android/project/insurance-ui/src/features/claim-requests/pages/claim-request-management-page.tsx` and its complete mounted component closure.
Target: `apps/iap-admin/src/features/claim-requests/pages/claim-request-management/`.

This audit compares every mounted component file, public export, API method, request/response schema, translation key/value, permission condition, loading/error/empty behavior, and visible composition. Source evidence is required for every item; no behavior is inferred. Implementation tasks are split by non-overlapping closure and must be checked against the current architecture: thin route, feature ownership, public package APIs, strict Zod v4 request contracts, Query server state, and `cn` for conditional classes.

## Task split

1. `01-page-composition.md`: page and route boundary.
2. `02-header-info-actions.md`: header, info list, quick actions, action services/forms.
3. `03-assessment-review-files.md`: assessment editing, review, history, attachments and documents.
4. `04-final-verification.md`: exact source comparison, focused tests, typecheck, lint, architecture check, build, and diff check.

No task is complete based only on compilation. Source parity and runtime states must be tested separately from browser/live-backend evidence.
