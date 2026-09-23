/** Approved CSS color-token names shared by Storefront and Admin. */
export const colorTokenNames = [
  'background',
  'foreground',
  'surface',
  'surface-muted',
  'surface-elevated',
  'text-secondary',
  'border',
  'input',
  'ring',
  'primary',
  'primary-hover',
  'primary-subtle',
  'primary-foreground',
  'accent',
  'accent-foreground',
  'success',
  'success-foreground',
  'warning',
  'warning-foreground',
  'destructive',
  'destructive-foreground',
  'info',
  'info-foreground',
] as const

export type ColorTokenName = (typeof colorTokenNames)[number]

export const colorThemeClassNames = {
  light: 'light',
  dark: 'dark',
} as const
