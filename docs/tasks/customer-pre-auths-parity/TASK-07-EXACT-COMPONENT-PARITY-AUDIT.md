# Task 07: Exact Component-by-Component Parity Audit & Implementation (COMPLETED)

## Audit Summary: Reference (`insurance-ui`) vs Current (`iap-app`)

| Reference Component / Hook | Current Target State | Discrepancy | Action Required |
| --- | --- | --- | --- |
| `PreAuthFilter` (`features/my-iap/pre-auths/components/pre-auth-filter.tsx`) | Inlined selects in single component | Missing `Form` wrapper and sub-components `MyClaimMyInsurancePolicyFormField` & `MyClaimMyNationalCodeFormField` | Refactor `PreAuthFilter` to wrap `<Form {...form}>` and delegate to dedicated form fields |
| `MyClaimMyInsurancePolicyFormField` | Missing as dedicated component | Inlined inside filter | Create `components/my-claim-my-insurance-policy-form-field.tsx` with RHF `FormField`, auto-select 1st policy, reset dependent |
| `MyClaimMyNationalCodeFormField` | Missing as dedicated component | Inlined inside filter | Create `components/my-claim-my-national-code-form-field.tsx` with RHF `FormField`, dependent query on `extPolicyId`, foreign suffix |
| `useGetMyInsurancePolicy` | Module query object | Different invocation style | Export typed `useGetMyInsurancePolicy` hook matching reference signature and queryKey `['insurancePolicies']` |
| `useGetMySubInsuredPeople` | Module query object | Different invocation style | Export typed `useGetMySubInsuredPeople({ policyId })` hook matching reference signature and queryKey `['subInsuredPeople', policyId]` |
| `PreAuthsPage` | Implemented | `useEffect` deps list slightly diverged; translation default values inlined | Align `useEffect` deps `[pageData, pageData?.content?.length, filters, page, isLoading, isFetching]`; clean inline defaults |
| `PreAuthCard` | Implemented | Null handling on illness title diverged from `${preAuth.illnessDesc} (${preAuth.illnessId})` | Align card title and class bindings to reference |
| `Pagination` | Implemented | Used `common.pagination.*` instead of `myClaimRequests.*` | Align translation keys to `myClaimRequests.previous`, `myClaimRequests.pageIndicator`, `myClaimRequests.next`, `myClaimRequests.pagination` |
| Translations (`fa/common.json`, `en/common.json`) | Partial | Missing `myClaimRequests` section and `claimRequests.dialog.fields` | Add `myClaimRequests` and `claimRequests.dialog.fields` to locales |

## Implementation Steps

1. **Locale additions**: Add `myClaimRequests` and `claimRequests.dialog.fields` to `fa/common.json` and `en/common.json`.
2. **Hooks creation**: Provide `useGetMyInsurancePolicy` and `useGetMySubInsuredPeople` hooks matching reference.
3. **Form fields creation**: Implement `MyClaimMyInsurancePolicyFormField` and `MyClaimMyNationalCodeFormField` using `@iap/forms` primitives.
4. **Refactor `PreAuthFilter`**: Wire `<Form {...form}>` and child form fields with exact reference parity.
5. **Refactor `Pagination`**: Update translation keys to `myClaimRequests.*`.
6. **Refactor `PreAuthCard` & `PreAuthsPage`**: Align minor markup, dependencies, and translations.
7. **Verification**: Run `typecheck`, `lint`, `test`, `build`, and architecture checks.
