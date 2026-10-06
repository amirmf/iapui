# 05 — Inspector Rule Details Sub-Table

Status: Completed

## Reference Source
- Directory: `insurance-ui/src/features/ai-assessment-rules/components/ai-assessment-rule-details-table/`
  - `index.tsx`: main details table container
  - `ai-assessment-rule-detail-columns.tsx`: column definitions
  - `ai-assessment-rule-detail-actions.tsx`: row actions
  - `ai-assessment-rule-detail-create-button.tsx`: add detail button
  - `ai-assessment-rule-detail-form-dialog.tsx`: dialog wrapper
  - `ai-assessment-rule-detail-form.tsx`: form with doc type, threshold, methods, prompt, JSON editor
  - `ai-assessment-rule-detail-delete-dialog.tsx`: confirm deletion
  - `ai-assessment-rule-detail-doc-type-field.tsx`: searchable select for doc types
  - `ai-assessment-rule-detail-utils.ts`: `replaceRuleDetail` array helper

## Target Destination
- Directory: `apps/iap-admin/src/features/ai-assessment-rules/components/ai-assessment-rule-details-table/`

## Component Specifications
1. **AiAssessmentRuleDetailsTable (`index.tsx`)**:
   - Displays sub-table using `SimpleDataTable`
   - Binds to `useAiAssessmentRuleDetailsTableStore`
   - Handles detail add, edit, delete by calling `useUpdateAiAssessmentRuleMutation` with updated `ruleDetails`
   - Renders create button, table, form dialog, and delete confirmation dialog
2. **AiAssessmentRuleDetailColumns**:
   - `docType`: `TwoLineHeader` (`docTypeCode` / `methodNames`), `TwoLineCell` (`docType?.docTypeCode`, `methodNames`)
   - `minThreshold`: `TwoLineHeader` (`minThreshold` / `maxThreshold`), `TwoLineCell` (`minThreshold`, `maxThreshold`)
   - `prompt`: `TwoLineHeader` (`prompt`), `LongText` (`prompt ?? '-'`)
   - `actions`: Edit, Delete buttons
3. **AiAssessmentRuleDetailForm**:
   - RHF with typed zod resolver for `aiAssessmentRuleDetailFormSchema(t)`
   - Fields:
     - `docTypeCode` via `AiAssessmentRuleDetailDocTypeField` (SearchableSelect with `useDocTypesData.optionsCode()`)
     - `minThreshold`, `maxThreshold` numerical inputs
     - `methodNames`, `prompt` Textarea
     - `inputParams` JSON Editor
4. **AiAssessmentRuleDetailDeleteDialog**:
   - Uses `@iap/dialogs` `ConfirmDialog` with destructive styling

## Verification Criteria
- Unit tests verifying form submit mapping, sub-table mutation payload generation, and row replacement utils.
