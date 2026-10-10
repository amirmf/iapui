# Task 01 — Reference contracts and translations

Verify and implement the contracts before UI composition.

## API endpoints from the reference
- `GET /my/iap/claim-requests/page-full` (list invalidation after create)
- `POST /claim-requests` with `submitDate` formatted `yyyy-MM-dd`, numeric `amount`, `{ id }` document type, national-code string, policy id, and attachment list.
- `GET /my/iap/my-bank-account`, `POST /my/iap/add-my-bank-account`, `PUT /my/iap/my-bank-account/{id}` for the invalid-Sheba recovery dialog.

## Schemas
Use the reference `myClaimRequestFormSchema` shape: date, amount string with min/max amount validation, non-empty attachments, selected document type, selected sub-insured person, positive policy id, optional foreign flag. API responses use claim-request and attachment contracts already exposed by the current workspace.

## Translation keys
Use exact keys: `myiap.claimRequests.form.title`, `myiap.claimRequests.form.description`, `claimRequests.dialog.fields.submitDate`, `claimRequests.dialog.fields.submitDatePlaceholder`, `claimRequests.dialog.fields.amount`, `common.rial`, `myiap.createClaimPage.submitDateAlertTitle`, `myiap.createClaimPage.submitDateAlertDescription`, `myiap.docTypeAlert`, `claimRequests.dialog.fields.attachments`, `form.creating`, `form.uploading`, `myiap.claimRequests.create`, `claimRequests.messages.created`, `myiap.createClaimPage.invalidShebaTitle`, `myiap.createClaimPage.invalidShebaMessage`, `myiap.createClaimPage.invalidShebaConfirm`.

Check the app's `shared/i18n/locales/{fa,en}` and enum translation constant before adding any key; do not invent translations.
