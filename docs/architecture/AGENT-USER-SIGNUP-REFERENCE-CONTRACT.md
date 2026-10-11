# Agent user signup reference contract

On 2026-10-11 the user explicitly selected full reference behavior for unknown request keys: agentSignupRequestSchema strips additional properties. This is a scoped exception to strict outgoing request objects for POST `/claim-request-registery-agent/users` only. All field rules, defaults, schemas and empty-response handling remain source-backed. Other endpoint contracts retain the application architecture policy. Contracts belong in @iap/api-types, form validation in the owning feature, and transport in services.
