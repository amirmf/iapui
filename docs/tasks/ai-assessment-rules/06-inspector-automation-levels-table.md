# 06 — Inspector Automation Levels Sub-Table

Status: Completed

## Reference Source
- Directory: `insurance-ui/src/features/ai-assessment-rules/components/ai-assessment-rule-automation-levels-table/`
  - `index.tsx`: main automation levels table container
  - `ai-assessment-rule-automation-level-columns.tsx`: column definitions
  - `ai-assessment-rule-automation-level-actions.tsx`: row actions
  - `ai-assessment-rule-automation-level-create-button.tsx`: add level button
  - `ai-assessment-rule-automation-level-form-dialog.tsx`: dialog wrapper
  - `ai-assessment-rule-automation-level-form.tsx`: form with level single-select and thresholds
  - `ai-assessment-rule-automation-level-delete-dialog.tsx`: confirm deletion
  - `ai-assessment-rule-automation-level-utils.ts`: `replaceAutomationLevel` array helper

## Target Destination
- Directory: `apps/iap-admin/src/features/ai-assessment-rules/components/ai-assessment-rule-automation-levels-table/`

## Component Specifications
1. **AiAssessmentRuleAutomationLevelsTable (`index.tsx`)**:
   - Displays sub-table using `SimpleDataTable`
   - Binds to `useAiAssessmentRuleAutomationLevelsTableStore`
   - Handles level add, edit, delete by calling `useUpdateAiAssessmentRuleMutation` with updated `automationLevels`
   - Renders create button, table, form dialog, and delete confirmation dialog
2. **AiAssessmentRuleAutomationLevelColumns**:
   - `automationLevel`: `DataTableColumnHeader`, Badge with localized enum label
   - `minThreshold`: `DataTableColumnHeader`, number or `common.notAvailable`
   - `maxThreshold`: `DataTableColumnHeader`, number or `common.notAvailable`
   - `actions`: Edit, Delete buttons
3. **AiAssessmentRuleAutomationLevelForm**:
   - RHF with typed zod resolver for `aiAssessmentRuleAutomationLevelFormSchema(t)`
   - Fields:
     - `automationLevel`: `SingleSelect` with `getAiAssessmentRuleAutomationLevelOptions(t)`
     - `minThreshold`, `maxThreshold`: numerical inputs
4. **AiAssessmentRuleAutomationLevelDeleteDialog**:
   - Uses `@iap/dialogs` `ConfirmDialog` with destructive styling

## Verification Criteria
- Unit tests verifying form submit mapping, sub-table mutation payload generation, and row replacement utils.
