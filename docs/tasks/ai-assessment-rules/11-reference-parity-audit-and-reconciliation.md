# Task 11: Reference Parity Audit and Reconciliation

Detailed component-by-component comparison between target (`iap-admin`) and reference (`insurance-ui`).

## Component Comparison Matrix

| Component / File | Reference Path | Target Path | Status & Discrepancies |
| :--- | :--- | :--- | :--- |
| **Page Root** | `src/features/ai-assessment-rules/pages/ai-assessment-rules-page.tsx` | `src/features/ai-assessment-rules/ai-assessment-rules-page.tsx` | Export style alignment; verified layout, query, inspector, and table props match |
| **Route** | `src/routes/_authenticated/ai-assessment-rules/index.tsx` | `src/app/router/routes/_authenticated/ai-assessment-rules/index.tsx` | Crumb and component bindings identical; search validation preserved |
| **Table Actions** | `components/ai-assessment-rules-table-actions.tsx` | `components/ai-assessment-rules-table-actions.tsx` | Bulk delete, refresh icon animation, and create button identical |
| **Table Toolbar** | `components/ai-assessment-rules-data-table-toolbar.tsx` | `components/ai-assessment-rules-data-table-toolbar.tsx` | 3 text filters (`agreementTemplateCode`, `extContractId`, `extPolicyId`) + 4 faceted filters (`definitionType`, `docTypes.docTypeCode`, `ruleState`, `status`) match |
| **Columns** | `components/ai-assessment-rule-columns.tsx` | `components/ai-assessment-rule-columns.tsx` | Refactor `renderDocTypesCell` helper back into `AiAssessmentRuleDocTypesCell` sub-component to match reference component tree |
| **Row Actions** | `components/ai-assessment-rule-row-actions.tsx` | `components/ai-assessment-rule-row-actions.tsx` | Edit and Delete actions match reference |
| **Delete Dialog** | `components/ai-assessment-rule-delete-dialog.tsx` | `components/ai-assessment-rule-delete-dialog.tsx` | Title and description match; `ConfirmDialog` configured with `presentation='reference'` |
| **Bulk Delete Dialog** | `components/ai-assessment-rule-bulk-delete-dialog.tsx` | `components/ai-assessment-rule-bulk-delete-dialog.tsx` | Count interpolation and disabled condition match reference |
| **Rule Form Dialog** | `components/ai-assessment-rule-form-dialog/ai-assessment-rule-form-dialog.tsx` | `components/ai-assessment-rule-form-dialog/ai-assessment-rule-form-dialog.tsx` | Dialog title, open state, and form container match |
| **Rule Form** | `components/ai-assessment-rule-form-dialog/ai-assessment-rule-form.tsx` | `components/ai-assessment-rule-form-dialog/ai-assessment-rule-form.tsx` | Fix `AgreementField` placeholder key from `fields.*` to `placeholder.*`; match `defaults` and `toFormValues` |
| **Doc Types Field** | `components/ai-assessment-rule-form-dialog/ai-assessment-rule-doc-types-field.tsx` | `components/ai-assessment-rule-form-dialog/ai-assessment-rule-doc-types-field.tsx` | MultiSelect value mapping and optionsCode data binding match reference |
| **Inspector** | `components/ai-assessment-rule-inspector.tsx` | `components/ai-assessment-rule-inspector.tsx` | Inspect layout, ruleDetails section, and automationLevels section match |
| **Details Table Sub-components** | `components/ai-assessment-rule-details-table/*` | `components/ai-assessment-rule-details-table/*` | Match `SimpleDataTable` `presentation='reference'`; actions, form, delete dialog match |
| **Automation Levels Table Sub-components** | `components/ai-assessment-rule-automation-levels-table/*` | `components/ai-assessment-rule-automation-levels-table/*` | Match `SimpleDataTable` `presentation='reference'`; actions, form, delete dialog match |
| **Constants** | `src/constants/ai-assessment-rule-constant.ts` | `constants/ai-assessment-rule-constant.ts` | All enums, color maps, and translation key maps match byte-for-byte |
| **API Service** | `services/ai-assessment-rule-service.ts` | `services/ai-assessment-rule-service.ts` | All 6 endpoints and Zod parsing match reference |
| **Translations** | `src/locales/fa.json` (`aiAssessmentRules.*`) | `src/shared/i18n/locales/fa/common.json` | 0 missing keys, 100% byte-for-byte Persian translation parity |

## Action Items for Reconciliation

1. [x] **Audit translations**: Verified 0 differences between reference and target.
2. [x] **Update `ai-assessment-rule-columns.tsx`**: Change `renderDocTypesCell` helper function into `AiAssessmentRuleDocTypesCell` component to match reference structure.
3. [x] **Update `ai-assessment-rule-form.tsx`**: Correct `AgreementField` placeholder to use `aiAssessmentRules.placeholder.${agreementFieldName}` instead of `aiAssessmentRules.fields.${agreementFieldName}`.
4. [x] **Update `ai-assessment-rule-details-table/index.tsx` & `automation-levels-table/index.tsx`**: Ensure `presentation='reference'` is passed to `SimpleDataTable`.
5. [x] **Verification**: Run unit test suite, typecheck, lint, and build.
