# Task 02 — route adapters, constants, and models

## Objective
Implement route adapters, status translation maps, color dictionaries, and routing utilities for customer user claim requests.

## Execution details
1. **`useSyncQueryParamsTableFilter`**:
   - Location: `apps/iap-admin/src/features/customer-user/pages/claim-requests/route-adapters/use-sync-query-params-table-filter.ts`
   - Parity with `insurance-ui/src/components/data-table/filter/use-sync-query-params-table-filter.ts`:
     - Reads `location.search` for `page`, `size`, `sort`, `direction`.
     - Controls `pagination` (`pageIndex`, `pageSize`).
     - Controls `sorting` (`SortingState`).
     - Exposes `onPaginationChange` and `onSortingChange` updating URL via `router.navigate({ to: './', replace: true, search: ... })`.
     - Exposes clean `filters` object excluding pagination parameters.

2. **`customer-user-claim-constant.ts`**:
   - Location: `apps/iap-admin/src/features/customer-user/model/customer-user-claim-constant.ts`
   - Parity with `insurance-ui/src/constants/claim-status-constant.ts`:
     - `claimStatusColors`: Record of CSS class strings for all `ClaimRequestStatus` values.
     - `aiStatusColors`: Record of CSS class strings for all `ClaimRequestAiStatus` values.
     - `CLAIM_REQUEST_STATUS_TRANSLATION_KEYS`: Record of translation keys for all `ClaimRequestStatus` values.
     - `CLAIM_REQUEST_AI_STATUS_TRANSLATION_KEYS`: Record of translation keys for all `ClaimRequestAiStatus` values.
     - `ignoreSkipCurrentUserFilter`: Array of statuses where `skipCurrentUserFilter` is omitted.

3. **`customer-user-claim-routes.ts`**:
   - Location: `apps/iap-admin/src/features/customer-user/pages/claim-requests/utils/customer-user-claim-routes.ts`
   - Parity with `insurance-ui/src/features/customer-user/utils/customer-user-claim-routes.ts`:
     - `list`: `'/customer-user/claim-requests'`
     - `management`: `(claimRequestId: string) => '/customer-user/claim-requests/' + claimRequestId + '/claim-request-management'`
