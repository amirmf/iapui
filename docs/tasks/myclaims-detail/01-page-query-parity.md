# Page composition, query and locale parity

Priority: P1. Source: `insurance-ui/src/features/my-iap/claim-requests/pages/my-claim-request-detail-page.tsx`, `hooks/use-get-my-claim-request-by-id.ts`, `services/my-claim-request-service.ts`, and `components/my-claim-request-page-header.tsx`.

- [x] Restore the page's exact container/card/inner spacing and mounted component order; remove inline `DetailItem` and all invented fallback labels.
- [x] Restore `claimRequests.actions.viewDetails`, source loading markup, backend error extraction and `errors.general` fallback.
- [x] Preserve conditional attachments (`Array.isArray`, nonempty) and mount `FileViewer` after results.
- [x] Preserve `MyClaimRequestPageHeader` and back button presentation; apply the approved customer `/myclaims/` URL adaptation.
- [x] Retain the `['myClaimRequest', id]` key, enabled condition, cancellation, and 5000ms stale/gc windows. Expose the source hook name `useGetMyClaimRequestById` at the page query boundary.
- [x] Preserve `GET /my/iap/claim-requests/{id}` and `claimRequestSchema`; shared schemas retain the accepted strict outgoing validation boundary.
- [x] Extract Persian translation values directly from reference locale files; add source keys instead of substituting target keys. Correct the existing list heading value to the same reference value because the existing translation regression fixture already required it.

Architecture adaptations: customer UI URLs omit `/myiap`; backend paths retain it. Route stays thin and exports the feature page. Request schemas are owned by `@iap/api-types`, not duplicated in page files. The page query shim preserves the reference name while using the feature query cache.

Completion evidence is recorded in `reference-parity-audit.md`. Browser screenshots and live backend behavior have not been verified.
