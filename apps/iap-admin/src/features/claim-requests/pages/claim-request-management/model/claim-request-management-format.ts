const amountFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
})
export function formatPrescriptionAmount(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value)
    ? amountFormatter.format(value)
    : null
}
