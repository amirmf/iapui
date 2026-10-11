# Task 05: Sub-Insured and Document Type Fields

## 1. Objective

Implement the dependent sub-insured person selection field and the document type selection field:
1. `AgentClaimRequestExtNationalCodeFormField`
2. `AgentClaimRequestFormDocTypes`

Location: `apps/iap-admin/src/features/agent-claim-requests/pages/create/components/`.

## 2. Reference Implementation

### `AgentClaimRequestExtNationalCodeFormField`:
- Props: `{ inquiryNationalCode?: string }`
- Watches `extPolicyId` from form context.
- TanStack Query:
  - `queryKey: ['agentSubInsuredPeople', selectedPolicyId, inquiryNationalCode]`
  - `queryFn`: calls `agentClaimRequestService.getSubInsuredPeople(selectedPolicyId, inquiryNationalCode)`
  - `enabled`: `Number(selectedPolicyId) > 0 && !!inquiryNationalCode`
- Transforms `subInsuredPeople` items:
  - If `isForeign === 'Y'`: `fullName (nationalCode - اتباع)`
  - Else: `fullName (nationalCode)`
- `SupportFeatureButton`: `featureKey="help_extNationalCode"`, `size="xs"`.
- `SearchableSelect`: selects full person object `{ id, nationalCode, fullName }`.

### `AgentClaimRequestFormDocTypes`:
- Consumes `useDocTypesData` from `@modules/doc-types`.
- State: `search` query with `useDeferredValue`.
- Identifies "others" (`docTypeCode === 'others'`) and pins it to the end of the list.
- Filters doc types by deferred search value.
- When selected, populates form's `docType` field with `{ id, docType, docTypeCode, documentGuide }`.

## 3. Implementation Details

- High-performance memoization (`useMemo`, `useDeferredValue`).
- No direct service imports in UI; use the typed feature service `agentClaimRequestService` and module query `useDocTypesData`.

## 4. Verification

Unit tests in:
- `agent-claim-request-ext-national-code-form-field.test.tsx`
- `agent-claim-request-form-doc-types.test.tsx`
