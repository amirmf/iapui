# 02 — Service, Queries, and Route Adapters

Status: Completed

## Reference Source
- Service: `insurance-ui/src/features/ai-assessment-rules/services/ai-assessment-rule-service.ts`
- Hooks: `insurance-ui/src/features/ai-assessment-rules/hooks/use-ai-assessment-rules.ts`
- Table Search Sync: `insurance-ui/src/components/data-table/filter/use-sync-query-params-table-filter.ts`

## Target Destination
- Service: `apps/iap-admin/src/features/ai-assessment-rules/services/ai-assessment-rule-service.ts`
- Query Hooks: `apps/iap-admin/src/features/ai-assessment-rules/queries/use-ai-assessment-rules.ts`
- Route Adapters: `apps/iap-admin/src/features/ai-assessment-rules/route-adapters/table-search.ts` & `route-search-schema.ts`

## Implementation Details
1. **API Service (`ai-assessment-rule-service.ts`)**:
   - Uses `getApiClient()` from `@iap/api-client`
   - `list(request, signal)`: calls `GET /ai-assessment-rules/page-full` with pagination and `transformApiFilterParams`
   - `getById(id, signal)`: calls `GET /ai-assessment-rules/${id}`
   - `create(request)`: calls `POST /ai-assessment-rules`
   - `update(request)`: calls `PUT /ai-assessment-rules/${id}` with payload
   - `delete(id)`: calls `DELETE /ai-assessment-rules/${id}`
   - `bulkDelete(ids)`: calls `DELETE /ai-assessment-rules/bulk-delete` with `{ data: ids }`
2. **React Query Hooks (`use-ai-assessment-rules.ts`)**:
   - Centralized `aiAssessmentRuleQueryKeys` query key factory (`all`, `lists`, `list`, `details`, `detail`)
   - `useAiAssessmentRulesQuery(request)` with filter normalization and placeholder data
   - `useAiAssessmentRuleQuery(id)` with `enabled: Boolean(id)`
   - Mutation hooks:
     - `useCreateAiAssessmentRuleMutation`
     - `useUpdateAiAssessmentRuleMutation`
     - `useDeleteAiAssessmentRuleMutation`
     - `useBulkDeleteAiAssessmentRulesMutation`
   - Mutation success invalidates `aiAssessmentRuleQueryKeys.all` and calls optional callback
3. **Route Adapters (`route-adapters/`)**:
   - `route-search-schema.ts`: TanStack Router `validateSearch` schema for query parameters (`agreementTemplateCode`, `extContractId`, `extPolicyId`, `definitionType`, `docTypes.docTypeCode`, `ruleState`, `status`, `page`, `size`, `sort`, `direction`).
   - `table-search.ts`: parsers and serializers between URL search params and query request filters.

## Verification Criteria
- Unit tests for service request formatting, payload serialization, and mock response parsing.
- Query key consistency tests and URL search parser/serializer tests.
