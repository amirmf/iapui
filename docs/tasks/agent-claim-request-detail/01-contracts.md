# 01 — Contracts and translations

Source evidence: agent-claim-requests/hooks/use-get-agent-claim-request-by-id.ts; services/agent-claim-request-service.ts; data/agent-claim-request-service-schema.ts; claim-requests/data/claim-request-schema.ts; constants/claim-status-constant.ts; locales/fa.json.

Preserve GET /claim-request-registery-agent/claim-requests/{id}, claimRequestSchema; query ['agentClaimRequest', id], enabled ID, staleTime/gcTime 5000, AbortSignal. POST /claim-request-registery-agent/claim-requests/objections uses registeryAgentAddObjectionRequestSchema and claimRequestSchema response. Payload claimRequestId, description, attachments, claimRequestStatus IN_ASSESSMENT. Retain accepted strict outgoing transport objects and shared api-types ownership.

Review mounted nested document, attachment, objection schemas. Compare all mounted translation values from source, including agent.claimRequests.detail.*, agent.claimRequests.messages.*, myiap.claimRequest.messages.*, common.loading/notAvailable and errors.general.*. Preserve status map order, keys and colors; avoid duplicate domain maps. Document differences without inventing translations.

Acceptance: request method/path/body, schema and locale evidence tested. Status: implemented; verification recorded below.

Verified evidence: 11 service tests cover GET cancellation, nested nullish fields, document/attachment loose metadata, top-level stripping, invalid objection roles, POST method/path/body and response rejection. Outgoing objection requests now reject unknown fields as required by the existing architecture; this intentionally differs from source .loose(). Domain schema names and field acceptance otherwise reused. Agent status constants re-export the canonical claim-requests maps through its public API, preserving order/keys/colors rather than duplicating maps. 24 exact source locale values are captured in reference-translations.fixture.json and tested; the two missing myiap validation values were copied from fa.json.
