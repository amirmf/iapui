const amountFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})
export function formatAssessmentAmount(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value)
    ? amountFormatter.format(value)
    : null
}
