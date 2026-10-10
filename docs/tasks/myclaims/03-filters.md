# My claim request filters

## Verified source and scope

Source: `insurance-ui/src/features/my-iap/claim-requests/components/my-claim-requests-filter.tsx`, `my-claim-my-insurance-policy-form-field.tsx`, `my-claim-my-national-code-form-field.tsx`, the two `hooks/use-get-my-*` lookups, corresponding services/data schemas, `src/components/select/{multi-select,searchable-select}.tsx`, `src/components/date-picker/date-range-picker.tsx`, and `src/constants/claim-status-constant.ts`.

## Implementation tasks

- [ ] Preserve `MyClaimRequestsFilter`, `MyClaimMyInsurancePolicyFormField`, and `MyClaimMyNationalCodeFormField` names. Keep filter contracts in feature `model`, services in `services`, query hooks in `queries`, UI in `components`.
- [ ] Form starts expanded; initial filters reset the form. Policy defaults to the first loaded option, cannot clear, resets the national code to empty on change. Clear retains the policy selection internally and publishes `{}`. Apply removes policy ID before publishing. Policy selection is not counted as an active filter.
- [ ] Use the exact status options from the centralized constant. PAID selection is exclusive and emits `status: ['PAID'], extPaymentDate__neq: 'null'`; SENT_TO_BANK emits `status: ['PAID'], extPaymentDate: 'null'`. Switching away removes the previous exclusive choice. Initial PAID/null filters restore SENT_TO_BANK.
- [ ] Preserve person option labels: `fullName (nationalCode)` or `fullName (nationalCode-<foreign translation>)`. National-code values remain strings; policy IDs remain numbers.
- [ ] Preserve submit-date and creation-date controls/order and local `yyyy-MM-dd` serialization. Count each selected status, national code and each date endpoint independently. Clear command appears only for a positive count.
- [ ] GET `/my/iap/my-policies`, array of `insurancePolicySchema` (`planId`, `id`, `title`). Query key `['insurancePolicies']`, stale/gc time 30 seconds. GET `/my/iap/sub-insured-people/{policyId}`, array of `subInsuredPersonSchema` (`id` nullable number, nationalCode/fullName strings, isForeign nullish Y/N). Query key `['subInsuredPeople', policyId]`, enabled only for positive policy ID.
- [ ] Keep lookup request/response schemas at public `@iap/api-types`. Strict requests and public domain ownership follow current architecture. Services validate both boundaries. List filter arrays are serialized by the page service using mandated `transformApiFilterParams`.
- [ ] Preserve translation keys `myClaimRequests.filters.*`, `claimRequests.dialog.fields.foreign`, `claimRequests.filters.submitDateFrom/To`, `claimRequests.filters.createdAtFrom/To`, `myiap.claimRequest.detail.createdAt`, and primitive `common.loading`, `common.noResults`, `common.clear`, `common.clearAll`, `common.noResultsFound`. Preserve source literal fallbacks for policy/person title and placeholders.
- [ ] Verify exclusive mapping, apply/clear behavior, lookup method/path/request validation, field dependencies, typecheck/lint. Source and unit evidence do not establish pixel or live-backend parity.

## Presentation adaptation

Reuse public `@iap/forms` composition and `@iap/ui` searchable-select/date controls with reference presentation. Source scalar multiselect has clear-all and removable badges, unlike the existing generic object multiselect; use a focused feature-owned status select composed from public UI primitives. No new filtering debounce, validation or navigation is introduced.

