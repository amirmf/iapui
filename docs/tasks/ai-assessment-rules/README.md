# AI Assessment Rules Page Parity

## Scope and Plan

Single admin route: `/_authenticated/ai-assessment-rules/`
Reference project: `insurance-ui`
Target application: `iap-admin` in `iap-ui` monorepo
Worktree: `/home/sadegh/Android/project/iap-ui-ai-assessment-rules`, branch `codex/ai-assessment-rules`, created from `main`.

The goal is to implement full reference-parity for the `/ai-assessment-rules/` page, following target software architecture rules (`docs/architecture/APPLICATION-ARCHITECTURE.md` and repository conventions) while strictly preserving exact component names, API endpoints, request/response schemas, enum translation keys, and user-facing Persian translations from `insurance-ui`.

## Task Index

| Task | Title | Status | Scope |
| --- | --- | --- | --- |
| 01 | [Contracts and Constants](./01-contracts-and-constants.md) | Completed | Zod schemas in `@iap/api-types`, constants in feature `constants/`, contract tests |
| 02 | [Service, Queries, and Route Adapters](./02-service-queries-and-url-state.md) | Completed | API service, React Query hooks, URL search filter adapters, tests |
| 03 | [State Stores and Provider](./03-context-and-state-stores.md) | Completed | Zustand stores (selection, dialogs, sub-tables) and feature provider |
| 04 | [Table Actions, Toolbar, and Columns](./04-main-table-toolbar-and-actions.md) | Completed | Header actions, faceted filter toolbar, table columns, row actions |
| 05 | [Rule Details Sub-Table](./05-inspector-details-table.md) | Completed | Inspector details table, columns, actions, forms, dialogs, utils |
| 06 | [Automation Levels Sub-Table](./06-inspector-automation-levels-table.md) | Completed | Inspector automation levels table, columns, actions, forms, dialogs, utils |
| 07 | [Rule Form Dialog and Editor](./07-form-dialog-and-rule-mutation.md) | Completed | Create/Edit dialog, form, doc types multi-select, agreement selector, JSON editor |
| 08 | [Deletion Dialogs](./08-dialogs-and-deletion.md) | Completed | Single rule delete dialog and bulk delete dialog using `@iap/dialogs` |
| 09 | [Page Composition, Thin Route, and Translations](./09-page-composition-and-thin-route.md) | Completed | Page component, grid layout, route file, Persian translations in `common.json` |
| 10 | [Verification and Integration](./10-verification-and-reconciliation.md) | Completed | Lint, typecheck, unit/contract tests, build validation |
| 11 | [Reference Parity Audit & Reconciliation](./11-reference-parity-audit-and-reconciliation.md) | Completed | Component-by-component deep audit, reconciliation of discrepancies, and full parity verification |

## Verified Reference Closure

Reference: `/home/sadegh/Android/project/insurance-ui`

| Concern | Reference Source Path | Target Monorepo Destination |
| --- | --- | --- |
| Route Entry | `src/routes/_authenticated/ai-assessment-rules/index.tsx` | `apps/iap-admin/src/app/router/routes/_authenticated/ai-assessment-rules/index.tsx` |
| Page Component | `src/features/ai-assessment-rules/pages/ai-assessment-rules-page.tsx` | `apps/iap-admin/src/features/ai-assessment-rules/ai-assessment-rules-page.tsx` |
| Contracts & Schemas | `src/features/ai-assessment-rules/data/ai-assessment-rule-schema.ts` | `packages/api-types/src/ai-assessment-rule/index.ts` |
| Constants & Enums | `src/constants/ai-assessment-rule-constant.ts` | `apps/iap-admin/src/features/ai-assessment-rules/constants/ai-assessment-rule-constant.ts` |
| API Service | `src/features/ai-assessment-rules/services/ai-assessment-rule-service.ts` | `apps/iap-admin/src/features/ai-assessment-rules/services/ai-assessment-rule-service.ts` |
| Query Hooks | `src/features/ai-assessment-rules/hooks/use-ai-assessment-rules.ts` | `apps/iap-admin/src/features/ai-assessment-rules/queries/use-ai-assessment-rules.ts` |
| Context & Stores | `src/features/ai-assessment-rules/context/*` | `apps/iap-admin/src/features/ai-assessment-rules/context/store/*` & `provider/*` |
| Inspector & Details | `src/features/ai-assessment-rules/components/ai-assessment-rule-details-table/*` | `apps/iap-admin/src/features/ai-assessment-rules/components/ai-assessment-rule-details-table/*` |
| Inspector & Auto Levels | `src/features/ai-assessment-rules/components/ai-assessment-rule-automation-levels-table/*` | `apps/iap-admin/src/features/ai-assessment-rules/components/ai-assessment-rule-automation-levels-table/*` |
| Main Dialogs & Forms | `src/features/ai-assessment-rules/components/ai-assessment-rule-form-dialog/*` | `apps/iap-admin/src/features/ai-assessment-rules/components/ai-assessment-rule-form-dialog/*` |
| Translations | `src/locales/fa.json` (`aiAssessmentRules.*`) | `apps/iap-admin/src/shared/i18n/locales/fa/common.json` |

## Exact API Operations

| Operation | HTTP Method & Path | Payload / Query / Params |
| --- | --- | --- |
| List rules | `GET /ai-assessment-rules/page-full` | `page`, `size`, `sort`, `direction`, transformed filters |
| Get rule by ID | `GET /ai-assessment-rules/:id` | Path param `id` |
| Create rule | `POST /ai-assessment-rules` | `CreateAiAssessmentRuleRequest` body |
| Update rule | `PUT /ai-assessment-rules/:id` | Path param `id`, `CreateAiAssessmentRuleRequest` body |
| Delete single rule | `DELETE /ai-assessment-rules/:id` | Path param `id` |
| Bulk delete rules | `DELETE /ai-assessment-rules/bulk-delete` | Array of UUIDs body |

## Architecture & Code Quality Principles

- **Thin routes**: Route file only sets component, loader (`crumb`), and `validateSearch`.
- **Package boundaries**: Backend schemas belong in `@iap/api-types`; HTTP transport uses `@iap/api-client`.
- **Small, focused components**: Sub-tables, dialogs, toolbars, and selectors are modularized into small single-responsibility files.
- **Clean state management**: Zustand stores hold only client UI state (dialog visibility, selected row, active editing item); TanStack Query owns remote server state.
- **Reference fidelity**: All Persian labels, error messages, and enum values match `insurance-ui` byte-for-byte.
