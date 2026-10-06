# 03 — State Stores and Feature Provider

Status: Completed

## Reference Source
- Main context/store: `insurance-ui/src/features/ai-assessment-rules/context/ai-assessment-rule-context.tsx`
- Automation levels store: `insurance-ui/src/features/ai-assessment-rules/context/ai-assessment-rule-automation-levels-table-store.ts`
- Details table store: `insurance-ui/src/features/ai-assessment-rules/context/ai-assessment-rule-details-table-store.ts`

## Target Destination
- `apps/iap-admin/src/features/ai-assessment-rules/context/store/ai-assessment-rule-store.ts`
- `apps/iap-admin/src/features/ai-assessment-rules/context/store/ai-assessment-rule-automation-levels-table-store.ts`
- `apps/iap-admin/src/features/ai-assessment-rules/context/store/ai-assessment-rule-details-table-store.ts`
- `apps/iap-admin/src/features/ai-assessment-rules/context/provider/ai-assessment-rule-provider.tsx`

## Architecture Requirements
Following `docs/architecture/APPLICATION-ARCHITECTURE.md`:
- Feature client state belongs under `context/store/` (Zustand) and `context/provider/` (React provider wrappers).
- Client state is purely for UI coordination (active open dialog, row selection state, active sub-item being edited). Server state remains in TanStack Query.

## Implementation Details
1. **Main Store (`ai-assessment-rule-store.ts`)**:
   - `open`: `'create' | 'edit' | 'delete' | 'bulkDelete' | null`
   - `currentRow`: `AiAssessmentRule | null`
   - `rowSelection`: `RowSelectionState` (table selection map)
   - Actions: `setOpen`, `setCurrentRow`, `setRowSelection`, `reset`
2. **Sub-Table Stores**:
   - `ai-assessment-rule-automation-levels-table-store.ts`:
     - `open`: `'create' | 'edit' | 'delete' | null`
     - `currentAutomationLevel`: `AiAssessmentRuleAutomationLevelItem | null`
     - Actions: `setOpen`, `setCurrentAutomationLevel`, `reset`
   - `ai-assessment-rule-details-table-store.ts`:
     - `open`: `'create' | 'edit' | 'delete' | null`
     - `currentDetail`: `AiAssessmentRuleDetail | null`
     - Actions: `setOpen`, `setCurrentDetail`, `reset`
3. **Feature Provider (`ai-assessment-rule-provider.tsx`)**:
   - Automatically resets store on unmount to prevent state leakage.
   - Exports `useAiAssessmentRule` selector hook.

## Verification Criteria
- Unit tests verifying store initial state, setter actions, and reset behavior.
