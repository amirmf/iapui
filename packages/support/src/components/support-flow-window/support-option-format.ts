const amountFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatAmount(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return amountFormatter.format(value)
  }

  return null
}
