# Agent claim detail reference contract

## Scope and evidence

This records the completed standalone iap-admin
`/agent/claim-requests/$claimRequestId/` port from insurance-ui's
`AgentClaimRequestsDetailPage`. It does not change management or creation
journeys. See [the recursive audit](../tasks/agent-claim-request-detail-re-audit/README.md)
for source paths, component inventory and verification limits.

## Ownership and state

The flat dynamic route composes the public feature page and returns
`crumb: 'claimDetails'`. Page components, form schema and query/mutation hooks
belong under `features/agent-claim-requests/pages/detail/`. Transport and shared
backend contracts remain in services and `@iap/api-types`; files use the public
module/package API. Status translation maps/colors are re-exported from the
canonical claim-requests feature API.

The detail query uses `['agentClaimRequest', id]`, an ID guard, AbortSignal and
5000 ms stale/gc lifetimes. It does not introduce route prefetch. The source
form appears for RETURN or IN_ASSESSMENT without an assigned username, when
an ID exists. Description is trimmed and required; attachments are nonempty.
Submission posts IN_ASSESSMENT and awaits list invalidation, detail refetch,
updated cache, success feedback and form reset in source order. Server state
remains in Query; sorting copies arrays before mutation.

## Schema decision

The explicitly requested source contract keeps
`registeryAgentAddObjectionRequestSchema` in loose object mode, retaining
unknown properties for this endpoint only. Other strict-request rules remain
unchanged. Claim document extractedData and expert_info_addon retain source
`z.record(z.string(), z.any())` contracts. `.nullish()` modernizes equivalent
nullable/optional response fields. The shared status schemas remain exported
as Zod enums; the source translation factories are a documented representation
difference, with identical mounted response enum values and untranslated
validation. Do not generalize this exception to unrelated endpoints.

## Presentation integration

- TextareaField forwards reference presentation to Textarea and FormMessage.
  The detail form also opts its attachment message into reference semantics.
- Mutation metadata selects the existing reference error presentation;
  feature code does not duplicate global error toasts.
- ObjectionChat/Card expose optional reference presentation for source
  invalid-date throwing; defaults keep existing consumers. Dates pass the
  host language and non-normalized input to the Tehran formatter.
- Each files image-toolbar Tooltip has its own zero-delay TooltipProvider,
  matching source and allowing use without an application-wide provider.
- The detail route scopes host horizontal padding and page spacing. Its CSS
  preserves the actual source Vazir fallback, mobile 14px fields, and bare
  border/outline defaults. Explicit control/status border colors still win.
  Source font aliases are not silently corrected to the registered Vazirmatn
  family while claiming visual parity. Other pages keep their existing host.

## Verification limits

Source/unit verification, actual primitive integration tests, lint, architecture
checks and production compilation passed. Authenticated browser screenshot
comparison and live-backend submission were not performed.
