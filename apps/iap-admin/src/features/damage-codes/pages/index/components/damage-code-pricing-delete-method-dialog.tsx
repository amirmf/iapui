import { damageCodePricingService } from '@features/damage-codes/services/damage-code-pricing-service'
import { DeleteMethodDialog } from '@iap/dialogs'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function DamageCodePricingDeleteMethodDialog(props: {
  ids: string[]
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const { ids, onOpenChange, open } = props
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return (
    <DeleteMethodDialog
      entityName={t('damageCodePricings.title')}
      onDelete={async (method, thruDate) => {
        if (!ids.length) throw new Error('No damage code pricings selected')
        if (method === 'soft')
          await damageCodePricingService.softDeleteBulk(ids, thruDate)
        else await damageCodePricingService.bulkDelete(ids)
        await queryClient.invalidateQueries({
          queryKey: ['damage-code-pricings'],
        })
        toast.success(
          t(
            method === 'soft'
              ? 'damageCodePricings.messages.softDeleted'
              : 'damageCodePricings.messages.deleted'
          )
        )
      }}
      onOpenChange={onOpenChange}
      open={open}
      showDatePicker
    />
  )
}
