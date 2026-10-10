# Task 05: Special Diseases Create Page (`/special-diseases/create/`)

## Reference & Target

- **Reference Page**: `insurance-ui/src/features/my-iap/special-diseases/pages/my-special-disease-create-page.tsx`
- **Reference Route**: `insurance-ui/src/routes/_app/myiap/special-diseases/create.tsx`
- **Target Route**: `apps/iap-app/src/app/router/routes/_authenticated/special-diseases/create/index.tsx`
- **Target Page**: `apps/iap-app/src/features/special-diseases/pages/create/my-special-disease-create-page.tsx`

## Component Breakdown

1. **`MySpecialDiseaseCreatePage`** (`pages/create/my-special-disease-create-page.tsx`):
   - Page container with `max-w-3xl`.
   - Renders `MySpecialDiseasePageHeader` with title (`myiap.specialDiseases.create`) and `showBackButton`.
   - Renders `Card` hosting `MySpecialDiseaseForm`.
   - On success, navigates to `/special-diseases/`.
2. **`MySpecialDiseaseForm`** (`pages/create/components/my-special-disease-form.tsx`):
   - React Hook Form instance with `typedZodResolver(mySpecialDiseaseFormSchema)`.
   - Maps form values using `mapMySpecialDiseaseFormToRequest`.
   - Composes structured fieldsets:
     - Person identification: `MySpecialDiseasePersonFields`
     - Medical details: `MySpecialDiseaseFields`
     - Evidence attachments: `MySpecialDiseaseAttachmentsField`
3. **`MySpecialDiseasePersonFields`** (`pages/create/components/my-special-disease-person-fields.tsx`):
   - National code, full name, phone number, and relationship selection.
4. **`MySpecialDiseaseFields`** (`pages/create/components/my-special-disease-fields.tsx`):
   - Disease category, disease name, diagnosis date, and treating physician.
5. **`MySpecialDiseaseAttachmentsField`** (`pages/create/components/my-special-disease-attachments-field.tsx`):
   - Medical report, pathology results, and diagnostic evidence file uploaders.

## API & Schema Contract

- **Endpoint**: `POST /my/special-diseases`
- **Request Schema**: `createMySpecialDiseaseRequestSchema`
  - Fields: `diseaseName`, `diseaseType`, `extNationalCode`, `extDisplayName`, `submitDate`, `attachments`
- **Response Schema**: `mySpecialDiseaseSchema`

## Translation Keys

- `myiap.specialDiseases.create`
- `myiap.specialDiseases.form.*` (field labels, validations, placeholders)
- `common.back`
- `common.submit`
- `common.submitting`
