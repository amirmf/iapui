# 01 — Contracts and transport

Source: `src/features/agent-users/data/agent-signup-schema.ts`, `services/agent-user-service.ts`, `src/features/auth/data/auth-schema.ts:9`, `src/utils/utils.ts:196` in insurance-ui.

- Export agentSignupRequestSchema, agentSignupResponseSchema, AgentSignupRequest from `@iap/api-types` domain directory `agent-user`.
- Request: phoneNumber trimmed and matched against `/^(\+989\d{9}|09\d{9})$/`; nationalCode trimmed with minimum 1; password unchanged, length 6–255, nonblank after trim; nationalityType enum IR/FOREIGN defaults IR. Unknown keys are stripped (explicit user decision).
- Response: z.undefined(); service normalizes only empty string to undefined. Null, objects and other values reject.
- Preserve agentUserService.signup; POST `/claim-request-registery-agent/users`, parsed JSON body, no query params. Use getApiClient public transport.
- Form contract createAgentSignupFormSchema remains feature-owned; copy every translated validation rule and superRefine confirmPassword issue. Form types inferred from schemas.
- Acceptance: focused invalid cases, defaults, stripping, exact path/body and response normalization tests.

Status: complete. Verified by focused integration tests, typecheck, lint and architecture check; see 04-verification.md.

Historical verification: superseded for parity claims by [the second closure audit](../agent-users-create-re-audit/README.md).
