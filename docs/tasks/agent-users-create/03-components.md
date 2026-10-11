# 03 — Page and form components

Source: insurance-ui `features/agent-users/pages/agent-user-signup-page.tsx`, `components/agent-user-signup-form.tsx` and mounted `components/ui/{card,input,tabs,form,button}.tsx`.

- AgentUserSignupPage: main container mx-auto w-full max-w-xl pb-5; Card header agent.users.title/description; CardContent mounts AgentUserSignupForm.
- AgentUserSignupForm: memoized translated schema, complete empty defaults with nationality IR, noValidate, space-y-6. Submit mapped four-field request, never confirmPassword. Mutation pending disables submit only; success resets defaults then success toast agent.users.messages.created. Failure preserves values; global error handler. No navigation or cache invalidation.
- Extract AgentUserNationalityField: FormField/Tabs, validated enum change, RTL grid of two tabs, source active classes and agent.users.nationality keys. Keep selector value when switching; do not reset national code.
- Extract AgentUserIdentityFields: phone then nationalCode. Subscribe to nationality locally with useWatch; phone tel/LTR autocomplete tel and source placeholder; nationalCode LTR autocomplete off. Both required markers. Use TextField, not PhoneField/NationalCodeField because those could introduce unverified normalization/validation.
- Extract AgentUserPasswordFields: password then confirmPassword, type password, new-password autocomplete, passwordHint under password only; required markers.
- Mutation hook in queries; schemas in model; no store/provider beyond shared Form. Small components with body prop destructuring. Shared public imports and cn for conditional classes.
- Thin existing route imports public AgentUserSignupPage and retains crumb and partition. No child routes.

Acceptance: actual form field order, default tab, switched label, trimmed payload, pending, failed submit, successful reset, source translated errors.

Status: complete. Verified by focused integration tests, typecheck, lint and architecture check; see 04-verification.md.

Historical verification: superseded for parity claims by [the second closure audit](../agent-users-create-re-audit/README.md).
