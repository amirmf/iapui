# Task 01 — Page and route parity

- Keep `MyClaimRequestCreatePage` layout exactly: `container px-4 py-8 sm:px-6 lg:px-8`, inner `mx-auto max-w-3xl space-y-6`.
- Use the reference `MyClaimRequestPageHeader` props and exact navigation target `/myiap/myclaims` (target router canonical form may use `/myclaims/` only if generated route contract requires it).
- Preserve route loader crumb `createClaim` and thin route composition.
- Use `Card` and `CardContent` from the current public UI package.
