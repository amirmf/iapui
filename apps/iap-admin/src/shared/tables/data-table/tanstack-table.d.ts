import '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // These parameters are required by TanStack's declaration contract.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    /** Shared by headers and cells; kept compatible with the reference table API. */
    className?: string
    cellClassName?: string
    headerClassName?: string
    label?: string
  }
}
