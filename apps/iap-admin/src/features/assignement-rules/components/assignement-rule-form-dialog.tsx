import { useEffect, useMemo } from 'react'

import { AssignementRuleFormFields } from '@features/assignement-rules/components/assignement-rule-form-fields'
import {
  toFormValues,
  toRequestData,
} from '@features/assignement-rules/components/assignement-rule-form-values'
import { useAssignementRule } from '@features/assignement-rules/context/store/assignement-rule-store'
import {
  type AssignementRuleForm,
  assignementRuleFormSchema,
} from '@features/assignement-rules/model/assignement-rule-form-schema'
import {
  useCreateAssignementRule,
  useUpdateAssignementRule,
} from '@features/assignement-rules/queries/use-assignement-rule-mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { type QueryObserverResult } from '@tanstack/react-query'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function AssignementRuleFormDialog<TData>(props: {
  refetch: () => Promise<QueryObserverResult<TData>> | Promise<unknown> | void
}) {
  const { refetch } = props
  const { t } = useTranslation()
  const open = useAssignementRule((state) => state.open)
  const currentRule = useAssignementRule((state) => state.currentRow)
  const setOpen = useAssignementRule((state) => state.setOpen)
  const setCurrentRow = useAssignementRule((state) => state.setCurrentRow)

  const isEdit = Boolean(currentRule?.id)
  const isDialogOpen = open === 'create' || open === 'edit'

  const schema = useMemo(() => assignementRuleFormSchema(t), [t])
  const form = useForm<AssignementRuleForm>({
    defaultValues: toFormValues(currentRule),
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (isDialogOpen) form.reset(toFormValues(currentRule))
  }, [currentRule, form, isDialogOpen])

  const handleClose = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  const createMutation = useCreateAssignementRule(async () => {
    await refetch()
    toast.success(t('assignementRules.messages.created'))
    handleClose()
  })

  const updateMutation = useUpdateAssignementRule(async () => {
    await refetch()
    toast.success(t('assignementRules.messages.updated'))
    handleClose()
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  const submit: SubmitHandler<AssignementRuleForm> = (data) => {
    if (isEdit && currentRule?.id) {
      updateMutation.mutate({ data: toRequestData(data), id: currentRule.id })
    } else {
      createMutation.mutate(toRequestData(data))
    }
  }

  return (
    <Dialog
      onOpenChange={(nextOpen) => !isPending && !nextOpen && handleClose()}
      open={isDialogOpen}
    >
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {t(
              isEdit
                ? 'assignementRules.dialog.edit'
                : 'assignementRules.dialog.create'
            )}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(submit)}>
            <AssignementRuleFormFields
              isDialogOpen={isDialogOpen}
              isEdit={isEdit}
            />
            <DialogFooter>
              <Button
                disabled={isPending}
                onClick={handleClose}
                type='button'
                variant='outline'
              >
                {t('common.cancel')}
              </Button>
              <Button disabled={isPending} type='submit'>
                {t(isEdit ? 'common.save' : 'common.create')}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
