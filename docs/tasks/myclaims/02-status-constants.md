# My Claims: centralized enum presentation

Status: implemented; focused helper tests passed. Full lint/typecheck is owned by integration.

## Source and target

Read `insurance-ui/src/constants/claim-status-constant.ts` line by line. The page consumes only claim status badge/border maps, generic status translations, My-IAP overrides, the synthetic sent-to-bank value/type, and `getClaimRequestStatusOptionsIAP`. Implement this exact consumed subset at `apps/iap-app/src/features/my-claims/constants/claim-status-constant.ts`.

## Component-level tasks

1. MyClaimRequestCard: use exact `claimStatusColors` and `claimStatusBorderColors`, never repeat CSS status switches. Badge classes and borders cover all 17 statuses.
2. MyClaimRequestCard: use `CLAIM_REQUEST_STATUS_TRANSLATION_KEYS_MY_IAP`. Preserve generic map keys and overwrite DELEGATED, DEDICATED_TO_USER, SENT_FAILED to `claimRequests.status.inAssessment`; overwrite SENT to `claimRequests.status.send_customer`.
3. MyClaimRequestsFilter: use `getClaimRequestStatusOptionsIAP` with exact ordered values IN_REVIEW, APPROVED, REJECTED, SENT, RETURN, PAID, SENT_TO_BANK. Filters intentionally use generic translations, so SENT's label differs from the card label. Preserve `claimRequests.status.sentToBank` for the synthetic value.
4. Card status utility: copy `getClaimRequestDisplayStatus` and `getClaimRequestDisplayStatusColor` into feature utils. PAID becomes SENT_TO_BANK only when extPaymentDate is null or undefined; an empty string keeps PAID. Synthetic status uses PAID colors.
5. Timestamp utility: preserve `myIapFindTimeStamp` in `utils/utils.ts`. Source copies and reverses history, then overwrites each matching timestamp; this yields the first matching occurrence in the original array, without sorting or mutating it. Preserve missing matching timestamp as undefined and absent matching status as null.

## Consistency assessment

Centralized typed enum maps keep translations and styles consistent. The source's Immer `produce` merely copies a fixed translation map; a typed object spread preserves behavior with less work at module initialization. `Record<ClaimRequestStatus, string>` verifies completeness and exact exports preserve recognizability.

The reference constant file's AI, duplicate, objection-role, assessment-resolution, assessment-type, validator, request-type and IBAN maps are unrelated to the mounted page; copying them would create unused scope. Existing admin equivalents cannot be imported into iap-app because applications must not depend on one another. Badge classes differ only in token order from admin; the app map retains exact reference text. A new cross-application presentation package is unnecessary for this page-only change.

## Completion criteria

Exact key/value maps, all customer overrides, synthetic value semantics and filter order must pass focused tests. Component consumers must import these maps rather than invent translations. Contract tests also prove first-occurrence history and non-mutation semantics. Browser and backend parity require separate integration evidence.

