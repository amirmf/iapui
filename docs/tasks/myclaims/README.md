# My Claims list implementation

Source: `/home/sadegh/Android/project/insurance-ui`, route `src/routes/_app/myiap/myclaims/index.tsx`, page `src/features/my-iap/claim-requests/pages/my-claim-requests-page.tsx`.
Target: `apps/iap-app`, route `/_authenticated/myclaims/`, public URL `/myclaims/`.

This evidence supersedes the historical `docs/tasks/customer-portal-pages/01-my-claims-list-page.md`. That document incorrectly describes national-code card content, draft-only deletion and cache invalidation. Actual source shows beneficiary, five deletable statuses and direct refetch on success.

Scope is one list page. Existing create/detail route placeholders remain destinations, without implementing those journeys. No additional routes are added. Architecture uses the single-root-page exception: `features/my-claims/my-claim-requests-page.tsx`, focused `components/`, `queries/`, `services/`, `context/store/` and `context/provider/`. Backend contracts are public `@iap/api-types`; UI classes use public `cn`.

## Execution order

1. `01-contracts.md`: inspect the full schema closure and add list request contract.
2. `02-status-constants.md`: audit centralized enum maps and display/timestamp helpers.
3. `03-filters.md`: verified lookup and filter behavior (independent implementation).
4. `04-card.md`: verified card content/actions (independent implementation).
5. `05-page-and-delete.md`: page, alert, pagination, query and deletion integration.
6. `06-translations-and-verification.md`: literal locale extraction and focused regression checks.

Tasks 2–4 may run in parallel after ownership is agreed. All implementation follows inspected source, not this historical roadmap. Completion evidence is recorded after checks. Browser screenshots and live-backend checks must be distinguished from unit/build verification.

## Reusable implementation guidance

For future customer portal parity pages, repeat this workflow: inspect the complete mounted reference closure first; record source file and line-level contracts in a task document; keep route files as composition-only boundaries; place page-exclusive components under the feature page owner; reuse public `@iap/ui`, `@iap/forms`, `@iap/dialogs`, and `@iap/api-types`; serialize filter arrays through `transformApiFilterParams`; copy only verified locale values into the target fixture; and report browser/live-backend coverage separately from unit, typecheck, lint, and architecture evidence. A new skill is not needed because `customer-portal-app`, `reference-page-parity`, `shared-dialogs`, and `REFERENCE-PAGE-CONTROLS.md` already cover these reusable rules.
