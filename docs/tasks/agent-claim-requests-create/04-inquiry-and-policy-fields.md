# Task 04: Inquiry and Policy Fields

## 1. Objective

Implement the first two form fields of the creation journey:
1. `AgentClaimRequestInquiryNationalCodeFormField`
2. `AgentClaimRequestExtPolicyIdFormField`

Location: `apps/iap-admin/src/features/agent-claim-requests/pages/create/components/`.

## 2. Reference Implementation

### `AgentClaimRequestInquiryNationalCodeFormField`:
- Props: `{ selectedUserDisplayName?: string }`
- Label: `agent.claimRequests.create.fields.inquiryNationalCode` with required red asterisk.
- `SupportFeatureButton`: `featureKey="help_nationalCode"`, `size="xs"`, `variant="default"`.
- `Input`: numerical, `maxLength={10}`, placeholder from `agent.claimRequests.create.fields.inquiryNationalCodePlaceholder`.
- If `selectedUserDisplayName` is provided: displays a subtext indicating `selectedNationalCode: {selectedUserDisplayName}` in `text-primary-700`.

### `AgentClaimRequestExtPolicyIdFormField`:
- Props: `{ policies?: RegisteryAgentPolicy[]; isInquiryLoading: boolean }`
- Label: `claimRequests.dialog.fields.insurancePolicy` with required red asterisk.
- `SupportFeatureButton`: `featureKey="help_insurancePolicy"`, `size="xs"`, `variant="default"`.
- `SearchableSelect`:
  - Items mapped from `policies` with `label: policy.title`, `value: String(policy.id)`.
  - Placeholder: `claimRequests.dialog.fields.selectInsurancePolicy`.
  - Auto-selects the first policy when `policyItems` become available and no policy is selected.
  - Clears `extNationalCode` whenever policy changes or resets.
  - Passes `isLoading={isInquiryLoading}`.

## 3. Implementation Details

- Clean React Hook Form context binding (`useFormContext`).
- Avoid unnecessary re-renders with memoized item lists.
- Proper cleanup and synchronization of dependent fields (`extNationalCode` reset upon policy switch).

## 4. Verification

Unit tests in:
- `agent-claim-request-inquiry-national-code-form-field.test.tsx`
- `agent-claim-request-ext-policy-id-form-field.test.tsx`
