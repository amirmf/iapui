# 09 — Page Composition, Thin Route, and Translations

Status: Completed

## Reference Source
- Page: `insurance-ui/src/features/ai-assessment-rules/pages/ai-assessment-rules-page.tsx`
- Route: `insurance-ui/src/routes/_authenticated/ai-assessment-rules/index.tsx`
- Inspector: `insurance-ui/src/features/ai-assessment-rules/components/ai-assessment-rule-inspector.tsx`
- Translations: `insurance-ui/src/locales/fa.json` (`aiAssessmentRules.*`)

## Target Destination
- Page: `apps/iap-admin/src/features/ai-assessment-rules/ai-assessment-rules-page.tsx`
- Inspector: `apps/iap-admin/src/features/ai-assessment-rules/components/ai-assessment-rule-inspector.tsx`
- Route: `apps/iap-admin/src/app/router/routes/_authenticated/ai-assessment-rules/index.tsx`
- Translations: `apps/iap-admin/src/shared/i18n/locales/fa/common.json`

## Component Specifications
1. **AiAssessmentRulesPage**:
   - Wrapped by `AiAssessmentRuleProvider`
   - Responsive two-column grid layout:
     - Left column: Main table (`PaginatedDataTable`) with checkboxes, sorting, and pagination
     - Right column: `AiAssessmentRuleInspector`
   - Inspector displays empty state if no row is selected, or rule details + automation levels tables if a row is selected
   - Mounts form dialog, single delete dialog, and bulk delete dialog
2. **AiAssessmentRuleInspector**:
   - Section 1: `aiAssessmentRules.inspector.ruleDetails` -> `AiAssessmentRuleDetailsTable`
   - Section 2: `aiAssessmentRules.fields.automationLevels` -> `AiAssessmentRuleAutomationLevelsTable`
3. **Thin Route (`index.tsx`)**:
   - Replaces existing `PlaceholderPage`
   - Sets `component: AiAssessmentRulesPage`
   - Sets `loader: () => ({ crumb: 'ai-assessment-rules' })`
   - Sets `validateSearch: aiAssessmentRuleRouteSearchSchema`
4. **Translations**:
   - Add all `aiAssessmentRules` keys from reference `fa.json` to `apps/iap-admin/src/shared/i18n/locales/fa/common.json`.

## Verification Criteria
- Page integration test checking table render, inspector update on row selection, and dialog opening.
- Translation key completeness check ensuring no missing translations.
