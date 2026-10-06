import { useAssessmentPrompt } from '@features/assessment-prompts/context/store/assessment-prompt-store'
import { assessmentPromptService } from '@features/assessment-prompts/services/assessment-prompt-service'
import type { AssessmentPrompt } from '@iap/api-types'
import { type DeleteMethod, DeleteMethodDialog } from '@iap/dialogs'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type AssessmentPromptDeleteMethodDialogProps = {
  assessmentPrompts: AssessmentPrompt[]
}

export function AssessmentPromptDeleteMethodDialog(
  props: AssessmentPromptDeleteMethodDialogProps
) {
  const { assessmentPrompts } = props
  const open = useAssessmentPrompt((state) => state.open)
  const selection = useAssessmentPrompt((state) => state.rowSelection)
  const setOpen = useAssessmentPrompt((state) => state.setOpen)
  const setSelection = useAssessmentPrompt((state) => state.setRowSelection)
  const client = useQueryClient()
  const { t } = useTranslate()
  const ids = Object.entries(selection).flatMap(([index, selected]) => {
    const id = assessmentPrompts[Number(index)]?.id
    return selected && id ? [id] : []
  })
  const deletion = useMutation({
    mutationFn: async ({
      method,
      thruDate,
    }: {
      method: DeleteMethod
      thruDate?: string
    }) => {
      if (!ids.length) throw new Error('No assessment prompts selected')
      if (method === 'soft')
        await assessmentPromptService.softDeleteBulk(ids, thruDate)
      else await assessmentPromptService.bulkDelete(ids)
    },
    onSuccess: (_, { method }) => {
      void client.invalidateQueries({ queryKey: ['assessment-prompts'] })
      toast.success(
        t(
          method === 'soft'
            ? 'common.softDeleteSuccess'
            : 'common.deleteSuccess'
        )
      )
    },
  })
  return (
    <DeleteMethodDialog
      entityName='assessment prompt'
      presentation='reference'
      resetDelay={300}
      isLoading={deletion.isPending}
      onDelete={(method, thruDate) =>
        deletion.mutateAsync({ method, thruDate })
      }
      onOpenChange={(next) => {
        if (!next) {
          setOpen(null)
          setSelection({})
        }
      }}
      open={open === 'bulkDelete'}
      showDatePicker
    />
  )
}
