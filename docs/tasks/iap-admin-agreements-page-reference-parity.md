# iap-admin agreements page reference parity

> Historical implementation plan. Current task status and verification evidence are maintained in `iap-admin-agreements-reference-parity-v4.md`; earlier completion labels below are not a final parity claim.

## Scope and source of truth

- Target URL: `/agreements/`
- Target route: `apps/iap-admin/src/app/router/routes/_authenticated/agreements/index.tsx`
- Reference route: `insurance-ui/src/routes/_authenticated/agreements/index.tsx`
- Reference composition root: `insurance-ui/src/features/agreements/pages/agreements-page.tsx`
- Reference closure: the mounted agreement table, agreement-party-application panel, agreement-coverage-application section, dialogs, API contracts, and Persian strings listed below.

`/agreements/` remains one route. The two adjacent panels and their dialogs are mounted inside that one page; no child route is required.

## Verified reference behavior

`AgreementsPage` owns an agreement-local provider and composes:

1. `AgreementsSection`: pageable/filterable agreement table, bulk soft/hard delete for super admins, refresh, create, view, edit, and coverage-initialization action.
2. `AgreementPartyApplsContentPanel`: a selected-agreement-scoped party-application table, refresh, bulk/delete/create actions, and its dialogs.
3. `AgreementCoverageApplsSection`: a selected-agreement-scoped coverage-application table, refresh, create, bulk soft/hard delete for super admins, detail/edit/inline-edit actions, and dialogs.

The target route currently renders `PlaceholderPage`, while the target already has the required general table, dialog, form, auth, localization, and API-client primitives.

## Exact backend contract inventory

All request and response schemas must be added to `packages/api-types/src/agreement/index.ts` and re-exported from `packages/api-types/src/index.ts`. They use Zod v4 and inferred types. The reference's unknown-key retention is preserved with `.loose()` (the target architecture's Zod v4 equivalent), not `.passthrough()`.

| Domain | Endpoint and request placement | Contract schema names |
| --- | --- | --- |
| Agreement | `GET /agreements/page` and `GET /agreements/page-full`: `page`, `size`, serialized filters; `GET /agreements/:id`; `POST /agreements`; `PUT /agreements/:id`; `PUT /agreements/soft-delete/:id?thruDate`; `PUT /agreements/soft-delete` with ID array and optional `thruDate`; `DELETE /agreements/bulk-delete` with ID array. | `agreementStatusSchema`, `agreementSchema`, `agreementPageSchema`, `agreementFormSchema`, page/get/create/update/soft-delete/bulk-delete request schemas. |
| Agreement party application | `GET /agreement-party-appls/page-full` with optional `agreementId__in`, `userAccountId__in`, `page`, `size`, serialized filters; `POST /agreement-party-appls/bulk-create-with-role`; `PUT /agreement-party-appls/soft-delete`; `DELETE /agreement-party-appls/bulk-delete`. | `agreementPartyRelationshipTypeSchema`, `agreementPartyRoleSchema`, `agreementPartyApplSchema`, `agreementPartyApplFullSchema`, `agreementPartyApplPageFullSchema`, `agreementPartyApplBulkCreateWithRoleRequestSchema`, create/soft-delete/bulk-delete request schemas. |
| Agreement coverage application | `GET /agreement-coverage-appls/page-full`; `POST /agreement-coverage-appls`; `PATCH /agreement-coverage-appls/:id`; `PUT /agreement-coverage-appls/soft-delete`; `POST /agreement-coverage-appls/initialize` with `{ agreementId }`; `DELETE /agreement-coverage-appls/bulk-delete` with ID array. | `agreementCoverageApplSchema`, `agreementCoverageApplFormSchema`, `agreementCoverageApplFullSchema`, `agreementCoverageApplPageFullSchema`, page/create/update/soft-delete/bulk-delete/initialize request schemas. |

Date fields are ISO strings at the transport boundary and `Date` values in form input. Services validate both outgoing request objects and incoming response bodies. Filter arrays use `transformApiFilterParams` and `__in`, in accordance with the target architecture.

## Target component map

The following locations keep route composition thin and keep page behavior in the feature.

