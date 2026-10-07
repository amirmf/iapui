> Current response contract (2026-10-07): paginated `content` uses `.nullish()` across the workspace. Missing values and `null` are accepted; present array items are validated. This supersedes earlier optional-only and null-rejection statements, including exact-reference acceptance claims for this field.

> Current ownership decision (2026-10-07): My-IAP belongs exclusively to `iap-app`. No My-IAP routes, pages, or placeholders are registered in `iap-admin`. Earlier placeholder descriptions below are superseded. Shared Support ticket views and backend contracts remain in scope.

# Support ticket component parity tasks

Historical implementation evidence. The fresh complete audit and final integrated results are in [reaudit.md](reaudit.md).

## Verified evidence and boundaries

Reference root: `/home/sadegh/Android/project/insurance-ui/src/features/support/`.
Target owner: `packages/support/src/`; applications consume the package public API.
All five ticket component files and both hooks were inspected before porting.
The source `hooks/use-support-tickets.ts` is owned by target
`queries/use-support-tickets.ts` under the accepted query ownership rule; its base
name, exported hooks and behavior are preserved. `use-element-size.ts` remains in `hooks/`. Contracts
come from `@iap/api-types`; transport comes from package `services/support-service.ts`.
Authentication uses public `@iap/auth` `useAuthSession`, replacing the reference context
without importing application internals. UI primitives and `cn` use public `@iap/ui`.

## Ordered, bounded tasks

| Priority | Source file | Required implementation and acceptance | Status |
| --- | --- | --- | --- |
| P1 | `hooks/use-support-tickets.ts` | Preserve user-scoped query keys, enabled guards, UUID checks and ownership error. Recent size 2, ticket size 20, message size 100. Preserve source sorting `createdAt desc`; recent source does **not** supply an ANSWERED filter despite its label. Stop pages on last/absent number/empty content/total pages/short page; deduplicate IDs; automatically load all messages and sort timestamps ascending. | Verified (scoped checks below) |
| P1 | `hooks/use-element-size.ts` | Measure floor/clamped height and width, observe ResizeObserver, disconnect on element change/unmount; stable callback ref. | Verified (scoped checks below) |
| P1 | `components/tickets/support-ticket-item.tsx` | Preserve memoized row, subject fallback, disabled missing ID, status border/color mappings, ticket number, update/create date, select ID and accessible label. | Verified (scoped checks below) |
| P1 | `components/tickets/recent-tickets.tsx` | Preserve refresh-key refetch, rendered callback timing, empty hidden section, two skeletons, recent retry, view-all and per-ticket navigation. | Verified (scoped checks below) |
| P1 | `components/tickets/support-tickets-list.tsx` | Preserve 74px react-window rows, overscan 4, next-page threshold 4, requested page guard, manual failed-page retry, one-time saved scroll restore, terminal row, loading/error/empty states and header controls. | Verified (scoped checks below) |
| P1 | `components/tickets/support-ticket-details.tsx` | Preserve invalid-ID guard, ownership/403/404 errors, refresh sequence, source detail fields/status/claim link, and gated conversation. Source commented priority/category/latest-message fields remain absent. | Verified (scoped checks below) |
| P1 | `components/tickets/support-ticket-conversation.tsx` | Preserve user/support bubbles, sender labels, empty-body dash, source loading/error/empty/retry states, next-page feedback and ordered messages. | Verified (scoped checks below) |

## Exact endpoint and schema dependencies

- `getMyIapTickets`: GET `/my/iap-ticket/tickets`; `findMyIapTicketsRequestSchema`,
  `pageSupportTicketSchema`; query page/size and source owner/sort/direction filters.
- `getMyIapTicketById`: GET `/my/iap-ticket/tickets/{ticketId}`;
  `findMyIapTicketByIdRequestSchema`, `supportTicketSchema`.
- `getMyIapTicketMessages`: GET `/my/iap-ticket/tickets/{ticketId}/messages`;
  `findMyIapTicketMessagesRequestSchema`, `pageSupportTicketMessageSchema`.
