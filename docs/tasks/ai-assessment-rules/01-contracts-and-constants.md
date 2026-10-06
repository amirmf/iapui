# 01 — Contracts and Constants

Status: Completed

## Reference Source
- Schemas: `insurance-ui/src/features/ai-assessment-rules/data/ai-assessment-rule-schema.ts`
- Constants: `insurance-ui/src/constants/ai-assessment-rule-constant.ts`

## Target Destination
- Schemas & Types: `packages/api-types/src/ai-assessment-rule/index.ts`, re-exported in `packages/api-types/src/index.ts`
- Constants & Option Helpers: `apps/iap-admin/src/features/ai-assessment-rules/constants/ai-assessment-rule-constant.ts`

## Contract Requirements
1. **Enum Schemas**:
   - `aiAssessmentRuleDefinitionTypeSchema`: `'GENERAL' | 'AGREEMENT_TEMPLATE' | 'CONTRACT' | 'POLICY'`
   - `aiAssessmentRuleModelSchema`: `'NONE' | 'KAVAN_VISION_SMALL' | 'KAVAN_VISION_BIG' | 'KAVAN_TEXT_SMALL' | 'KAVAN_TEXT_BIG' | 'KAVAN_MEDICAL_SMALL' | 'KAVAN_MEDICAL_BIG'`
   - `aiAssessmentRuleStatusSchema`: `'ACTIVE' | 'INACTIVE'`
   - `aiAssessmentRuleStateSchema`: `'CORE' | 'DUPLICATION' | 'IMAGE' | 'DOCS_VALIDATION' | 'CODE_DETECTION' | 'EXTRACTION' | 'HELP' | 'INFORMATION' | 'CALCULATION' | 'CALCULATION_VALIDATION' | 'AUTO_APPROVE' | 'ELIGIBLE'`
   - `aiAssessmentRuleAutomationLevelSchema`: `'HINT' | 'FULL_AUTO' | 'REQUIRE_APPROVE'`
   - `aiAssessmentRuleSkipRuleSchema`: `'SKIP'`
2. **Sub-Item Schemas**:
   - `aiAssessmentRuleAutomationLevelResponseSchema`: `automationLevel`, `minThreshold`, `maxThreshold` (all nullable/optional)
   - `automationLevelSchema`: input structure for level creation/update
   - `aiAssessmentRuleDetailSchema`: `id`, `prompt`, `methodNames`, `inputParams`, `docType` (`docTypeSchema`), `minThreshold`, `maxThreshold`
3. **Entity & Page Schemas**:
   - `aiAssessmentRuleSchema`: Full rule object with `docTypes`, `automationLevels`, `ruleDetails`, timestamps, user metadata
   - `pageAiAssessmentRuleSchema`: Page response with `content`, `totalElements`, `totalPages`, `size`, `number`, `first`, `last`, `numberOfElements`, `empty`
4. **Request Schemas**:
   - `listAiAssessmentRulesRequestSchema`: pagination (`page: 0`, `size: 30`), `sort`, `direction: 'ASC' | 'DESC'`, `filters`
   - `getAiAssessmentRuleRequestSchema`: `{ id: z.string().min(1) }`
   - `bulkDeleteAiAssessmentRulesRequestSchema`: `z.array(z.string().min(1)).min(1)`
   - `createAiAssessmentRuleRequestSchema`: complete payload for create/update
   - `updateAiAssessmentRuleRequestSchema`: `{ id: string, data: CreateAiAssessmentRuleRequest }`
   - `emptyAiAssessmentRuleActionResponseSchema`: for actions returning empty response

## Constants & Option Helpers
- `AI_ASSESSMENT_RULE_DEFINITION_TYPE_TRANSLATION_KEYS`
- `AI_ASSESSMENT_RULE_MODEL_TRANSLATION_KEYS`
- `AI_ASSESSMENT_RULE_STATUS_TRANSLATION_KEYS`
- `AI_ASSESSMENT_RULE_STATUS_COLORS`
- `AI_ASSESSMENT_RULE_STATE_TRANSLATION_KEYS`
- `AI_ASSESSMENT_RULE_AUTOMATION_LEVEL_TRANSLATION_KEYS`
- `AI_ASSESSMENT_RULE_SKIP_RULE_TRANSLATION_KEYS`
- Option helper functions: `getAiAssessmentRuleDefinitionTypeOptions`, `getAiAssessmentRuleModelOptions`, `getAiAssessmentRuleStatusOptions`, `getAiAssessmentRuleStateOptions`, `getAiAssessmentRuleAutomationLevelOptions` taking translation function `t`.

## Verification Criteria
- Unit tests validating schema parsing, optional/nullable handling, and enum values.
- Contract test verifying matching options and translation keys.
