import { damageCodeService } from '@features/damage-codes/services/damage-code-service'
import { DeleteMethodDialog } from '@iap/dialogs'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function DamageCodeDeleteMethodDialog(props: {
  ids: string[]
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const { ids, onOpenChange, open } = props
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  return (
    <DeleteMethodDialog
      entityName={t('damageCodes.title')}
      onDelete={async (method, thruDate) => {
        if (!ids.length) throw new Error('No damage codes selected')
        if (method === 'soft')
          await damageCodeService.softDeleteBulk(ids, thruDate)
        else await damageCodeService.bulkDelete(ids)
        await queryClient.invalidateQueries({ queryKey: ['damage-codes'] })
        toast.success(
          t(
            method === 'soft'
              ? 'damageCodes.messages.softDeleted'
              : 'damageCodes.messages.deleted'
          )
        )
      }}
      onOpenChange={onOpenChange}
      open={open}
      showDatePicker
    />
  )
}
