# TASK-01: API Contracts and Schemas

## Objective
Define the backend data contracts for Sub-Users in `@iap/api-types` using strict Zod schemas and inferred TypeScript types.

## Reference Source
- `insurance-ui/src/features/sub-users/data/sub-user-schema.ts`
- `insurance-ui/openapidoc.json` (`/api/auth/sub-users/**`, `/api/claim-requests/assignments/release`)

## Implementation Target
- New package domain: `packages/api-types/src/sub-user/`
  - `packages/api-types/src/sub-user/index.ts`
- Export from `packages/api-types/src/index.ts`

## Detailed Specifications

### 1. Sub-User Roles (`subUserRoleSchema`)
```ts
export const subUserRoleSchema = z.enum([
  'ROLE_REQUEST_REGISTERY_AGENT',
  'ROLE_ASSESSMENT_USER',
  'ROLE_DOCTOR_USER',
])
export type SubUserRole = z.infer<typeof subUserRoleSchema>
```

### 2. Entity Schema & Types (`subUserSchema`)
```ts
export const subUserPartyDtoSchema = z
  .object({
    id: z.uuid().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
    createdBy: z.string().nullable().optional(),
    updatedBy: z.string().nullable().optional(),
    identifier: z.string().nullable().optional(),
    extId: z.string().nullable().optional(),
    partyType: z.string().nullable().optional(),
    fullName: z.string().nullable().optional(),
    fname: z.string().nullable().optional(),
    lname: z.string().nullable().optional(),
    userAccountId: z.string().nullable().optional(),
    displayName: z.string().nullable().optional(),
    mobileNumber: z.string().nullable().optional(),
  })
  .loose()

export const subUserSchema = z
  .object({
    id: z.uuid(),
    username: z.string(),
    email: z.string().nullable().optional(),
    displayName: z.string().nullable().optional(),
    mobileNumber: z.string().nullable().optional(),
    parentUserAccountId: z.uuid().nullable().optional(),
    roles: z.array(z.string()).optional(),
    docTypeCodes: z.array(z.string()).optional(),
    branchLocations: z.array(branchLocationSchema).nullable().optional(),
    hasAccessToAllBranch: z.boolean().nullable().optional(),
    enabled: z.boolean().optional(),
    accountNonExpired: z.boolean().optional(),
    extContractId: z.number().nullable().optional(),
    credentialsNonExpired: z.boolean().optional(),
    accountNonLocked: z.boolean().optional(),
    isPasswordChangeForced: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
    createdBy: z.string().nullable().optional(),
    updatedBy: z.string().nullable().optional(),
    party: subUserPartyDtoSchema.nullable().optional(),
  })
  .loose()

export type SubUser = z.infer<typeof subUserSchema>
export const subUserListSchema = z.array(subUserSchema)
```

### 3. Page Schema & Page Request (`pageSubUserSchema`)
```ts
export const pageSubUserSchema = createPageResponseSchema(subUserSchema)
export type PageSubUser = z.infer<typeof pageSubUserSchema>

export const subUserPageRequestSchema = createPageRequestSchema()
export type SubUserPageRequest = z.infer<typeof subUserPageRequestSchema>
```

### 4. Assignment Release Schemas
```ts
export const releaseAssignmentsPayloadSchema = z.object({
  userId: z.string(),
})
export type ReleaseAssignmentsPayload = z.infer<typeof releaseAssignmentsPayloadSchema>

export const releaseAssignmentsResponseSchema = z.record(z.string(), z.number())
export type ReleaseAssignmentsResponse = z.infer<typeof releaseAssignmentsResponseSchema>
```

## Acceptance Criteria
- [ ] Strictly matches OpenAPI operations and reference schemas.
- [ ] All types inferred via `z.infer`.
- [ ] Exported via `packages/api-types/src/index.ts`.
- [ ] Typecheck passes without errors.
