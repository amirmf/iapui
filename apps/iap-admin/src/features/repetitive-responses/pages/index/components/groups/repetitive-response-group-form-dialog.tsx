import { createRepetitiveResponseGroupFormSchema, type RepetitiveResponseGroupForm } from '@features/repetitive-responses/model/repetitive-response-form-schema'
import { repetitiveResponseGroupService } from '@features/repetitive-responses/services/repetitive-response-group-service'
import { zodResolver } from '@hookform/resolvers/zod'
import type { RepetitiveResponseGroup } from '@iap/api-types'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@iap/forms'
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input } from '@iap/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function RepetitiveResponseGroupFormDialog(props: {
  currentRow?: RepetitiveResponseGroup | null
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const { currentRow, onOpenChange, open } = props
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const isEdit = Boolean(currentRow?.id)
  const schema = createRepetitiveResponseGroupFormSchema(t)
  const form = useForm<RepetitiveResponseGroupForm>({
    defaultValues: { seqNum: currentRow?.seqNum ?? 0, title: currentRow?.title ?? '' },
    resolver: zodResolver(schema) as never,
  })
  const mutation = useMutation({
    mutationFn: (values: { seqNum: number; title: string }) =>
      isEdit && currentRow?.id
        ? repetitiveResponseGroupService.update(currentRow.id, values)
        : repetitiveResponseGroupService.create(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['repetitive-response-groups'] })
      toast.success(t(isEdit ? 'repetitiveResponseGroups.messages.updated' : 'repetitiveResponseGroups.messages.created'))
      onOpenChange(false)
    },
  })
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader><DialogTitle>{t(isEdit ? 'repetitiveResponseGroups.dialog.edit' : 'repetitiveResponseGroups.dialog.create')}</DialogTitle></DialogHeader>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit((values) => mutation.mutate(values as RepetitiveResponseGroupForm))}>
            <FormField control={form.control} name='title' render={({ field }) => <FormItem><FormLabel>{t('repetitiveResponseGroups.dialog.fields.title')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name='seqNum' render={({ field }) => <FormItem><FormLabel>{t('repetitiveResponseGroups.dialog.fields.seqNum')}</FormLabel><FormControl><Input {...field} onChange={(event) => field.onChange(Number(event.target.value || 0))} type='number' value={Number(field.value)} /></FormControl><FormMessage /></FormItem>} />
            <DialogFooter><Button disabled={mutation.isPending} onClick={() => onOpenChange(false)} type='button' variant='outline'>{t('common.cancel')}</Button><Button disabled={mutation.isPending} type='submit'>{t(isEdit ? 'form.update' : 'form.submit')}</Button></DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
