# 07 — Main Rule Form Dialog and Fields

Status: Completed

## Reference Source
- Dialog: `insurance-ui/src/features/ai-assessment-rules/components/ai-assessment-rule-form-dialog/ai-assessment-rule-form-dialog.tsx`
- Form: `insurance-ui/src/features/ai-assessment-rules/components/ai-assessment-rule-form-dialog/ai-assessment-rule-form.tsx`
- Doc Types Field: `insurance-ui/src/features/ai-assessment-rules/components/ai-assessment-rule-form-dialog/ai-assessment-rule-doc-types-field.tsx`
- Agreement Field: `insurance-ui/src/components/agreement/agreement-field.tsx`
- JSON Editor: `insurance-ui/src/components/json-editor/json-editor.tsx`

## Target Destination
- Directory: `apps/iap-admin/src/features/ai-assessment-rules/components/ai-assessment-rule-form-dialog/`
  - `ai-assessment-rule-form-dialog.tsx`
  - `ai-assessment-rule-form.tsx`
  - `ai-assessment-rule-doc-types-field.tsx`
  - `ai-assessment-rule-agreement-field.tsx`
  - `ai-assessment-rule-json-editor.tsx` (or shared json editor)

## Component Specifications
1. **AiAssessmentRuleFormDialog**:
   - Manages dialog open/close state from `useAiAssessmentRule`
   - Handles pending states during submit
   - Dynamically displays create vs edit title (`aiAssessmentRules.create.title` / `aiAssessmentRules.edit.title`)
2. **AiAssessmentRuleForm**:
   - RHF with typed zod resolver for `aiAssessmentRuleFormSchema(t)`
   - Dynamic agreement field rendering based on `definitionType`:
     - `AGREEMENT_TEMPLATE` -> `agreementTemplateCode`
     - `CONTRACT` -> `extContractId`
     - `POLICY` -> `extPolicyId`
     - Clears opposite fields on `definitionType` change
   - Form fields:
     - `definitionType` (SingleSelect)
     - `ruleState` (SingleSelect)
     - Dynamic agreement field (`AiAssessmentRuleAgreementField`)
     - `status` (SingleSelect)
     - `aiModel` (SingleSelect)
     - `docTypes` (`AiAssessmentRuleDocTypesField` using `MultiSelect`)
     - `methodNames` (Textarea)
     - `inputParams` (JSON Editor with validation)
   - Mutations: calls `useCreateAiAssessmentRuleMutation` or `useUpdateAiAssessmentRuleMutation`
3. **AiAssessmentRuleDocTypesField**:
   - Uses `useDocTypesData.optionsCode()` from `@modules/doc-types/queries/use-doc-types-data`
   - Maps between array of `DocType` objects and multi-select codes
4. **AiAssessmentRuleAgreementField**:
   - Queries `agreementService.getPage` for debounced text search
   - Resolves selected item when editing existing rule
   - Renders `SearchableSelect` from `@iap/ui`

## Verification Criteria
- Unit tests for form initial values, definition type switching, agreement field resolution, and payload serialization.
