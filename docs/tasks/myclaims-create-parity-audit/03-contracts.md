# Task 03 — API and schema parity

- Add the reference service/query boundaries: policy and sub-insured queries, `docTypeService.getPage({page:0,size:100,signal})`, and the file uploader contract.
- Create payload must match reference: numeric amount, `{ id }` document type, national-code string, optional `isForeign`, formatted `submitDate` (`yyyy-MM-dd`), and uploaded attachment objects.
- Form schema must match reference `myClaimRequestFormSchema`: exact Zod fields/messages, attachment schema, doc-type picked fields, sub-insured schema refinement, positive policy id, optional yes/no foreign flag.
- Add invalid-Sheba detection using fixed Persian translation and the exact `ConfirmDialog` → `MyBankAccountDialog` flow with `/my/iap/my-bank-account`, `/my/iap/add-my-bank-account`, and PUT `/my/iap/my-bank-account/{id}`.
