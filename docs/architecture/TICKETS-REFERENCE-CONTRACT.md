# Tickets reference contract exception

The user explicitly selected exact reference schema acceptance on 2026-10-07. This exception is limited to support-ticket contracts exported from `@iap/api-types` and consumed by the tickets feature. It does not alter common page factories or other domain request contracts.

Contract owner: `packages/api-types/src/tickets/index.ts`, exported through the public `@iap/api-types` entry point.

Source: `/home/sadegh/Android/project/insurance-ui/src/features/tickets/data/ticket-schema.ts`.

Support-ticket requests strip unknown object properties; list filters are required; page and size are optional signed integers without positive/nonnegative restrictions. Ticket/message page responses accept missing or null content and retain unknown properties. Preserve nested enum, UUID, null/undefined, and body length validation exactly as the source.

The schemas remain in the focused API contract package and services validate requests/responses at the boundary. The later Support parity decision in [SUPPORT-REFERENCE-CONTRACT.md](SUPPORT-REFERENCE-CONTRACT.md) governs My-IAP request schemas; they now preserve the inspected source request semantics. Nullish response content is workspace-wide guidance; other ticket-specific rules remain scoped. Shared ticket responses use the source-compatible acceptance, widening nullable content acceptance for their existing consumers.
