# Workspace nullish page content

## Accepted decision

On 2026-10-07, the user required all paginated response `content` fields to
accept missing values and `null` with Zod `.nullish()`. This replaces the
previous optional-only rule and overrides source-specific null rejection.
Request pagination and validation of present array items remain unchanged.

## Implementation

- Updated the common page factory and every independently declared page content
  field in `packages/api-types`.
- Existing UI consumers use nullish fallbacks or optional chaining. Updated two
  AI assessment rule tests to safely access nullish content.
- Updated architecture and reference-parity skill guidance.
- Applied the approved exception explicitly to the source test oracle before
  nested Support flow contracts are composed.

## Verification

- 44 workspace content tests cover 43 exported page schemas: missing, null,
  empty array, invalid scalar/object, and invalid null item.
- 52 focused Support and AI assessment rule contract/service tests passed.
- Both applications, Support and API types passed TypeScript checks.
- Architecture and whitespace checks passed.
- Broad API-types lint reports two existing explicit-any violations at line 5
  of `ai-assessment-rule/index.ts`, outside this change.
