> Current response contract (2026-10-07): paginated `content` uses `.nullish()` across the workspace. Missing values and `null` are accepted; present array items are validated. This supersedes earlier optional-only and null-rejection statements, including exact-reference acceptance claims for this field.

> Current ownership decision (2026-10-07): My-IAP belongs exclusively to `iap-app`. No My-IAP routes, pages, or placeholders are registered in `iap-admin`. Earlier placeholder descriptions below are superseded. Shared Support ticket views and backend contracts remain in scope.

# Support tickets fresh reference audit

Date: 2026-10-07. This record supersedes earlier ticket parity claims for the audited closure.

## Scope and evidence

Reference root: `/home/sadegh/Android/project/insurance-ui/src/features/support`.
Target root: `packages/support/src`.

Each complete source file below was compared against its same-responsibility target. Imports, formatting, props destructuring inside component bodies, strict types and shared public package boundaries were normalized conceptually; behavior was compared directly.

| Reference | Target | Verified behavior and names |
| --- | --- | --- |
| `components/tickets/recent-tickets.tsx` | same relative path | `RecentTickets`, `RecentTicketsSkeleton`; rendering callback dependencies, refresh, loading/error/empty/list branches, open-all and ticket actions |
| `components/tickets/support-ticket-item.tsx` | same relative path | memoized `SupportTicketItem`; missing-ID disabling, subject/body fallback, owner name, category icon, status border/classes, badge and update/create date preference |
| `components/tickets/support-tickets-list.tsx` | same relative path | `SupportTicketsList`, `SupportTicketListRow`, `MemoizedSupportTicketListRow`, `TicketsListSkeleton`, `TicketListState`; row height 74, threshold 4, viewport measure, initial scroll restoration and captured scroll, pagination/error retry |
| `components/tickets/support-ticket-details.tsx` | same relative path | `SupportTicketDetails`, `TicketDetailValue`, `TicketDetailsSkeleton`, `DetailsError`, `getTicketErrorMessage`; UUID guards, ownership errors, Axios 403/404, refetch and conversation refresh sequencing, status/date metadata and external claim link |
| `components/tickets/support-ticket-conversation.tsx` | same relative path | `SupportTicketConversation`, `SupportTicketMessageEntry`, `MessagesSkeleton`, `MessagesError`; refresh effect, paginated errors, sender labels, message body fallback, bubble classes and time |
| `hooks/use-support-tickets.ts` | `queries/use-support-tickets.ts` | `useRecentTickets`, `useInfiniteMyTickets`, `useTicketDetails`, `useTicketMessages`, `isValidSupportTicketId`, `SupportTicketOwnershipError`; account-partitioned keys, query guards, abort signals, page sizes 2/20/100, ownership filtering, page stopping, deduplication and ascending message timestamps |
| `hooks/use-element-size.ts` | same relative path | Entire file identical; ResizeObserver ownership/cleanup and measurements |
| `src/constants/tickets-constant.ts` | `model/ticket-status.ts` | All six mounted status translation keys and color strings identical |

Recent-ticket requests intentionally do not add an ANSWERED status filter: the reference's actual call omits it despite its display heading. Detail and message requests preserve reference ownership gating and argument shapes. Endpoint and schema evidence is recorded in the separate service/contract audit.

## Verified discrepancy and correction

The shared reference Skeleton uses `bg-gray-200` and continuous `animate-pulse`. The target `@iap/ui` Skeleton defaults to `bg-surface-muted` and stops animation under reduced motion. The tokens have distinct RGB values, so this was an actual presentation discrepancy. Every mounted ticket skeleton now provides scoped `bg-gray-200` where the source does not supply another background, and `motion-reduce:animate-pulse`. The source's three `bg-primary-foreground/20` overrides remain intact. Shared default consumers were not changed.

Button reference presentation preserves the source variants and disabled/ghost behavior used by this closure. Badge reference presentation preserves the source outline span style. Source anchor-only badge hover classes are irrelevant here because mounted ticket badges are spans. Dates explicitly pass the host i18n language, disable timezone normalization and throw on invalid dates, matching source formatting. The source Router link opens a new tab; the package anchor retains its path, encoded ID, target and rel. My-IAP pages remain intentional placeholders under the accepted user scope.

## Validation and limits

- `pnpm --filter @iap/support test`: 47 tests passed.
- `pnpm --filter iap-app typecheck`: passed.
- `pnpm --filter iap-admin typecheck`: passed.
- Final lint/diff checks are recorded in the parent audit report after integration.
- This is exhaustive static file comparison for this closure, not screenshot comparison or live backend verification. Shared theme tokens remain governed by current application architecture.

Final integrated checks after all audit corrections are recorded in [reaudit.md](reaudit.md).
