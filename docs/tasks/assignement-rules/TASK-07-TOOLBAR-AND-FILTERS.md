# TASK-07: Table Toolbar and Filters

## Objective
Implement `AssignementRuleDataTableToolbar` using `@shared/tables`'s `TableFilterQueryParams`, integrating text filters, number-range filters, date-range filters, and faceted filters.

## Reference Source
- `insurance-ui/src/features/assignement-rules/components/assignement-rule-data-table-toolbar.tsx`

## Implementation Target
- `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-data-table-toolbar.tsx`
- Tests: `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-data-table-toolbar.test.tsx`

## Detailed Specifications

### 1. Document Type Options Source
Query doc types using `@modules/doc-types` `docTypeService`:
```ts
const docTypesQuery = useQuery({
  queryFn: ({ signal }) =>
    docTypeService.getPage({ page: 0, signal, size: 100 }),
  queryKey: ['doc-types', 'page', 0, 100],
  staleTime: Infinity,
})

const docTypeOptions = useMemo(
  () =>
    (docTypesQuery.data?.content ?? [])
      .filter(
        (item): item is typeof item & { docTypeCode: string } =>
          typeof item.docTypeCode === 'string'
      )
      .map((item) => ({
        label: item.docType ?? item.docTypeCode,
        value: item.docTypeCode,
      })),
  [docTypesQuery.data?.content]
)
```

### 2. Filters Configuration
Matching reference:

- **Text Filters (`textFilters`):**
  1. `title`: placeholder `t('assignementRules.fields.title')`, `asLike: true`
  2. `extPolicyId`: placeholder `t('assignementRules.fields.policyId')`, `numerical: true`
  3. `extContractId`: placeholder `t('assignementRules.fields.contractId')`, `numerical: true`
  4. `extWorkUnitCode`: placeholder `t('assignementRules.fields.workUnit')`, `numerical: true`
  5. `mainAssignedUserUsername`: placeholder `t('assignementRules.fields.assignee')`

- **Number Range Filters (`numberRangeFilters`):**
  Four range filters:
  1. `amountMin`: `numberWithComma: true`
  2. `amountMax`: `numberWithComma: true`
  3. `amountApprovedMin`: `numberWithComma: true`
  4. `amountApprovedMax`: `numberWithComma: true`
  Placeholders using `t('assignementRules.fields.' + id)`.

- **Date Range Filters (`dateRangeFilters`):**
  1. `fromDate`: placeholder `t('assignementRules.fields.fromDate')`
  2. `thruDate`: placeholder `t('assignementRules.fields.thruDate')`

- **Faceted Filters (`facetedFilters`):**
  1. `status`: title `t('assignementRules.fields.status')`, options from `getAssignementRuleStatusOptions(t)`.
  2. `docTypeCode`: title `t('assignementRules.fields.docTypeCode')`, options from `docTypeOptions`.

- **Default visible filter count:** `defaultVisibleFilterCount={13}`.

## 3. Unit Tests
- Verify toolbar mounts all text, number range, date range, and faceted filter configs.
- Verify doc type options are correctly loaded and mapped.
- Verify status filter options contain `ACTIVE` and `INACTIVE` with translated labels.

## Acceptance Criteria
- [ ] Complete filter set identical to reference project.
- [ ] Reuses `@shared/tables/filter` infrastructure.
- [ ] Responsive grid styling preserved.
