# Agent user signup implementation

Source: insurance-ui `src/routes/agent/users/create.tsx`, then `src/features/agent-users/pages/agent-user-signup-page.tsx`. Scope is one `/agent/users/create` page, no child pages. Preserve component names AgentUserSignupPage and AgentUserSignupForm. Target single-page owner: `features/agent-users/`, with components, model, queries, services, constants and a public index. Route remains under `_agent` with crumb `agentUserSignup`.

## Tasks and dependencies

1. [Contracts and transport](01-contracts.md): independent of locale extraction.
2. [Translations and enum audit](02-translations.md): independent of transport.
3. [Page and form](03-components.md): depends on 1 and 2.
4. [Verification](04-verification.md): depends on all implementation tasks.

Status: implementation complete; source inspection and focused integration verification passed. All evidence is from local source, not assumed backend behavior. User approved reference stripping of unknown request properties instead of strict requests on 2026-10-11, scoped to this endpoint.

Historical verification: superseded for parity claims by [the second closure audit](../agent-users-create-re-audit/README.md).
