import { UserAccountSearchSelect } from '@modules/user-account-selection'

type PersonSpecialDiseaseUserSearchSelectProps = {
  disabled?: boolean
  onChange: (value: string | undefined) => void
  placeholder?: string
  value?: string
}

export function PersonSpecialDiseaseUserSearchSelect(
  props: PersonSpecialDiseaseUserSearchSelectProps
) {
  const { disabled, onChange, placeholder, value } = props

  return (
    <UserAccountSearchSelect
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      valueMode='username'
    />
  )
}
