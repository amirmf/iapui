# 03 — Result, chat and objection form

Source: agent-claim-request-detail-result.tsx, agent-claim-request-objection-form.tsx; components/objection-chat/index.tsx and objection-chat-card.tsx; my-iap/claim-requests/data/my-claim-request-objection-schema.ts.

Port AgentClaimRequestDetailResult and AgentClaimRequestObjectionForm. Display comma-separated resultReasons and oldest-first ObjectionChat. Avoid mutating query cache when sorting. Form only with claim ID and RETURN, or IN_ASSESSMENT without assignedUserUsername; latter uses submitCompleteDoc. Preserve uploader first, description textarea rows=5 second; trim required description and nonempty attachment array with source myiap validation keys. Form defaults empty text/attachments; disable submit while mutation/upload pending, description while mutation pending. Upload remains source enabled.

Success sequence: await ['agentClaimRequests'] invalidation, await detail refetch, set ['agentClaimRequest', claim.id] to response, success toast, reset form. Failure retains input and uses global mutation error handler. Missing ID toast then validation_failed. Reuse verified public chat/file capabilities, preserve nested attachments and scroll behavior.

Acceptance: eligibility matrix, invalid fields, payload, pending states and success/failure sequencing tested. Status: implemented; verification recorded below.

Verified evidence: eight result tests cover eligibility, comma-joined reasons, oldest-first chat and immutable cached objections. Five form tests cover shared validation errors, trimmed request payload, awaited invalidation/refetch/cache/toast/reset order, transport failure retaining input, upload gating and missing ID. Existing ObjectionChat/card was inspected against source and exported through the owning feature public API. Form schema remains page-owned; mutation moved to pages/detail/queries. FileUploader reused via the public modules/files API.
