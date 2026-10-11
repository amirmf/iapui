# Reference parity audit

Compared `insurance-ui/src/features/my-iap/claim-requests/pages/my-claim-request-detail-page.tsx` and every imported detail component with `iap-app`.

The following list records the pre-fix discrepancies; all implementation items are completed below.

1. The page previously inlined all detail fields; reference composes `MyClaimRequestDetailInfoList`, `MyClaimRequestDetailActions`, `MyClaimRequestDetailIResult`, and `FileViewer`.
2. Error handling drops `extractErrorMessage(error)`.
3. The card wrapper and inner `space-y-4 text-sm` structure differ from reference.
4. Reference back navigation is `/myiap/myclaims`; target keeps the approved `/myclaims/` URL adaptation (no `/myiap` prefix).
5. Beneficiary and main-person values omit national code, age, and relation formatting.
6. Sent-to-bank display status and `MY_IAP_SENT_TO_BANK_FILTER_VALUE` handling are missing.
7. Submit date, created date, assessed/returned/paid timestamps, external payment date, document type, and their exact reference fallback behavior are missing.
8. Status badge must use `cn('mt-1', statusBadgeClassName)`.
9. Delete action, adjustment details action, permission gates, exact mutation invalidation keys, toast, and confirmation dialog are missing.
10. Result reasons, sorted objections, objection submission conditions, and assessment-result support action are missing.
11. Attachments are not rendered with the reference `FileViewer` behavior.
12. Detail-specific component names and page ownership are missing.
13. The detail query/service contract exists but must be covered by reference-compatible tests and query key behavior.
14. All reference translation keys must be verified and used verbatim; no replacement keys/defaults should be introduced.

Implementation order: query/service and pure display components; actions; result/attachments; page composition; tests and typecheck.

## Completed tasks and evidence

All discrepancies above are implemented in the focused task records:

- [01 — Page, query and translations](01-page-query-parity.md)
- [02 — Information and readonly components](02-detail-info-parity.md)
- [03 — Results, objections and uploader](03-result-objection-parity.md)
- [04 — Actions and confirmation](04-actions-parity.md)
- [05 — File viewer closure](05-file-viewer-parity.md)

Verified: 91 existing/new iap-app tests plus 2 page-orchestration tests, 7 shared file tests, and 7 affected admin file tests. iap-app and iap-admin typecheck, shared files typecheck, iap-app lint, architecture checks and diff whitespace checks passed. Production app build passed; its standard chunk-size notice includes the lazy HEIC conversion dependency.

The existing enum translation constant was compared against the source: its mapping values, MY_IAP overrides, sent-to-bank value and color classes are retained, with target `satisfies Record` typing. This centralization is appropriate for shared list/detail behavior; no page-local duplicate enum map was introduced.

Accepted architecture adaptations are explicit: customer UI URLs omit `/myiap`; adjustment management links target the configured admin app; API contracts live in public `@iap/api-types`; strict outgoing validation remains. Source schema optional/nullable fields retain equivalent `.nullish()` handling. Source mutation of cached objection arrays is replaced by sorting copies while retaining chronology and latest-objection decisions.

No pixel-identical screenshot or live backend verification is claimed. The evidence is source comparison, mounted behavior tests, transport/schema tests and production compilation.

Reusable guidance is consolidated in `docs/architecture/CUSTOMER-DETAIL-PAGE-PARITY.md`. The existing customer-portal and reference-page-parity skills already cover this workflow; a separate overlapping skill is unnecessary.