| Owner | Components / responsibility |
| --- | --- |
| `features/agreements/agreements-page.tsx` | `AgreementsPage`, `AgreementsContent`; page composition only. |
| `features/agreements/components/agreement-table/` | `AgreementsSection`, `AgreementDataTableToolbar`, `useAgreementColumns`, `AgreementRowActions`; URL-backed table controls and selected-row synchronization. |
| `features/agreements/components/agreement-dialogs/` | `AgreementFormDialog`, `AgreementDeleteMethodDialog`, `AgreementViewDialog`, `AgreementCoverageInitializeDialog`; focused create/edit, bulk deletion, details, and initialization interactions. |
| `features/agreements/components/agreement-party-appls/` | `AgreementPartyApplsContentPanel`, `AgreementPartyApplsContent`, `AgreementPartyApplsActions`, `AgreementPartyApplDataTableToolbar`, `useAgreementPartyApplColumns`, row actions and the four mounted dialogs. |
| `features/agreements/components/agreement-coverage-appls/` | `AgreementCoverageApplsSection`, `AgreementCoverageDataTableToolbar`, `useAgreementCoverageApplColumns`, row actions, `AgreementCoverageApplFormDialog`, `AgreementCoverageApplDeleteMethodDialog`, and `AgreementCoverageApplViewDialog`. Inline editing is extracted from the section so table rendering remains small and stable. |
| `features/agreements/context/store/` | `agreement-store`, `agreement-party-appl-store`, and `agreement-coverage-appl-store`; only dialog, current-row, inline-edit, and row-selection client state. |
| `features/agreements/queries/` | Query option/key factories for the three server-state tables and select options. |
| `features/agreements/route-adapters/` | `route-search-schema` plus agreement-table search parsing/serialization. Party and coverage panel filters remain component-local because the reference does not persist them to the URL. |
| `features/agreements/constants/` | `agreement-status-options.ts`, the single source for `AgreementStatus` translation keys, badge classes, and translated filter/select options. |
| `features/agreements/services/` | `agreement-service`, `agreement-party-appl-service`, and `agreement-coverage-appl-service`; no UI state or translations. |

## Translation inventory

Copy, without translating or editing values, the reference `agreements`, `agreementPartyAppls`, and `agreementCoverageAppls` objects from `insurance-ui/src/locales/fa.json` into `apps/iap-admin/src/shared/i18n/locales/fa/common.json`.

The direct mounted closure also uses existing target `common.*`, `form.*`, `party.*`, `coverages.*`, and `damageCodes.*` keys. Add only a key that is absent and whose Persian value is directly verified in the reference. The agreement status constant must resolve the exact reference keys `agreements.status.active`, `inactive`, `draft`, `expired`, and `terminated`.

## Tasks

| Priority | Task | Completion evidence | Status |
| --- | --- | --- | --- |
| P0 | Create the package-owned Zod v4 contracts and service boundary for all three domains. | Nine service-contract tests cover endpoint method/path, query/body placement, date serialization, invalid inputs, and response parsing. | Complete |
| P0 | Replace the placeholder route with a thin `AgreementsPage` composition and add URL table-search adaptation. | The route imports the public feature API; route-search validation tests, typecheck, lint, and production build pass. | Complete |
| P0 | Implement the agreement table, status constant, columns, and four agreement dialogs. | Focused tests cover status mapping, row-action edit state, view-dialog content, and store updates; typecheck, lint, and build pass. | Complete |
| P0 | Implement the selected-agreement party-application panel and its mounted dialogs. | Focused UI tests cover no-selection disabled actions and selected-row deletion flow; typecheck, lint, and build pass. | Complete |
| P0 | Implement the selected-agreement coverage-application section and dialogs. | Focused UI tests cover permission-aware delete state, creation availability, selected-row deletion flow, and inline-edit implementation; typecheck, lint, and build pass. | Complete |
| P1 | Copy verified Persian namespaces and add the feature public API. | A self-contained translation test resolves every mounted closure key and asserts the reference-derived values; typecheck, lint, and build pass. | Complete |
| P1 | Run focused tests and quality gates, then update this document with evidence. | `vitest run src/features/agreements`: 10 files / 22 tests pass; `typecheck`, `lint`, `git diff --check`, and production build pass. | Complete |

## Non-negotiable architecture and quality constraints

- The route stays a composition boundary and contains no product behavior.
- Backend contract schemas live only in `@iap/api-types`; services use only package public APIs and validate request/response boundaries.
- Server state stays in TanStack Query. Zustand stores contain no API results or route state.
- Components use `@iap/ui` primitives and `cn` for conditional class names; no conditional `className` template interpolation.
- The implementation preserves reference-visible UI and interactions while using the target's existing accessible controls, semantic theme tokens, and table primitives.
