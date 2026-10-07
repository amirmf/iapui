# Support reference contract scope

The Support parity implementation follows the verified contracts in
`insurance-ui/src/features/support/data/support-flow-schema.ts` and
`my-iap-ticket-schema.ts`. The user requested exact reference parity and
instructed implementation to continue on 2026-10-07.

For this scope, request objects strip unknown properties. My-IAP `page` and
`size` are optional integers without positive/nonnegative limits or defaults;
list `filters` are required string records. Message queries contain only
optional `page` and `size`. These contracts do not use the strict/defaulting
common page-request factory. This exception is limited to Support flow and
My-IAP requests; other domain rules remain unchanged.

Support option pages also use a dedicated source schema: metadata is optional,
non-nullable, integer where numeric, and known nested sort/pageable fields are
validated. Unknown properties are stripped. `content` uses `.nullish()` and accepts arrays, missing values, and `null`,
under the accepted workspace-wide nullish-content rule. This overrides the
reference rejection of null content; present items remain validated.
The shared page-response factory cannot express all of these source semantics.

Contracts remain in `@iap/api-types`; HTTP transport remains in the public
`@iap/support` service. Zod v4 `.loose()` replaces source `.passthrough()` with
equivalent retained-object context behavior, and `.nullish()` represents nullable
optional fields. No unrelated Support administration contracts are changed.

## My-IAP page ownership

My-IAP belongs exclusively to `iap-app`, as confirmed by the user on 2026-10-07.
`iap-admin` must not register `/myiap/` or any descendant route, including
placeholders. This supersedes the earlier placeholder scope. Shared Support
ticket views and their backend contracts remain supported.

The user also confirmed that iap-app no longer has the `/myiap` prefix. Support
claim links use `/myclaims/{encodedClaimRequestId}`, resolved against the existing
`VITE_IAP_APP_DOMAIN_URL` emitted from tenant configuration. Standalone consumers
without that configuration use the same approved pathname. Backend
`/my/iap-ticket` endpoints and exported contract names remain unchanged.
