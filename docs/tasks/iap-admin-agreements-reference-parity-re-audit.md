# iap-admin agreements reference-parity re-audit

> Historical audit. Superseded for current task status by `iap-admin-agreements-reference-parity-v4.md`. Retained discrepancies and unfinished status labels describe the earlier snapshot, not open tasks in the latest implementation.

## Audit scope

- Target page: `apps/iap-admin/src/features/agreements/agreements-page.tsx`
- Reference page: `insurance-ui/src/features/agreements/pages/agreements-page.tsx`
- Reference closure: `insurance-ui/src/features/agreements/**` and `insurance-ui/src/features/agreement-coverage-appls/**` mounted by that page.
- Audit date: 2026-10-05

The earlier implementation supplies an operational page, but it is not yet a component-for-component reference-parity port. This document records only discrepancies verified from the files above.

## Verified discrepancies

| ID | Reference evidence | Target discrepancy | Required parity outcome |
| --- | --- | --- | --- |
| A1 | `pages/agreements-page.tsx` composes `AgreementProvider`, private `AgreementsContent`, `AgreementsSection`, `AgreementPartyApplsContentPanel`, and `AgreementCoverageApplsSection`. | `agreements-page.tsx` owns table state, query state, columns, actions, and selected-row derivation directly; it has no provider or `AgreementsSection`. | Introduce the reference-named components and move main-table behavior below the page composition boundary. Preserve target architecture with `context/store/` rather than importing reference internals. |
| A2 | `context/agreement-context.tsx` persists `selectedAgreement`, `currentRow`, dialog state, and row selection, and resets on unmount. | `agreement-store.ts` has no `selectedAgreement` and no page-lifecycle reset; child panels recompute selection through props. | Add selected-agreement state and lifecycle reset, and make party/coverage consumers read the same selected agreement source as the reference. |
| A3 | `services/agreement-service.ts` exposes `getPage`, `getPageFull`, `getById`, `delete`, `softDelete`, party page/create/update/soft-delete/bulk-create APIs, plus both bulk deletes. | The target services expose only the subset currently called by target UI. Verified absent reference APIs include `/agreements/page-full`, `/agreements/:id`, `/agreements/soft-delete/:id`, `/agreement-party-appls/page`, `/agreement-party-appls`, `/agreement-party-appls/soft-delete/:id`, and `/agreement-party-appls/bulk-create`. | Port every reference service operation with identical HTTP method, path, query/body placement, serialization, validation, and focused tests, even when not currently mounted by a button. |
| A4 | `data/agreement-schema.ts`, `data/agreement-party-appl-schema.ts`, and `agreement-coverage-appl-schema.ts` export all page/list/full/form contracts and translated form-schema factories. | `@iap/api-types/agreement` omits reference contract exports such as agreement list/full page types, party standard page/create-form/form schemas, and the restricted `agreementPartyApplBulkCreateWithRoleRoleSchema`; agreement form validation messages are not reference translation-key factories. | Add reference-equivalent schemas/types and request wrappers using target Zod v4 conventions (`.loose()` where the reference retained unknown fields). No field, enum, optionality, or form contract may be inferred. |
| A5 | Party panel closure includes `AgreementPartyApplsTitle`, `AgreementPartyApplsActions`, `AgreementPartyApplBulkCreateDialog`, and `AgreementUserAccountSearchSelect`; actions include visible bulk-create control and pass `agreements` plus `userAccounts`. | Target combines title/actions into `AgreementPartyApplsContentPanel`, does not render the bulk-create control/dialog, and does not use the reference user-account search-select component. | Restore the reference-named party components and their visible/action behavior; preserve target public primitives and package boundaries. |
| A6 | `agreement-party-appls-page.tsx` receives `agreements` and `userAccounts`, computes `userAccountId`, `agreementId`, and valid `agreementIdsCreate`, and calls `getPartyApplicationsPageFull` with both filters. | Target panel has no `userAccounts` input or `userAccountId__in` query path. | Match the reference input shape and request semantics; the page composition passes the reference-equivalent empty user-account collection where no external selection exists. |
| A7 | Reference translations used by the closure include the agreement form dialog descriptions/labels, party bulk-create labels, status keys, and coverage form/view labels listed in the audit command output. | The target does not contain all direct reference keys; verified missing examples include `agreements.partyAppls.bulkCreate.*`, `agreements.dialog.createDesc`, `agreements.status.draft`, `agreementCoverageAppls.form.franchisePercentage`, and `agreementCoverageAppls.view.description`. | Copy every reference value used by the mounted closure exactly from `src/locales/fa.json`; extend the translation parity test with the full key set. |
| A8 | Reference component file names are independently addressable (`agreement-form-dialog.tsx`, `agreement-view-dialog.tsx`, `agreement-delete-method-dialog.tsx`, `agreement-coverage-initialize-dialog.tsx`, and `AgreementsSection.tsx`). | Target combines four dialogs into `components/agreement-dialogs.tsx` and does not provide `AgreementsSection`. | Split target components into reference-named, single-responsibility files. A target-specific directory is permitted only when public names and behavior stay reference-equivalent. |
| A9 | Coverage row actions render the shared `AuditInformationRowAction`; the coverage toolbar passes `showReset`; the form and view dialogs render the reference description keys. | Target coverage row actions omit audit information, the toolbar does not request a reset control, and the form/view dialogs omit the reference descriptions. | Restore those mounted controls and exact translation-key consumption without replacing target shared primitives. |

