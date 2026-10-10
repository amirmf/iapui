# Task 02 — Component-by-component implementation

1. **Route entry**: compose the feature page and preserve loader crumb `createClaim`; no business logic.
2. **MyClaimRequestCreatePage**: container (`px-4 py-8`, responsive padding), centered `max-w-3xl`, vertical spacing; render header and Card.
3. **MyClaimRequestPageHeader**: reuse/adapt current app header component; title/description props and back navigation to `/myclaims`.
4. **MyClaimRequestForm**: RHF + Zod resolver, mutation, upload state, invalid-Sheba recovery state, scroll to first error, reset after success.
5. **Policy field**: reuse existing policy query/service and field contract; exact reference label/help key.
6. **Sub-insured person field**: reuse existing people query/service and field contract; exact reference label/help key.
7. **Submit-date field**: date picker, max date end-of-today, required label and placeholder translations.
8. **Submit-date alert**: info icon and reference alert classes/text.
9. **Amount field**: numeric-only input, comma formatting, max length 11, rial label, schema validation.
10. **Document type field**: reuse/create a focused field component backed by verified doc-type query/schema; expose selected `documentGuide`.
11. **Document guide alert**: render only when selected document type contains guide, using `myiap.docTypeAlert` interpolation.
12. **Attachments field**: reuse the shared file uploader contract; required validation and upload progress state.
13. **Submit action**: disabled while mutation or upload is pending; exact creating/uploading/create translations.
14. **Dialogs**: reuse shared confirm and bank-account dialog; invalid Sheba message opens recovery dialog.
