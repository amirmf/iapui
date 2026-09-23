---
name: component-props-in-body
description: Use when implementing or refactoring React TypeScript components that inspect individual props, especially shared input and form primitives.
---

# Component Props In Body

## Rule

For a component that reads individual props, accept one typed `props` parameter and destructure it as the first statement inside the function body. Do not destructure props in the function signature.

In React 19, include `ref` in that body destructure when the component forwards a DOM or primitive ref; pass it to the rendered element directly. Do not wrap the component with `forwardRef`.

## Required shape

```tsx
export function Input(props: InputProps) {
  const {
    className,
    inputMode,
    maxLength,
    numberWithComma = false,
    numerical = false,
    onChange,
    ref,
    type = 'text',
    value,
    ...rest
  } = props

  // Normalize values and derive render props here.
  return <input ref={ref} {...rest} />
}
```

Keep default values, derived state, validation, and event handlers after the body destructure. Spread `rest` last unless a deliberate wrapper invariant must override a native prop.

## Boundaries

- Use this pattern for function components that inspect or transform props.
- A component that passes the entire props object through unchanged may retain `props` without destructuring it.
- Do not introduce a second props object, duplicate defaults, or a `forwardRef` wrapper to work around this rule.

## Common mistakes

| Avoid | Use instead |
| --- | --- |
| `function Input({ value, ...rest }: InputProps)` | `function Input(props: InputProps) { const { value, ...rest } = props }` |
| `forwardRef((props, ref) => ...)` | Destructure `ref` from React 19 props inside a normal function component |
| Destructuring after event handlers or derived values | Destructure immediately before any component logic |
