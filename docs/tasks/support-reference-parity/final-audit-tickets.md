# Final Support ticket closure audit

Date: 2026-10-07. Target: `packages/support` in the existing
`support-reference-parity` worktree. Reference:
`/home/sadegh/Android/project/insurance-ui/src/features/support`.

This is a fresh file-by-file source review after the accepted decisions to
remove all admin My-IAP routes and make paginated response `content` nullish.
Earlier ticket audit records are historical evidence. The current workspace
architecture and current user decisions take precedence over those records.

## Inspected closure

| Actual source file | Target owner | Verified behavior |
| --- | --- | --- |
| `components/tickets/recent-tickets.tsx` | Same relative path | Two recent entries; nullish content fallback; refresh-key effect; render callback; loading/refetch skeletons; empty section suppression; error/retry; view-all and ticket callbacks. |
| `components/tickets/support-ticket-item.tsx` | Same relative path | Memoized source-named component; identifier disables missing-ID rows; subject trim/fallback; ticket number including zero; status border colors/badges; updated/created date precedence; accessible label; RTL icons and keyboard focus classes. |
| `components/tickets/support-tickets-list.tsx` | Same relative path | Source 74px rows, four-row prefetch threshold and overscan; sentinel row; request-count guard; scroll restoration and detail-return offset; memoized rows; initial/refetch/next-page loading; retry and end-of-list states. |
| `components/tickets/support-ticket-details.tsx` | Same relative path | UUID validation; back/refresh controls; message refresh-key increment; subject/status/date fields; conditional claim link; conversation only after successful owned detail; ownership/403/404/general error translations. |
| `components/tickets/support-ticket-conversation.tsx` | Same relative path | Ownership-gated messages; refresh-key effect; source sender-dependent alignment, colors and labels; trimmed body fallback; chronological messages; loading/empty/error/next-page retry states. |
| `hooks/use-support-tickets.ts` | `queries/use-support-tickets.ts` | Account-partitioned keys; owner filter; request page sizes 2/20/100; descending creation sort; cancellation; detail ownership rejection; message query ownership gate; automatic subsequent message pages; pagination termination; ID deduplication and timestamp ordering. |
| `hooks/use-element-size.ts` | Same relative path | Exact source implementation: integer nonnegative dimensions, initial measurement, ResizeObserver, disconnect cleanup. |
| `src/constants/tickets-constant.ts` | `model/ticket-status.ts` | All six ticket status colors and six translation-map values equal source. Unused priority/category/visibility constants are outside the mounted closure. |
| `src/utils/format-date.ts` | Public `@iap/ui` date formatting | Callers explicitly forward current language and `normalizeTimezone: false`, `invalidDate: 'throw'`, retaining source Tehran conversion, Persian/English patterns, missing-date dash and invalid-date rejection. |
| `src/components/ui/button.tsx`, `badge.tsx`, `skeleton.tsx` | Public `@iap/ui` primitives | Mounted Button/Badge variants use scoped reference presentation; Skeleton call sites preserve source gray/pulse behavior and primary-foreground overrides. Badge source anchor-hover rules are not reached by these span badges. |

Every active JSX branch and private ticket component was included. Commented-out
source priority/category/latest-message JSX does not render and was not invented
as target behavior. Public and private function names remain source-equivalent.
The query-layer placement, auth hook, contract imports and props-in-body changes
are ownership adaptations; they do not change the inspected ticket behavior.

## Verified discrepancy and correction

`SupportTicketDetails` retained the source path
`/myiap/myclaims/{claimRequestId}` as a same-origin anchor. After the user's
explicit ownership decision, that destination cannot be an admin route.

Existing configuration already supplies the customer application origin:
`tools/prepare-tenant.mjs` emits `VITE_IAP_APP_DOMAIN_URL` from
`brand.domain_url.app`, and
`apps/iap-admin/src/shared/app-shell/admin-panel-switcher.tsx` resolves customer
links against it. The user explicitly confirmed that iap-app no longer uses the `/myiap` prefix.
The correction removes that prefix and reuses the established configuration in the
private `route-adapters/support-claim-request-url.ts` helper. It retains the
user-approved `/myclaims/{claimRequestId}` pathname, encoded identifier, `_blank` target and
`noopener noreferrer`; no admin My-IAP route is created. When configuration is
absent, the package retains the approved same-origin `/myclaims/{claimRequestId}` pathname for standalone use.
The environment value is read when resolving the URL, not at module load.

No additional ticket API/filter/ownership/pagination/status/name discrepancy was
found. The recent hook intentionally does not send an `ANSWERED` filter: the
actual source also omits it despite the recent-answered query-key and heading.

## Verification

- Seven focused tests passed: four query access/request tests and three claim
  navigation tests. Coverage includes nullish recent content, foreign-owner
  exclusion, malformed UUID disabling, cancellation, account cache separation,
  exact recent filters and pagination, configured customer origin, standalone
  fallback and encoded identifiers.
- Support TypeScript passed.
- Scoped ESLint and Prettier checks passed for the ticket changes.
- `git diff --check` passed.
- No admin My-IAP route or feature registration was found in the inspected admin
  route and Support directories.

This report establishes source and unit-level evidence. It does not claim browser
screenshot identity, deployed cross-origin routing success, or live-backend
verification. API/schema and complete locale audits are recorded separately by
their owners in this final audit.
