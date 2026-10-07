# CRP-2026-02 — ClaimRequestDataTableToolbar and ClaimRequestStatusFilter

Evidence: reference components/claim-request-data-table-toolbar.tsx, claim-request-status-filter.tsx, claim-request-status-filter-constants.ts. Current target ClaimRequestToolbar uses flat filters; shared GroupedTableFilterQueryParams is already available.

- [x] Use canonical component names and split configuration/group assembly into focused files. Reuse shared grouped controls with reference presentation, debounce and reset cancellation.
- [x] Match ordered groups and field modes: request businessKey,docType.id(role-gated),status(ALL only),aiStatus,isReturn,requestType,createdAt(date-time),submitDate(date); insured extMainNationalCode,extNationalCode,extDisplayName,extMainDisplayName,extCustomerName,extPlanCaption,specialDiseases; organization extContractId,extPolicyId,extWorkUnitName,extWorkUnitCode,extWorkUnitCityName,extWorkUnitProvinceName; financial outpatientDocAcceptanceExtId,amount,totalSumAmount,corePaidAmount,corePaidAmountPercent(number ranges),seenBy,ibanStatus; assessment latestAssignementDisplayName,latestAssignementUsername,assessedAt(date-time),mainAssignedUserDisplayName,mainAssignedUserUsername,registeredByAgentDisplayName,registeredByAgentUsername.
- [x] Do not render commented source extCustomerCompanyCode/extCustomerNationalCode/extCustomerCityName filters. Copy source numerical/asLike flags exactly.
- [x] Preserve docType lookup authorization and existing endpoint query. Add disease facet using exact enum option order and translations.
- [x] Copy claimRequests.filterGroups.*, filters.extMainDisplayName and personSpecialDiseases translation values verbatim from source. Preserve all quick status subsets/count semantics and source eight-column grid.
- [x] Quick status transition changes only feature/status/payment/page/quickStatus keys as source; do not inject default pagination/sorting keys into URL.
- [x] Test ordered groups, permission gate, ALL-only status, disease serialization, reset/debounce and quick status transitions.

Final verification: complete admin suite passed (193 files / 549 tests); shared UI passed 58 tests and forms passed 11 tests. After the final memoization/URL-adapter edit, 24 affected files / 71 tests passed, including three new URL transition tests. Workspace typecheck, lint and architecture checks passed; final affected-file lint and git diff --check passed. Source/automated coverage only; no browser screenshots or live backend check.
