# Assessment prompts page parity

## Scope and current status — 2026-10-06

Single admin route: `/assessment-prompts/`. Worktree:
`/home/sadegh/Android/project/iap-ui-assessment-prompts`, branch
`codex/assessment-prompts`, created from `main`.

The first implementation passed tests but missed reference differences. Tasks
06–09 record those concrete discrepancies and their corrections; task10 records
closure coverage and final verification. Tasks01–05 have been updated to remove
superseded assumptions. Passing tests alone is not a pixel-parity claim.

| Task | Responsibility | Status |
| --- | --- | --- |
| 01 | Contracts and enum presentation | Implemented; reverified by task09 |
| 02 | Services and URL state | Implemented; reverified by tasks06/09 |
| 03 | Table and actions | Implemented; corrected by task07 |
| 04 | Forms, view and deletion | Implemented; corrected by tasks08/09 |
| 05 | Thin route and source translations | Implemented; final checks in task10 |
| 06 | Source page/card/action composition | Implemented |
| 07 | Table, filters, pagination and view | Implemented |
| 08 | Form, selectors and date dependencies | Implemented |
| 09 | Exact schemas, state names and delete closure | Implemented |
| 10 | Regression and closure verification | Completed within recorded verification boundary |

## User-resolved precedence

The user explicitly confirmed exact reference API/schema/component/translation
semantics with target architecture placement. Assessment request objects strip
unknown fields and assessment page content is nullish, exactly as the reference.
The form uses the source English validation literals. No locally invented
`assessmentPrompts.validation` translations remain. Page contracts use explicit
source field ordering rather than a shared factory that changes those semantics.
This is a page-specific, user-authorized contract exception; it does not change
the general architecture baseline for unrelated domains.

## Target ownership

- Routes only compose feature public exports and route configuration.
- Single-root-route UI stays in the assessment-prompts feature.
- Client coordination stays in feature `context/store` and `context/provider`.
- Backend schemas/types stay in `@iap/api-types`.
- Reusable document-type cache capability stays in the doc-types module.
- Application table/layout/date integration stays in `shared`.
- UI and confirmation capabilities use workspace package public APIs.
- Reference appearance is opt-in where shared consumers require existing defaults.
- Enum labels remain in feature
  `constants/assessment-prompts-constant.ts`, with exact source mapping/order.

## Verified source closure

Reference root: `/home/sadegh/Android/project/insurance-ui`.

| Concern | Reference path |
| --- | --- |
| Route | `src/routes/_authenticated/assessment-prompts/index.tsx` |
| Page | `src/features/assessment-prompts/pages/assessment-prompts-page.tsx` |
| Schemas | `src/features/assessment-prompts/data/assessment-prompt-schema.ts` |
| Service | `src/features/assessment-prompts/services/assessment-prompt-service.ts` |
| Enum constant | `src/constants/assessment-prompts-constant.ts` |
| UI | `src/features/assessment-prompts/components/` |
| State | `src/features/assessment-prompts/context/assessment-prompt-context.tsx` |
| Supporting primitives | `src/components/data-table/`, `src/components/ui/`, `src/components/dialogs/` |

Task10 expands this into a mounted-responsibility coverage matrix. The unused
source `AssessmentPromptBulkDeleteDialog` is excluded because the source page
mounts `AssessmentPromptDeleteMethodDialog`.

## Exact source API operations

| Operation | Method/path |
| --- | --- |
| List | `GET /assessment-prompts/page-full` with page/size/flattened filters |
| Detail | `GET /assessment-prompts/:id` |
| Create | `POST /assessment-prompts` |
| Update | `PUT /assessment-prompts/:id` |
| Delete one | `DELETE /assessment-prompts/:id` |
| Soft delete one | `PUT /assessment-prompts/soft-delete/:id?thruDate=` |
| Soft delete selected | `PUT /assessment-prompts/soft-delete?thruDate=` with ID-array body |
| Hard delete selected | `DELETE /assessment-prompts/bulk-delete` with ID-array body |

Source table size defaults to40; direct list-service fallback is30. Date URL keys
are `thruDate__from`/`thruDate__to`. Agreement search preserves raw text and the
source selected-row query. Doc types use page0/size100 and source cache key.

## Explicit retained safeguards and adaptations

These are disclosed differences, not source-parity claims:

- Selected deletion excludes false-valued selection entries. The reference
  Object.keys implementation can include unselected rows; that bug is not copied.
- Failed deletion keeps confirmation/selection for retry; global mutation
  infrastructure owns error feedback.
- Cached doc-type content is schema-validated before use; malformed storage is
  ignored safely.
- Date formatting safely returns '-' for invalid dates instead of propagating
  the reference formatter's possible invalid-date exception.
- Component extraction, Zustand selectors, public imports and Tailwind v3
  equivalent sizing preserve target architecture without requiring identical
  source directory structure.

## Verification boundary

Backend behavior is tested with mocks, not a live backend. No browser screenshot
comparison has been performed, so pixel-perfect rendering is not asserted.
No commit, merge or deployment was requested. Current observed verification is
recorded in task10; no completion is inferred from task-file existence.
