> Current response contract (2026-10-07): paginated `content` uses `.nullish()` across the workspace. Missing values and `null` are accepted; present array items are validated. This supersedes earlier optional-only and null-rejection statements, including exact-reference acceptance claims for this field.

> Current ownership decision (2026-10-07): My-IAP belongs exclusively to `iap-app`. No My-IAP routes, pages, or placeholders are registered in `iap-admin`. Earlier placeholder descriptions below are superseded. Shared Support ticket views and backend contracts remain in scope.

# Support flow window reference parity

Historical implementation evidence. The fresh complete audit and final integrated results are in [reaudit.md](reaudit.md).

Priority: high. Owner: `packages/support/src/components/support-flow-window`.

## Verified source

Reference: `/home/sadegh/Android/project/insurance-ui/src/features/support/components/support-flow-window/` (all 17 files). Dependencies inspected: markdown-editor text-style, colors and font-size helpers; claim-status and tickets translation maps; format-date and formatAmount helpers; auth and theme contexts.

## Tasks

- [x] Port `index.tsx`: chat/ticket-list/ticket-detail views, recent-ticket refresh and rendering synchronization, scroll restoration, mobile document scroll lock.
- [x] Port header/actions/loading/error components with exact translation keys, color context, and pending controls.
- [x] Port `support-flow-message.tsx` and its tests: safe GFM, soft breaks, validated editor styles, internal Router links and HTTP(S) external links. Private source-backed markdown validation helpers stay colocated.
- [x] Port last-user-message and text-input components, preserving trimmed submission and disabled/empty behavior.
- [x] Port option list, row, question/response items, list types, details and measured/estimated heights. Preserve virtualization, resize measurements, scrolling reset, loading sentinel and load-more guards.
- [x] Port `use-support-flow.ts`: narrow store subscriptions, initial loading and action callbacks; consume parent-owned store/types.
- [x] Validate typecheck, lint, focused message tests and whitespace; report integration limitations separately.

## Architecture adaptation

Only public `@iap/ui`, `@iap/auth`, `@iap/theme`, `@iap/api-types` imports replace reference application imports. The text input also opts into `Textarea presentation='reference'` to retain source transparent background, 3px focus ring and transition classes. Mounted buttons opt into `presentation='reference'` after comparing source disabled/ghost variants. Component props are destructured in the function body. No route files or My-IAP pages are introduced. Store stays at package `context/store`; contracts stay in `@iap/api-types`. Reference status maps are retained privately because importing an application feature is prohibited. Date formatting uses the public UI formatter with reference-compatible language/timezone/invalid-date options. No translation values are inferred or rewritten.

API and schema definitions are owned by the parent contract/store tasks; this window sends existing store action inputs and does not create endpoints.

## Verification

Verified: package Support typecheck passes; admin ESLint configuration from repository root passes for the window folder; all 11 source message tests pass; `git diff --check` passes. Integrated admin typecheck passes after the final primitive and status-map adaptations, verifying the window against host locale augmentation. Dynamic translated keys cross a package-local `(key: string) => string` callback boundary. Browser/backend verification has not been performed and is separate from source parity and unit tests.

## Component closure and literal keys

| Source file | Target |
| --- | --- |
| `index.tsx` | `packages/support/src/components/support-flow-window/index.tsx` |
| `support-flow-message.test.ts` | `packages/support/src/components/support-flow-window/support-flow-message.test.ts` |
| `support-flow-message.tsx` | `packages/support/src/components/support-flow-window/support-flow-message.tsx` |
| `support-flow-user-message.tsx` | `packages/support/src/components/support-flow-window/support-flow-user-message.tsx` |
| `support-flow-window-actions.tsx` | `packages/support/src/components/support-flow-window/support-flow-window-actions.tsx` |
| `support-flow-window-error.tsx` | `packages/support/src/components/support-flow-window/support-flow-window-error.tsx` |
| `support-flow-window-header.tsx` | `packages/support/src/components/support-flow-window/support-flow-window-header.tsx` |
| `support-flow-window-loading.tsx` | `packages/support/src/components/support-flow-window/support-flow-window-loading.tsx` |
| `support-option-details.ts` | `packages/support/src/components/support-flow-window/support-option-details.ts` |
| `support-option-list-types.ts` | `packages/support/src/components/support-flow-window/support-option-list-types.ts` |
| `support-option-list.tsx` | `packages/support/src/components/support-flow-window/support-option-list.tsx` |
| `support-option-row-height.ts` | `packages/support/src/components/support-flow-window/support-option-row-height.ts` |
| `support-option-row.tsx` | `packages/support/src/components/support-flow-window/support-option-row.tsx` |
| `support-question-list-item.tsx` | `packages/support/src/components/support-flow-window/support-question-list-item.tsx` |
| `support-response-option-list-item.tsx` | `packages/support/src/components/support-flow-window/support-response-option-list-item.tsx` |
| `support-text-input.tsx` | `packages/support/src/components/support-flow-window/support-text-input.tsx` |
| `use-support-flow.ts` | `packages/support/src/components/support-flow-window/use-support-flow.ts` |

Literal locale keys: `supportFlow.actions.back`, `supportFlow.actions.close`, `supportFlow.actions.restart`, `supportFlow.actions.send`, `supportFlow.errors.generic`, `supportFlow.input.placeholder`, `supportFlow.loading`, `supportFlow.optionListLabel`, `supportFlow.steps.start.title`, `supportFlow.title`. Dynamic option detail keys are `supportFlow.optionFields.${field}` for the source field list; claim status keys are retained in `support-option-status.ts`; ticket keys are re-exported from the shared package `model/ticket-status.ts`. Parent locale task copies values from the reference.

UI guidance: the repository ui-ux-pro-max React search for `rerender subscriptions` verified cleanup guidance from `stacks/react.csv`; ResizeObserver and resize listeners retain cleanup.
