---
name: building-translated-zod-forms
description: Use when building or refactoring React Hook Form forms in IPOS that need client-side Zod validation, translated error messages, and consistent accessible field errors.
---

# Building Translated Zod Forms

Use this project convention for client-side forms in either application. Keep product rules and schemas in the owning feature. Resolve every field through `@insurance/forms` before importing a UI primitive directly.

## Required pattern

1. Create a schema factory beside the form, for example `features/<feature>/schemas/<form>-schema.ts`. It receives the feature's `t` function and calls `t(...)` for every client-validation message. Infer form values from the factory result.

```ts
export function createProfileSchema(t: Translate) {
  return z.object({
    mobile: z.string().min(1, t('profile.errors.mobileRequired')),
  })
}

export type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>
```

2. In the form, memoize the translated schema and pass it to React Hook Form through `zodResolver`. Supply complete `defaultValues` and submit only with `handleSubmit`.

```ts
const schema = useMemo(() => createProfileSchema(t), [t])
const form = useForm<ProfileFormValues>({
  defaultValues: { mobile: '' },
  resolver: zodResolver(schema),
})
```

Do not put client-validation messages in `register` rules, component state, or JSX. A locale change must create the schema again through its `t` dependency.

## Field errors

Before implementing a form, inspect every public field component exported by `@insurance/forms` and choose in this order:

1. Use the matching ready-made field, such as `TextField`, `PhoneField`, `SelectField`, or `TextareaField`.
2. If no ready-made field exists, compose the exported `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, and `FormMessage` primitives from `@insurance/forms` around an `@insurance/ui` control.
3. Use a local composite control only when neither option can model the interaction.

Do not skip a ready-made field merely to preserve a native prop. If that prop is a broadly useful option, extend the ready-made field to forward it, then use the field. These bindings synchronize the label's destructive color, the control's `aria-invalid` state and destructive border/focus ring, `aria-describedby`, and the announced error message. Do not reimplement those effects manually.

Use `Controller` for a genuinely controlled or composite control.

## Form context boundaries

Wrap a feature form in `Form` and use `useFormContext<TFormValues>()` inside a domain-specific form section that is rendered beneath that provider. Do this when passing `control` through intermediary feature components would otherwise create prop drilling. The section may pass its context-derived `control` to the generic fields from `@insurance/forms`.

Keep `control` as an explicit prop on generic `@insurance/forms` bindings and on shallow, standalone components. Do not use form context unless the component is guaranteed to render beneath the matching `Form` provider.

For a composite control that cannot be wrapped by one `FormControl` (for example, separate OTP slots), give every interactive input `aria-invalid`, associate it with one error message, and make its visible label destructive. Keep this exception inside the composite control instead of duplicating it in its parent form.

## Server and submission errors

Zod owns client input validation only. Map a server rejection for one field with `setError('fieldName', { message: t(...) })`; show a request-wide failure as `root.serverError`. Never put transport or business-policy messages into a client Zod schema.

Disable submission for `isSubmitting` and real product state only; do not duplicate schema validity in local state or `watch` merely to gate the button.

## Verification

Test each new form's observable behavior: translated schema messages, invalid submission rendering through the shared form bindings, and distinct server-error handling. For multi-field submits, include the shared error summary and its focus behavior.
