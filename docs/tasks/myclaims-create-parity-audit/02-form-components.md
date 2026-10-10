# Task 02 — Form component parity

Reference form child names and order are exact:
`MyClaimMyInsurancePolicyFormField(featureKey="help_InsurancePolicy")`, `MyClaimMyNationalCodeFormField(featureKey="help_extNationalCode")`, submit-date `DatePicker`, submit-date alert, amount `InputAmount`, `MyClaimRequestFormDocTypes`, conditional document-guide alert, `FileUploader`, submit action.

Current discrepancies: fields are inlined; feature support buttons are absent; national-code values use person id instead of `nationalCode` and omit foreign-person labels; doc type search lacks deferred search and `others` handling; amount uses generic Input instead of `InputAmount`; upload uses a fake metadata conversion and no upload state; info alerts lack reference icon/classes; invalid-Sheba and bank-account dialogs are absent; first-error scrolling is absent.
