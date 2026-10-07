# Main claim-request component re-audit (2026-10-07)

This supersedes earlier completion claims for the main-page closure. Source root:
`/home/sadegh/Android/project/insurance-ui/src/features/claim-requests/`.
Target root: `apps/iap-admin/src/features/claim-requests/`.

## Component inventory and inspected behavior

| Source | Target | Comparison |
| --- | --- | --- |
| `pages/claim-requests-page.tsx` / `ClaimRequestsPage` | `claim-requests-page.tsx` | Same feature switch and provider ownership; tickets branch audited separately. |
| `pages/claim-requests-page.tsx` / `ClaimRequestsContent` | `components/claim-requests-content.tsx` | Same title, layout classes, selection derivation, pagination clearing, loading/fetching distinction and table props, except findings M1/M2. |
| `components/claim-request-header-actions/index.tsx` | `components/claim-request-header-actions.tsx` | Same order, permission gates, disabled selection predicate and dialog names; findings M3/M4. |
| `components/claim-request-header-actions/claim-request-export-excel-button.tsx` | `components/claim-request-export-excel-button.tsx` | Same download icon, filename, success key, pending disabled state; services audited separately. |
| `components/claim-request-header-actions/claim-request-inquiry-fanavaran-button.tsx` | `components/claim-request-inquiry-fanavaran-button.tsx` | Same pending guard, success close/clear/await ordering and source-specific failure key; common confirmation audited separately. |
| `components/claim-request-header-actions/claim-request-document-receipt-button.tsx` | `components/claim-request-document-receipt-button.tsx` | Delegated dialog/form audit. |
| `components/claim-request-columns.tsx` | `components/claim-request-columns.tsx` | All 13 column IDs/order, widths, secondary values, date caller settings, numeric formats, adjustment/disease/status labels inspected; findings M1/M5/M6/M7. |
| Inline disease badge rendering | `components/claim-request-special-disease-badges.tsx` | Source-backed small extraction; finding M5. |
| `components/claim-request-row-actions.tsx` | `components/claim-request-row-actions.tsx` | Same gates, order, notification pending/missing-ID and remove-assessment validation; findings M3/M6. Literal fallbacks preserve source-absent keys. |
| `components/claim-request-data-table-toolbar.tsx` | `components/claim-request-data-table-toolbar.tsx`, `components/use-claim-request-filter-groups.ts` | Same five mounted group orders, input flags, range formatting and facet order/permissions; source commented organization filters remain unmounted. Finding M8. Shared filter rendering audited separately. |
| `components/claim-request-status-filter.tsx` | `components/claim-request-status-filter.tsx` | Same grid classes, selected classes, count-cache reset/render semantics, doctor subset, ticket dash and exact translation keys. |
| `components/claim-request-fetch-new-empty-state.tsx` | `components/claim-request-fetch-new-empty-state.tsx` | Same layout, two numerical fields, trimmed request mapping, spinner, pending disabled state and success callback. Optional prop discrepancy M9. |
| `hooks/use-claim-request-ids.ts` | Missing before this audit | M1. |
| Shared `TwoLineCell`, `LongText`, table/action/tooltip primitives | Shared public APIs | Shared audit owns comparison; secondary text structure discrepancy forwarded there. |

## Verified tasks (recorded before implementation)

- [x] **M1 / P1: Restore loaded-ID coordination.** Source page collects nonempty IDs after loaded results and writes them only if nonempty. National-code link always mounts (ID defaults to empty string), calls `setRemoveId`, removing one matching ID. Target omitted this store/effect/callback. Add feature-owned `context/store/claim-request-ids-store.ts`; preserve exact public `useClaimRequestIds` name. Downstream management screen is outside this page request and still has a target placeholder; record this limitation instead of inventing its behavior.
- [x] **M2 / P1: Restore source empty-state selection.** Target sends `hasActiveFilters` from URL filters. Source table chooses empty versus no-results using input data length. Remove feature override; URL filters must not replace the source custom fetch-new empty content.
- [x] **M3 / P2: Restore source icons.** Header uses Lucide RefreshCw (default size) instead of Tabler IconRefresh size18. Row actions use Lucide Eye/Bell/Trash2/UserCheck/UserMinus instead of source IconEye/IconBell/IconTrash/IconUserEdit/IconUserMinus size5. Use installed `@tabler/icons-react`; preserve source geometry and semantics.
- [x] **M4 / P2: Restore source header prop names and label wrappers.** Target renames `isLoading`, `claimRequestIds`, `onRefetch` to `isFetching`, `selectedIds`, `onRefresh`, and omits spans on first two bulk buttons. Restore source names/wrappers and caller.
- [x] **M5 / P2: Forward reference Badge presentation.** Column adjustment/status/AI and disease badges currently use default presentation, missing source focus/overflow/transition classes. Opt in to existing shared reference capability.
- [x] **M6 / P2: Preserve source unconditional links.** Target hides national-code navigation when ID absent and hides the view action without ID. Source mounts both. Restore source link rendering without adding new guards.
- [x] **M7 / P2: Restore column semantics.** Source amount accessor is formatted string (`en-US`, ASCII dash), but target accessor is raw number. Restore accessor value and source secondary amount font-normal; add status filterFn equal to source array-includes predicate. Other column date settings and zero/null behavior match inspected source.
- [x] **M8 / P1: Restore doc-type option population and initial cached data.** Source `hooks/use-doc-types-data.ts` maps every item to `{label: docType || '', value: id || ''}`; target drops empty entries. Source query reads `doc-types:page-100` localStorage as initialData and stores fetched content; target has no initial cache. Restore these behaviors in the feature's focused option query while preserving current service/public-package ownership. Same source query key/stale/gc/role gate must remain.
- [x] **M9 / P2: Restore optional empty-state callback.** Source `onFetch` is optional; target required it. Match optional callback and optional success invocation.

- [x] **M10 / P2: Restore Excel exporter injection.** Source optional `exportExcel` prop defaults to `claimRequestService.exportPageLiteExcel`; target hardcodes it. Preserve the optional prop and exact `{ filters }` call for callers selecting another verified exporter.

## Verification criteria

Test loaded-ID replacement/removal (including absent ID and duplicate semantics),
actual column/accessor/action structures, permission/empty-state options and exact
Tabler icon choices. Run affected tests, application typecheck, scoped lint and
`git diff --check`. Source inspection and unit tests do not establish browser
pixel parity or live-backend correctness; those coverage limits remain explicit.

## Implementation evidence

M1–M10 are implemented. M8 reuses the already existing public
`@modules/doc-types` `useDocTypesData.options` capability instead of duplicating
its localStorage/query implementation. Shared `TwoLineCell` presentation is
forwarded at every claim column boundary. The source ID store has been restored
for this closure; the management route remains a separate placeholder outside
this page's implementation scope.

- Four focused test files / 10 tests passed: column/action rendering, loaded-ID
  coordination, grouped toolbar, and the existing public doc-type cache hook.
- Scoped ESLint passed for all owned changed components, hooks and store/tests.
- `git diff --check` passed.
- Application typecheck after fixes found only a concurrent duplicate
  `AssessmentItem` declaration in `packages/api-types/src/assessment-item/index.ts`;
  final integration typecheck remains required before closing the checklist.
- No browser screenshot or live-backend check performed by this audit worker.

Integration concern: older target consumers share the doc-type query key with
whole-page cached results whereas the source-equivalent module caches the content
array. This pre-existing collision was reported to the integration owner.
