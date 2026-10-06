# TASK-01: API Contracts and Schemas

## Objective
Define the backend data contracts for Assignment Rules in `@iap/api-types` using strict Zod v4 schemas and inferred TypeScript types.

## Reference Source
- `insurance-ui/src/features/assignement-rules/data/assignement-rule-schema.ts`
- `insurance-ui/openapidoc.json` (`AssignementRuleDto`, `PageAssignementRuleDto`, `/api/assignement-rules/**`)

## Implementation Target
- New domain directory: `packages/api-types/src/assignement-rule/`
  - `packages/api-types/src/assignement-rule/index.ts`
- Export from `packages/api-types/src/index.ts`

## Detailed Contract Specifications

### 1. Status Schema & Type
```ts
export const assignementRuleStatusSchema = z.enum(['ACTIVE', 'INACTIVE'])
export type AssignementRuleStatus = z.infer<typeof assignementRuleStatusSchema>
```

### 2. Entity Schema & Type (`assignementRuleSchema`)
```ts
export const assignementRuleSchema = z
  .object({
    id: z.uuid().nullish(),
    title: z.string().nullish(),
    docTypeCode: z.string().nullish(),
    extPolicyId: z.number().int().nullish(),
    extContractId: z.number().int().nullish(),
    extWorkUnitCode: z.number().int().nullish(),
    mainAssignedUserUsername: z.string().nullish(),
    amountMin: z.number().nullish(),
    amountMax: z.number().nullish(),
    amountApprovedMin: z.number().nullish(),
    amountApprovedMax: z.number().nullish(),
    status: assignementRuleStatusSchema.nullish(),
    fromDate: z.string().nullish(),
    thruDate: z.string().nullish(),
    createdAt: z.string().nullish(),
    updatedAt: z.string().nullish(),
    createdBy: z.string().nullish(),
    updatedBy: z.string().nullish(),
  })
  .loose()

export type AssignementRule = z.infer<typeof assignementRuleSchema>
```

### 3. Page Response Schema (`pageAssignementRuleSchema`)
Compose using shared `createPageResponseSchema`:
```ts
export const pageAssignementRuleSchema = createPageResponseSchema(assignementRuleSchema)
export type PageAssignementRule = z.infer<typeof pageAssignementRuleSchema>
```

### 4. Page Request Schema (`assignementRulePageRequestSchema`)
Compose using shared `createPageRequestSchema`:
```ts
export const assignementRulePageRequestSchema = createPageRequestSchema()
export type AssignementRulePageRequest = z.infer<typeof assignementRulePageRequestSchema>
```

### 5. Mutation Request Schemas
- **Create / Update Request:**
```ts
export const assignementRuleRequestSchema = z.object({
  title: z.string().trim().min(1),
  docTypeCode: z.string().trim().optional(),
  extPolicyId: z.number().int().optional(),
  extContractId: z.number().int().optional(),
  extWorkUnitCode: z.number().int().optional(),
  mainAssignedUserUsername: z.string().trim().optional(),
  amountMin: z.number().optional(),
  amountMax: z.number().optional(),
  amountApprovedMin: z.number().optional(),
  amountApprovedMax: z.number().optional(),
  status: assignementRuleStatusSchema,
  fromDate: z.date().nullish(),
  thruDate: z.date().nullish(),
})
export type AssignementRuleRequest = z.infer<typeof assignementRuleRequestSchema>
```

- **Delete / Bulk Delete:**
```ts
export const assignementRuleIdsSchema = z.array(z.uuid()).min(1)
export const bulkDeleteAssignementRulesRequestSchema = assignementRuleIdsSchema
```

## Acceptance Criteria
- [ ] Zod v4 public APIs only (`.nullish()`, `.loose()`, `z.uuid()`).
- [ ] No manual hand-crafted TypeScript types; all types inferred via `z.infer`.
- [ ] Exported via `packages/api-types/src/index.ts`.
- [ ] Passes `pnpm --filter @iap/api-types check-type` or root typecheck.
