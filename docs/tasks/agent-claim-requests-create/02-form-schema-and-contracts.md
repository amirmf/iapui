# Task 02: Form Schema and Contracts

## 1. Objective

Define the Zod v4 validation schema and TypeScript types for the Agent Claim Request Create Form in `apps/iap-admin/src/features/agent-claim-requests/pages/create/model/agent-claim-request-form-schema.ts`.

## 2. Reference Implementation

In `insurance-ui/src/features/agent-claim-requests/data/agent-claim-request-form-schema.ts`:
```ts
export const agentClaimRequestFormSchema = (t: (key: string) => string) =>
  z.object({
    inquiryNationalCode: z
      .string()
      .trim()
      .length(
        10,
        t('agent.claimRequests.create.validation.inquiryNationalCodeLength')
      )
      .min(
        1,
        t('agent.claimRequests.create.validation.inquiryNationalCodeRequired')
      ),
    submitDate: z.date(t('claimRequests.validation.submitDateRequired')),
    amount: z.string().min(1, t('claimRequests.validation.amountRequired')),
    attachments: z
      .array(resolvedAttachmentSchema)
      .nonempty(t('claimRequests.validation.attachmentsRequired')),
    docType: docTypeSchema
      .pick({
        id: true,
        docType: true,
        docTypeCode: true,
        documentGuide: true,
      })
      .extend({
        id: z.string().min(1, t('claimRequests.validation.docTypeRequired')),
      }),
    extNationalCode: subInsuredPersonResponseSchema.refine(
      (value) => !!value.nationalCode,
      {
        message: t('claimRequests.validation.subInsuredPersonRequired'),
      }
    ),
    extPolicyId: z
      .number()
      .min(1, t('claimRequests.validation.insurancePolicyRequired')),
  })
```

## 3. Implementation in `iap-admin`

- Placement: `apps/iap-admin/src/features/agent-claim-requests/pages/create/model/agent-claim-request-form-schema.ts`
- Re-export via `apps/iap-admin/src/features/agent-claim-requests/model/index.ts`
- Import schemas from `@iap/api-types`:
  - `attachmentSchema`
  - `docTypeSchema`
  - `subInsuredPersonResponseSchema`
- Define:
  - `agentClaimRequestFormSchema(t: (key: string) => string)`
  - `type AgentClaimRequestFormValues = z.infer<ReturnType<typeof agentClaimRequestFormSchema>>`
  - `defaultValues: Partial<AgentClaimRequestFormValues>`

## 4. Verification

Unit tests in `agent-claim-request-form-schema.test.ts`:
- Valid values parse successfully.
- Missing or invalid `inquiryNationalCode` (< 10 or > 10 chars) returns expected error.
- Empty `amount`, `submitDate`, `attachments`, `docType`, `extNationalCode`, `extPolicyId` trigger translated validation errors.
