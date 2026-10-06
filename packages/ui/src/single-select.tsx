import {
  SearchableSelect,
  type SearchableSelectProps,
} from './searchable-select'

export type SingleSelectProps = Omit<
  SearchableSelectProps,
  'showSearch' | 'onSearch' | 'search' | 'shouldFilter'
>

export function SingleSelect(props: SingleSelectProps) {
  return <SearchableSelect {...props} showSearch={false} />
}
