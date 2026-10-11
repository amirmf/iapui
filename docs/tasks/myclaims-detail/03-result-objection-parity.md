# Result and objection component parity

Reference evidence: `insurance-ui/src/features/my-iap/claim-requests/components/my-claim-request-detailI-result.tsx`, `my-claim-request-objection-form.tsx`, `data/my-claim-request-objection-schema.ts`, `src/components/objection-chat/{index,objection-chat-card}.tsx`, and `src/features/files/components/{file-uploader,uploaded-file-preview-list,uploading-file-list}.tsx`.

The earlier target page omitted this entire mounted closure. Tasks completed:

- [x] Mount `MyClaimRequestDetailIResult`; preserve reason joining, reason heading, chronological objections, assessment-result Support action for RETURN/REJECTED, and form visibility for RETURN or unassigned IN_ASSESSMENT.
- [x] Port `ObjectionChat` and `ObjectionChatCard`: oldest-first ordering, scroll-to-bottom, ENDUSER alignment/colors, translated role captions, Tehran date formatting, and source classes. Clone cached objections before sorting to preserve immutable query state.
- [x] Port `MyClaimRequestObjectionForm`: hidden description defaults to `-`, translated required attachment validation, upload state disables actions, source completion-document detection and button, direct completion mutation bypasses regular attachment validation.
- [x] Preserve mutation ordering: await list invalidation, await detail refetch, write returned claim to `['myClaimRequest', id]`, success toast, reset form.
- [x] Preserve `submitObjection` endpoint `POST /my/iap/claim-requests/objections` and fields `claimRequestId`, `description`, `attachments` defaulting to `[]`, optional `claimRequestStatus`; parse response with `claimRequestSchema`. Architecture-required outgoing schema lives in `@iap/api-types`.
- [x] Replace divergent uploader with source-backed `FileUploader`, `UploadedFilePreviewList`, and `UploadingFileList` in feature-level components because create and detail share them. Preserve content-header validation, HEIC conversion, individual progress/failures, partial successful uploads, thumbnail grid, deletion, and object-URL cleanup.

Verification: 9 focused result-branch/service/form-schema tests passed. `pnpm --dir apps/iap-app typecheck`, `pnpm --dir apps/iap-app lint`, and `git diff --check` passed during this task. Final aggregate checks are recorded by the parent audit. No screenshot or live backend verification is claimed here.
