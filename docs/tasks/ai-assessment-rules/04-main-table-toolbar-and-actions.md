# 04 — Main Table Actions, Toolbar, and Columns

Status: Completed

## Reference Source
- Table Actions: `insurance-ui/src/features/ai-assessment-rules/components/ai-assessment-rules-table-actions.tsx`
- Filter Toolbar: `insurance-ui/src/features/ai-assessment-rules/components/ai-assessment-rules-data-table-toolbar.tsx`
- Columns: `insurance-ui/src/features/ai-assessment-rules/components/ai-assessment-rule-columns.tsx`
- Row Actions: `insurance-ui/src/features/ai-assessment-rules/components/ai-assessment-rule-row-actions.tsx`

## Target Destination
- `apps/iap-admin/src/features/ai-assessment-rules/components/ai-assessment-rules-table-actions.tsx`
- `apps/iap-admin/src/features/ai-assessment-rules/components/ai-assessment-rules-data-table-toolbar.tsx`
- `apps/iap-admin/src/features/ai-assessment-rules/components/ai-assessment-rule-columns.tsx`
- `apps/iap-admin/src/features/ai-assessment-rules/components/ai-assessment-rule-row-actions.tsx`

## Component Specifications
1. **AiAssessmentRulesTableActions**:
   - Header actions bar containing:
     - `bulkDelete` button (variant `destructive`, disabled when `!hasSelection`, opens `'bulkDelete'` dialog)
     - `refresh` button (variant `outline`, disabled when `isRefreshing`, shows spinning icon when refreshing)
     - `create` button (primary, resets `currentRow` to null and opens `'create'` dialog)
2. **AiAssessmentRulesDataTableToolbar**:
   - Uses `TableFilterQueryParams` from `@shared/tables`
   - Text filters:
     - `agreementTemplateCode` (placeholder `aiAssessmentRules.fields.agreementTemplateCode`)
     - `extContractId` (placeholder `aiAssessmentRules.fields.extContractId`, `numerical: true`)
     - `extPolicyId` (placeholder `aiAssessmentRules.fields.extPolicyId`, `numerical: true`)
   - Faceted filters:
     - `definitionType` (options from `getAiAssessmentRuleDefinitionTypeOptions(t)`)
     - `docTypes.docTypeCode` (options from `useDocTypesData.optionsCode()`)
     - `ruleState` (options from `getAiAssessmentRuleStateOptions(t)`)
     - `status` (options from `getAiAssessmentRuleStatusOptions(t)`)
3. **useAiAssessmentRuleColumns**:
   - `definitionType`: `TwoLineHeader` (`definitionType` / `extContractId`), `TwoLineCell` with font-mono secondary
   - `agreementTemplateCode`: `TwoLineHeader` (`agreementTemplateCode` / `extPolicyId`), `TwoLineCell` with font-mono secondary
   - `docTypes`: `TwoLineHeader` (`docTypes` / `ruleState`), `AiAssessmentRuleDocTypesCell` with badge tooltips and secondary rule state
   - `status`: `TwoLineHeader` (`status`), badge with exact status colors from `AI_ASSESSMENT_RULE_STATUS_COLORS`
   - `actions`: `AiAssessmentRuleRowActions` (edit, delete)
4. **AiAssessmentRuleRowActions**:
   - Table action buttons with tooltips for `edit` and `delete` setting current row and opening respective dialog.

## Verification Criteria
- Component unit tests for columns, action callbacks, and toolbar filter definitions.