- All hooks forward query cancellation through the service's `{ signal }` option.
- Absent `content` is handled by `?? []`, consistently with accepted architecture.

## Presentation and navigation evidence

Existing `formatDateTime` supports exact source formatting by passing host i18n language,
`normalizeTimezone: false`, and `invalidDate: 'throw'` (Asia/Tehran; Persian Jalali or
source English pattern). Package `model/ticket-status.ts` centralizes literal status maps for tickets and
flow options, copying reference constants exactly; they
cannot import the admin ticket feature from the shared package.
The source opens `/myiap/myclaims/{claimRequestId}` in a new tab. A native anchor preserves
that exact href, encoded ID and noopener/noreferrer without inventing a target file route.
Admin integration supplies thin `/myiap/` and `/myiap/$` compatibility routes.
The corresponding full claims page remains a placeholder; full claims behavior is
not claimed by this Support task. No browser screenshot or live-backend verification is claimed here.

## Used translation keys

Values must be copied from the inspected reference locale by the integration task; do
not author or infer translations. Ticket statuses use exact `tickets.status.*` mappings
for OPEN, ASSIGNED, WAITING_FOR_USER, WAITING_FOR_SUPPORT, ANSWERED and CLOSED.

- `supportFlow.tickets.back`
- `supportFlow.tickets.backToChat`
- `supportFlow.tickets.createdAt`
- `supportFlow.tickets.endOfTickets`
- `supportFlow.tickets.errors.details`
- `supportFlow.tickets.errors.forbidden`
- `supportFlow.tickets.errors.invalidId`
- `supportFlow.tickets.errors.list`
- `supportFlow.tickets.errors.messages`
- `supportFlow.tickets.errors.messagesMore`
- `supportFlow.tickets.errors.notFound`
- `supportFlow.tickets.errors.recent`
- `supportFlow.tickets.failedToLoadMore`
- `supportFlow.tickets.lastMessageAt`
- `supportFlow.tickets.listDescription`
- `supportFlow.tickets.listLabel`
- `supportFlow.tickets.loadingMore`
- `supportFlow.tickets.messages`
- `supportFlow.tickets.myTickets`
- `supportFlow.tickets.noMessages`
- `supportFlow.tickets.noTickets`
- `supportFlow.tickets.number`
- `supportFlow.tickets.openTicket`
- `supportFlow.tickets.recentAnswered`
- `supportFlow.tickets.refresh`
- `supportFlow.tickets.retry`
- `supportFlow.tickets.support`
- `supportFlow.tickets.ticketDetails`
- `supportFlow.tickets.untitled`
- `supportFlow.tickets.updatedAt`
- `supportFlow.tickets.viewAll`
- `supportFlow.tickets.viewClaimRequest`
- `supportFlow.tickets.you`

## Verification evidence

- `pnpm --filter @iap/support typecheck`: passed after final query ownership move.
- Scoped ESLint for ticket components, hooks and queries using admin configuration:
  passed (no ignored package files).
- `vitest run src/queries/use-support-tickets.test.ts`: 3 tests passed, covering
  invalid ID guards, cancellation forwarding and foreign-owner detail rejection,
  optional recent content, foreign-ticket filtering and account cache partitioning.
- Prettier check for those same owners and `git diff --check`: passed.
- Workspace architecture check: passed.
- These checks establish source/code and boundary evidence. Visual and backend
  acceptance remain integration-level verification, not a claim of identical pixels.

Integrated admin typecheck passed after preserving literal status keys and scoping
the detail error translation callback to its exact accepted keys, avoiding host
i18next type expansion.
Integrated iap-app typecheck passed after source ticket status locale keys were
added by the integration task. Final scoped ESLint and 3 boundary tests passed.

Final primitive inspection compared reference `src/components/ui/button.tsx`
with `@iap/ui`. All ticket Button consumers opt into `presentation='reference'`
to retain source ghost hover and disabled background/text/pointer behavior.
After the Button presentation change, both integrated applications and Support
typechecks passed again; scoped ESLint, all 3 boundary tests and diff check passed.
