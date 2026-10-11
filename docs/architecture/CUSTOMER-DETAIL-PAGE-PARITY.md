# Customer detail page parity

## Reusable implementation guidance

For new customer detail pages, read the reference page and its complete mounted component closure before implementation. Use the latest My Claims detail audit in `docs/tasks/myclaims-detail/` as verification evidence, not as a product specification for unrelated domains.

Keep routes thin. A detail journey belongs in `features/<feature>/pages/detail/`; its private components, model contracts, queries and services remain beneath that owner. Shared sibling controls belong at the feature boundary. Preserve source component names while adapting imports to workspace public APIs.

Customer UI routes omit `/myiap`; backend `/my/iap/**` endpoints retain their original paths. Operations management links belong to the configured admin application origin. Do not create admin management routes in the customer application.

Server data belongs in TanStack Query. Preserve verified query keys, stale/gc windows, enabled conditions and abort signals. Do not mutate cached response arrays while rendering: sort copies and independently preserve any source decisions that relied on their chronological order. Mutation sequencing and confirmation failure behavior require explicit tests.

Keep enum translation keys and presentation maps centralized at their existing owner. Extract mounted Persian locale values directly from reference JSON. Missing keys, default values and date interpretation must be checked explicitly; replacing a source key with a similarly named target key is not parity.

## Shared file capability

`@iap/files` owns the shared `FileViewer`, lazy attachment lifecycle, image transform state, MIME detection, HEIC conversion and file transport. Both applications consume its public API. `iap-admin` retains its public module facade for existing consumers.

The viewer includes attachment paging, download progress and retry, PDF iframe rendering, image zoom/pan/rotation/reset/download, per-attachment transform state, and object URL cleanup. File schemas remain in `@iap/api-types`; transport uses `@iap/api-client`. Add `packages/files/src` to the application's Tailwind content scan when consuming its components.

The My Claims uploader is shared by create and detail within that feature. Do not assume it is a cross-application upload API. Compare the relevant reference before promoting or reusing it in another domain.

## Verification boundaries

Use scoped `presentation='reference'` on shared primitives when matching reference presentation. Preserve host language and source timezone interpretation in date utilities. Validate nested responses and outgoing request placement, not just top-level TypeScript types.

Run affected component/transport tests, both applications' typechecks when shared code changes, lint, architecture checks and production build. Tests and compilation do not establish pixel-identical screenshots or live backend behavior; record those separately.
