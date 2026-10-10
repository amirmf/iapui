# Child component parity audit

This audit compares `insurance-ui/src/features/my-iap/claim-requests` with the
`iap-app` create form. Each item is an implementation task and must be verified
against the reference source before coding.

## Tasks

1. Extract `MyClaimMyInsurancePolicyFormField` with the reference props,
   first-policy selection, dependent-person reset shape, support feature button,
   and exact select behavior.
2. Extract `MyClaimMyNationalCodeFormField`; use national-code values, map the
   selected person object for create mode, and include the foreign-person label.
3. Extract `MyClaimRequestFormDocTypes`; use the shared doc-type hook, deferred
   search, `shouldFilter={false}`, and append the `others` option exactly as the
   reference does.
4. Port `FileUploader` and its upload/preview/status dependencies. Preserve
   magic-byte validation, HEIC conversion, progress callbacks, localized error
   toasts, drag/drop, removal, and attachment schema values.
5. Restore the form's reference behavior: date picker props/max date, amount
   formatter, alert styling/icons, default values, first-error scrolling,
   upload-aware submit state, and exact translation keys.
6. Restore invalid-Sheba handling with `ConfirmDialog`, `MyBankAccountDialog`,
   and `MyBankAccountForm`, including the auth display name and reference
   translation keys.
7. Replace the direct doc-type API query and raw file input with the extracted
   reference components and verify payload mapping (`isForeign`, object national
   code, and uploaded attachments).

## Confirmed differences

The current target uses inline selectors keyed by person id, omits foreign labels,
does not support doc-type search/`others`, creates fake attachment records from a
raw file input, and lacks upload validation/progress/preview. It also omits
invalid-Sheba error handling, support feature buttons, first-error scrolling,
reference date/amount behavior, and several reference defaults.
