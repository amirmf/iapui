import { useDocTypeStore } from '@features/doc-types/context/store/doc-type-store'
import type { AdminDocType } from '@iap/api-types'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@iap/ui'
import { useNavigate } from '@tanstack/react-router'
import type { Row } from '@tanstack/react-table'
import {
  Braces,
  Eye,
  FileCheck2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

type DocTypeRowActionsProps = { row: Row<AdminDocType> }

export function DocTypeRowActions(props: DocTypeRowActionsProps) {
  const { row } = props
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setCurrentRow = useDocTypeStore((state) => state.setCurrentRow)
  const setEditingRowId = useDocTypeStore((state) => state.setEditingRowId)
  const setOpenDialog = useDocTypeStore((state) => state.setOpenDialog)
  const docType = row.original
  const id = docType.id
  const openDialog = (dialog: 'delete' | 'details') => {
    setCurrentRow(docType)
    setOpenDialog(dialog)
  }
  const openBuilder = () => {
    if (!id) return

    navigate({
      params: { docTypeId: id },
      to: '/doc-types/$docTypeId/form-builder/',
    })
  }
  const openSampleSubmission = () => {
    if (!id) return

    navigate({
      params: { docTypeId: id },
      to: '/doc-types/$docTypeId/submission-example/',
    })
  }
  const startInlineEdit = () => {
    if (id) setEditingRowId(id)
  }
  const openEdit = () => {
    if (!id) return

    navigate({
      params: { docTypeId: id },
      to: '/doc-types/$docTypeId/edit/',
    })
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          variant='ghost'
        >
          <MoreHorizontal aria-hidden='true' className='size-4' />
          <span className='sr-only'>{t('common.openMenu')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[200px]'>
        <DropdownMenuItem onSelect={() => openDialog('details')}>
          <Eye aria-hidden='true' className='size-4' />
          {t('docTypes.actions.viewDetails')}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!id} onSelect={openBuilder}>
          <Braces aria-hidden='true' className='size-4' />
          {t('docTypes.actions.buildForm')}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!id} onSelect={openSampleSubmission}>
          <FileCheck2 aria-hidden='true' className='size-4' />
          {t('docTypes.actions.sampleSubmission')}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!id} onSelect={startInlineEdit}>
          <Pencil aria-hidden='true' className='size-4' />
          {t('docTypes.actions.inlineEdit')}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!id} onSelect={openEdit}>
          <Pencil aria-hidden='true' className='size-4' />
          {t('docTypes.actions.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className='text-destructive focus:text-destructive'
          disabled={!id}
          onSelect={() => openDialog('delete')}
        >
          <Trash2 aria-hidden='true' className='size-4' />
          {t('docTypes.actions.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
