const amountFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
})

export function formatAmount(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value)
    ? amountFormatter.format(value)
    : null
}
