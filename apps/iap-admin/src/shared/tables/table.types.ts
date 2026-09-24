import '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // These parameters are required by TanStack's declaration contract.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    cellClassName?: string
    headerClassName?: string
    label?: string
  }
}
