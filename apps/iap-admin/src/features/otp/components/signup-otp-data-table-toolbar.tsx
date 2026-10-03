import {
  type TableFilterBaseProps,
  TableFilterState,
  type TableFilterValues,
} from '@shared/tables'
import { useTranslation } from 'react-i18next'

const filterInputClassName = 'lg:w-full'
const filterWrapperClassName = 'w-full sm:w-1/4 xl:w-1/5 px-1'

const textFilterConfigs = [
  {
    id: 'phoneNumber',
    numerical: true,
    translationKey: 'otp.filters.phoneNumber',
  },
  {
    id: 'nationalCode',
    numerical: true,
    translationKey: 'otp.filters.nationalCode',
  },
] as const

type SignupOtpDataTableToolbarProps = {
  filters: TableFilterValues
  onChange: (id: string, value: string | string[] | undefined) => void
  onReset: () => void
}

export default function SignupOtpDataTableToolbar(
  props: SignupOtpDataTableToolbarProps
) {
  const { t } = useTranslation()
  const textFilters: TableFilterBaseProps['textFilters'] =
    textFilterConfigs.map((config) => ({
      className: filterInputClassName,
      id: config.id,
      numerical: config.numerical,
      placeholder: t(config.translationKey) as string,
      wrapperClassName: filterWrapperClassName,
    }))

  return (
    <TableFilterState
      onReset={props.onReset}
      onValuesChange={(updater) => {
        const next = updater(props.filters)
        for (const config of textFilterConfigs) {
          if (next[config.id] !== props.filters[config.id]) {
            props.onChange(config.id, next[config.id])
          }
        }
      }}
      textFilters={textFilters}
      values={props.filters}
    />
  )
}
