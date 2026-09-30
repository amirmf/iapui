import { zodResolver } from '@hookform/resolvers/zod'
import { type Branch, type BranchForm, branchFormSchema } from '@iap/api-types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from '@iap/ui'
import { branchService } from '@modules/branches'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function BranchFormDialog(props: {
  currentRow?: Branch | null
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const { currentRow, onOpenChange, open } = props
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const isEdit = Boolean(currentRow?.id)
  const form = useForm<BranchForm>({
    defaultValues: {
      code: String(currentRow?.code ?? ''),
      isActive: currentRow?.isActive ?? 1,
      name: currentRow?.name ?? '',
    },
    resolver: zodResolver(branchFormSchema),
  })
  const createMutation = useMutation({
    mutationFn: branchService.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success(t('branches.messages.created'))
      onOpenChange(false)
      form.reset()
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: BranchForm }) =>
      branchService.update(id, values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success(t('branches.messages.updated'))
      onOpenChange(false)
    },
  })
  const onSubmit = (values: BranchForm) => {
    if (isEdit && currentRow?.id) {
      updateMutation.mutate({ id: currentRow.id, values })
    } else {
      createMutation.mutate(values)
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(isEdit ? 'branches.dialog.edit' : 'branches.dialog.create')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('branches.form.code')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('branches.form.title')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('branches.form.status')}</FormLabel>
                  <FormControl>
                    <Input
                      max={1}
                      min={0}
                      {...field}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                      type='number'
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit'>{t('common.save')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