## Tasks

| Priority | Task | Dependencies | Acceptance evidence | Status |
| --- | --- | --- | --- | --- |
| P0 | Add all missing agreement, party-application, and coverage API contract/service operations from A3–A4. | None | Contract and service tests prove every method/path/query/body and invalid input/response case. | In progress — contracts and service methods were added; the new single-resource method test cases remain. |
| P0 | Restore `AgreementProvider`, `AgreementsContent`, and `AgreementsSection`; split the four dialog components from A1–A2 and A8. | Store contract from P0 service task | Page composition mirrors reference and focused tests prove selection/reset/dialog actions. | In progress — provider, selection lifecycle, section, composition, and reference-named dialog entry points are implemented; dialog implementation still needs physical extraction from the legacy aggregation file. |
| P0 | Restore party-panel component boundaries, user-account input/query handling, and bulk-create UI from A5–A6. | Party service/API task | Visible controls, disabled states, payload, and query filters match reference; focused tests pass. | In progress — named title/actions/bulk-create/search-select components and `userAccountId__in` request path are implemented; focused query/payload assertions remain. |
| P0 | Re-audit coverage section against each reference component and port any remaining API/form/column/view discrepancy. | Coverage service/API task | File-by-file checklist and focused tests cover all mounted controls. | In progress — audit action, reset affordance, and reference dialog descriptions are restored; the final file-by-file evidence pass remains. |
| P1 | Copy all missing mounted-closure Persian values and expand locale parity assertions from A7. | None | Programmatic exact-value tests cover every reference key consumed by the closure. | Complete — the mounted-closure comparison reports no missing or unequal reference values. |
| P1 | Run all Agreements tests, typecheck, lint, build, and update this document with evidence. | All P0/P1 work | Commands pass and every task status is evidence-backed. | Not started |

## Follow-up implementation tasks

| Priority | Task | Verified discrepancy | Acceptance criteria | Status |
| --- | --- | --- | --- | --- |
| P0 | Physically extract the agreement form, view, delete-method, and coverage-initialize dialogs. | The reference owns each dialog in its own component file; the target files only re-exported implementations from `agreement-dialogs.tsx`. | Each reference-named dialog is implemented in its own target component file, `agreement-dialogs.tsx` is removed, page imports remain direct, and focused tests pass. | Complete — the aggregation file was removed, all four dialogs now own their implementations, and the Agreements test suite passes. |
| P1 | Preserve the target file-naming convention while retaining the reference component name. | The reference file is `AgreementsSection.tsx`, while the target architecture consistently uses lowercase-kebab-case filenames. | Keep `agreements-section.tsx` as the target-architecture filename and export the exact `AgreementsSection` component name; document this as an intentional architecture-preserving variance. | Complete |

## Non-goals

- Do not port unmounted reference routes such as `agreement-party-appls-page.tsx` as new target URLs.
- Do not copy the reference architecture. Keep the target's `features`, `context/store`, `@iap/api-types`, `@iap/api-client`, and shared UI package boundaries.
