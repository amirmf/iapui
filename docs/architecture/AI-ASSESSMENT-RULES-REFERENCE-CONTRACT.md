# AI Assessment Rules Reference Contract Decision

## Scope and Accepted Decision

On 2026-10-06 the user explicitly requested full parity implementation for the admin
`/_authenticated/ai-assessment-rules/` page matching `insurance-ui`, including exact API endpoints,
request/response schemas, component names, constants, and Persian translations.
Existing application architecture (`docs/architecture/APPLICATION-ARCHITECTURE.md`) continues to
govern ownership, import boundaries, thin routes, and monorepo structure.

## Architectural Boundaries

- **Route (`Thin Route`)**: `apps/iap-admin/src/app/router/routes/_authenticated/ai-assessment-rules/index.tsx`
  declares the route, breadcrumb metadata, search validation, and delegates directly to the page.
- **Page Composition**: `apps/iap-admin/src/features/ai-assessment-rules/ai-assessment-rules-page.tsx`
  coordinates main table layout, inspector panel, and dialogs.
- **Contract & Schemas**: Public domain schemas reside in `packages/api-types/src/ai-assessment-rule/`
  and are exported through the monorepo root `@iap/api-types`.
- **API Services**: `apps/iap-admin/src/features/ai-assessment-rules/services/ai-assessment-rule-service.ts`
  uses `createApiClient()` with feature-local Zod request/response parsing.
- **Inspector & Nested Sub-Tables**:
  The inspector houses two independent sub-tables (`ruleDetails` and `automationLevels`), each with its own
  table, row actions, add/edit form dialog, delete confirmation dialog, and local state synchronizers.
- **Formula & JSON Editor**:
  Formula/parameters editing uses `vanilla-jsoneditor` wrapped in a dedicated React component
  (`AiAssessmentRuleJsonEditor`) with dark/light theme support.
- **Translations**:
  100% byte-for-byte Persian translation parity with `insurance-ui/src/locales/fa.json` under
  `aiAssessmentRules.*` key in `apps/iap-admin/src/shared/i18n/locales/fa/common.json`.

## Guidance for Future Complex Parity Pages

When implementing future pages with inspector panels, sub-tables, or embedded editors:
1. Follow `.agents/skills/reference-page-parity/SKILL.md`.
2. Inspect the reference component tree first, breaking down large inspectors into dedicated sub-components
   with single responsibilities under `components/<sub-feature>/`.
3. Use `presentation='reference'` for `SimpleDataTable` and `PaginatedDataTable` when matching reference layout.
4. For dynamic translation lookups, cast dynamic template expressions (`as never`) to maintain strict typing
   with `useTranslate()` in `iap-admin`.
5. Keep sub-table mutations locally reactive in component state or dedicated Zustand stores before committing
   to the backend on form submission.
