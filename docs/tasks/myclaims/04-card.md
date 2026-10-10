# Task 04: MyClaimRequestCard

Reference: `insurance-ui/src/features/my-iap/claim-requests/components/my-claim-request-card.tsx`, inspected directly.

## Verified behavior

- Preserve the `MyClaimRequestCard` component name and consume the shared `ClaimRequest` schema type.
- Display document-type title, falling back to joined document types; display status using customer translation keys and the sent-to-bank derived status.
- Apply the reference status badge and border colors through `@iap/ui` `cn`.
- Preserve business key, adjustment badge, submit/creation dates, approval timestamp, payment timestamp/external payment date when paid, and return timestamp when returned.
- Preserve beneficiary tooltip, English-grouped amount, joined rejection reasons, and latest objection from a role other than `ENDUSER`.
- Delete is allowed for RETURN, REJECTED, IN_ASSESSMENT, DEDICATED_TO_USER, and DELEGATED. Set current row before opening the feature delete dialog.
- RETURN enables completeAttachment; details remains visible. Both links target the existing `/myclaims/$id/` route, removing only the reference `/myiap` prefix.

## Translation contract

Use `claimRequests.status.sentToBank`, customer status mappings from `constants/claim-status-constant.ts`, and the exact reference `myiap.claimRequest.detail.*` keys: businessKey, adjustment, submitDate, createdAt, approvedAt, paidAt, extPaymentDate, returnedAt, beneficiary, amount, rejectionReasons, completeAttachment. Actions use `myiap.claimRequest.actions.delete` and `viewDetails`.

## Architecture and verification

Own the card and its focused presentation helpers under the single-page feature's `components/`. Use shared public APIs (`@iap/ui`, `@iap/api-types`), feature status helpers, and narrow store action selectors. Dates retain reference timezone behavior via `formatDate` options. The card owns no API calls. Verify typecheck/lint after integration and compare conditional visibility against the source.

