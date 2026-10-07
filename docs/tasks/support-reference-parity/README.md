> Current response contract (2026-10-07): paginated `content` uses `.nullish()` across the workspace. Missing values and `null` are accepted; present array items are validated. This supersedes earlier optional-only and null-rejection statements, including exact-reference acceptance claims for this field.

> Current ownership decision (2026-10-07): My-IAP belongs exclusively to `iap-app`. No My-IAP routes, pages, or placeholders are registered in `iap-admin`. Earlier placeholder descriptions below are superseded. Shared Support ticket views and backend contracts remain in scope.

# Support reference parity

Reference: `/home/sadegh/Android/project/insurance-ui/src/features/support`.
Target: `packages/support`, consumed through `@iap/support` by iap-admin.
Worktree starts from main; branch `codex/support-reference-parity`.

## Accepted scope

Preserve source component names, API endpoints, schema acceptance and Persian translations. Keep shared capability in the focused package and thin host composition in admin shared shells. My-IAP belongs exclusively to iap-app; do not register admin My-IAP routes or placeholders. Claim links use the configured customer application URL and the user-approved `/myclaims/{id}` pathname. The Support widget ticket views are part of the inspected source closure.

Response page content is always nullish under the workspace-wide decision. On continuation the user authorized proceeding with exact source request pagination semantics for this task.

Status: re-audited and corrected. The latest complete evidence and limits are in [final-audit.md](final-audit.md); earlier audit and execution records below are historical.

## Execution units

1. `contracts.md`: inspect and port five service methods, request/response schemas and boundary tests.
2. `flow-and-integration.md`: context normalization, flow store, mapping types, public buttons/provider/widget, host integration and source locale extraction.
3. `window.md`: header/actions, messages, text input, error/loading, virtualized question/option rows and view composition.
4. `tickets.md`: recent tickets, virtualized list, details/conversation and query hooks.
5. `verification.md`: integrated typechecks, source regression tests, lint, architecture, builds and explicit verification limits.

Units 1, 3 and 4 can proceed independently after their shared imports are agreed. Unit 2 integrates their public APIs.

## Complete source inventory

- `components/icon-bot.tsx`
- `components/support-feature-button.tsx`
- `components/support-floating-button.tsx`
- `components/support-flow-open-button.tsx`
- `components/support-flow-provider.tsx`
- `components/support-flow-types.ts`
- `components/support-flow-widget.tsx`
- `components/support-flow-window/index.tsx`
- `components/support-flow-window/support-flow-message.test.ts`
- `components/support-flow-window/support-flow-message.tsx`
- `components/support-flow-window/support-flow-user-message.tsx`
- `components/support-flow-window/support-flow-window-actions.tsx`
- `components/support-flow-window/support-flow-window-error.tsx`
- `components/support-flow-window/support-flow-window-header.tsx`
- `components/support-flow-window/support-flow-window-loading.tsx`
- `components/support-flow-window/support-option-details.ts`
- `components/support-flow-window/support-option-list-types.ts`
- `components/support-flow-window/support-option-list.tsx`
- `components/support-flow-window/support-option-row-height.ts`
- `components/support-flow-window/support-option-row.tsx`
- `components/support-flow-window/support-question-list-item.tsx`
- `components/support-flow-window/support-response-option-list-item.tsx`
- `components/support-flow-window/support-text-input.tsx`
- `components/support-flow-window/use-support-flow.ts`
- `components/support-question-button.tsx`
- `components/tickets/recent-tickets.tsx`
- `components/tickets/support-ticket-conversation.tsx`
- `components/tickets/support-ticket-details.tsx`
- `components/tickets/support-ticket-item.tsx`
- `components/tickets/support-tickets-list.tsx`
- `data/my-iap-ticket-schema.ts`
- `data/support-flow-schema.ts`
- `hooks/use-element-size.ts`
- `hooks/use-support-tickets.ts`
- `services/support-service.test.ts`
- `services/support-service.ts`
- `store/support-flow-store.test.ts`
- `store/support-flow-store.ts`
- `utils/support-flow-context.test.ts`
- `utils/support-flow-context.ts`
