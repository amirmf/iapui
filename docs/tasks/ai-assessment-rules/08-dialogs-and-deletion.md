# 08 — Deletion Dialogs

Status: Completed

## Reference Source
- Single Delete: `insurance-ui/src/features/ai-assessment-rules/components/ai-assessment-rule-delete-dialog.tsx`
- Bulk Delete: `insurance-ui/src/features/ai-assessment-rules/components/ai-assessment-rule-bulk-delete-dialog.tsx`

## Target Destination
- `apps/iap-admin/src/features/ai-assessment-rules/components/ai-assessment-rule-delete-dialog.tsx`
- `apps/iap-admin/src/features/ai-assessment-rules/components/ai-assessment-rule-bulk-delete-dialog.tsx`

## Component Specifications
1. **AiAssessmentRuleDeleteDialog**:
   - Uses `@iap/dialogs` `ConfirmDialog`
   - Binds to `open === 'delete'` in `useAiAssessmentRule`
   - Calls `useDeleteAiAssessmentRuleMutation`
   - On success: resets row selection, clears current row, closes dialog
   - Localized title (`aiAssessmentRules.delete.title`) and description interpolation (`aiAssessmentRules.delete.description`)
2. **AiAssessmentRuleBulkDeleteDialog**:
   - Uses `@iap/dialogs` `ConfirmDialog`
   - Binds to `open === 'bulkDelete'` in `useAiAssessmentRule`
   - Calls `useBulkDeleteAiAssessmentRulesMutation` with `selectedIds`
   - On success: resets row selection, closes dialog
   - Localized title (`aiAssessmentRules.bulkDelete.title`) and description interpolation (`aiAssessmentRules.bulkDelete.description`, `{ count: ids.length }`)

## Verification Criteria
- Unit tests verifying open/close states, delete mutation calls, and post-delete selection resets.
