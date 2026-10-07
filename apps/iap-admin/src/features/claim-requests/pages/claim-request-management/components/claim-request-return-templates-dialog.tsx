import { useMemo, useState } from 'react'

import { repetitiveResponseGroupService } from '@features/repetitive-responses'
import { repetitiveResponseService } from '@features/repetitive-responses'
import { type RepetitiveResponse } from '@iap/api-types'
import { ScrollArea } from '@iap/ui'
import { cn } from '@iap/ui'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@iap/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@iap/ui'
import { Input } from '@iap/ui'
import { Spinner } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronLeft } from 'lucide-react'

interface ClaimRequestReturnTemplatesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectResponse: (description: string) => void
}

export function ClaimRequestReturnTemplatesDialog(
  props: ClaimRequestReturnTemplatesDialogProps
) {
  const { open, onOpenChange, onSelectResponse } = props
  const { t, i18n } = useTranslation()
  const [openGroupIds, setOpenGroupIds] = useState<Record<string, boolean>>({})
  const [searchTerm, setSearchTerm] = useState('')

  const repetitiveResponsesQuery = useQuery({
    queryKey: ['claim-objection-return-templates'],
    enabled: open,
    queryFn: async ({ signal }) => {
      const [groupPage, responsePage] = await Promise.all([
        repetitiveResponseGroupService.getPage({
          page: 0,
          size: 200,
          signal,
        }),
        repetitiveResponseService.getPageFull({
          page: 0,
          size: 1000,
          signal,
        }),
      ])

      return {
        groups: groupPage.content ?? [],
        responses: responsePage.content ?? [],
      }
    },
    staleTime: 60_000,
    gcTime: 60_000,
  })

  const groupedReturnTemplates = useMemo(() => {
    const groups = repetitiveResponsesQuery.data?.groups ?? []
    const responses = repetitiveResponsesQuery.data?.responses ?? []

    const groupMap = new Map<string, RepetitiveResponse[]>()

    responses.forEach((response) => {
      const groupId = response.repetitiveResponseGroupId ?? 'ungrouped'
      const list = groupMap.get(groupId) ?? []
      list.push(response)
      groupMap.set(groupId, list)
    })

    const items = groups.map((group) => ({
      id: group.id ?? '',
      title:
        group.title || t('claimRequests.dialog.repetitiveResponses.heading'),
      responses: group.id ? (groupMap.get(group.id) ?? []) : [],
      seqNum: group.seqNum ?? Number.MAX_SAFE_INTEGER,
    }))

    const ungroupedResponses = groupMap.get('ungrouped') ?? []
    if (ungroupedResponses.length) {
      items.push({
        id: 'ungrouped',
        title: t('claimRequests.dialog.repetitiveResponses.heading', {
          defaultValue: 'Saved responses',
        }),
        responses: ungroupedResponses,
        seqNum: Number.MAX_SAFE_INTEGER,
      })
    }

    return items
      .map((item) => ({
        ...item,
        responses: [...item.responses].sort(
          (a, b) =>
            (a.seqNum ?? Number.MAX_SAFE_INTEGER) -
            (b.seqNum ?? Number.MAX_SAFE_INTEGER)
        ),
      }))
      .sort((a, b) => a.seqNum - b.seqNum)
  }, [
    repetitiveResponsesQuery.data?.groups,
    repetitiveResponsesQuery.data?.responses,
    t,
  ])

  const filteredReturnTemplates = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase()
    if (!normalizedSearchTerm) {
      return groupedReturnTemplates
    }

    return groupedReturnTemplates
      .map((group) => ({
        ...group,
        responses: group.responses.filter((response) =>
          (response.description ?? '')
            .toLowerCase()
            .includes(normalizedSearchTerm)
        ),
      }))
      .filter((group) => group.responses.length > 0)
  }, [groupedReturnTemplates, searchTerm])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent presentation='reference' className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {t('claimRequests.dialog.repetitiveResponses.heading', {
              defaultValue: 'Saved responses',
            })}
          </DialogTitle>
        </DialogHeader>
        <Input
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value)
          }}
          placeholder={t('claimRequests.dialog.repetitiveResponses.search', {
            defaultValue: 'Search saved responses...',
          })}
        />
        {repetitiveResponsesQuery.isFetching ? (
          <div className='flex min-h-32 items-center justify-center gap-2 text-sm text-muted-foreground'>
            <Spinner
              label={t('claimRequests.dialog.repetitiveResponses.loading', {
                defaultValue: 'Loading saved responses…',
              })}
              size='sm'
            />
            <span>
              {t('claimRequests.dialog.repetitiveResponses.loading', {
                defaultValue: 'Loading saved responses…',
              })}
            </span>
          </div>
        ) : repetitiveResponsesQuery.isError ? (
          <p className='text-sm text-destructive'>
            {t('claimRequests.messages.repetitiveResponsesLoadError', {
              defaultValue: 'Unable to load saved responses.',
            })}
          </p>
        ) : (
          <ScrollArea className='max-h-96 pr-2'>
            <div className='space-y-3'>
              {filteredReturnTemplates.map((group) => (
                <Collapsible
                  dir={i18n.dir()}
                  key={group.id}
                  open={openGroupIds[group.id]}
                  onOpenChange={(isOpenState) => {
                    setOpenGroupIds((prev) => ({
                      ...prev,
                      [group.id]: isOpenState,
                    }))
                  }}
                  className='rounded-md border'
                >
                  <CollapsibleTrigger
                    className={cn(
                      'flex w-full items-center justify-between bg-muted px-3 py-2 text-sm font-semibold'
                    )}
                  >
                    <span>{group.title}</span>
                    {openGroupIds[group.id] ? (
                      <ChevronDown className='size-4' />
                    ) : (
                      <ChevronLeft className='size-4' />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className='border-t'>
                      {group.responses.length ? (
                        group.responses.map((response) => (
                          <button
                            key={response.id}
                            type='button'
                            className='w-full whitespace-pre-wrap border-b px-3 py-2 text-right text-sm last:border-b-0 hover:bg-muted/70'
                            onClick={() => {
                              onSelectResponse(response.description ?? '')
                              onOpenChange(false)
                            }}
                          >
                            {response.description}
                          </button>
                        ))
                      ) : (
                        <p className='px-3 py-3 text-sm text-muted-foreground'>
                          {t('claimRequests.dialog.repetitiveResponses.empty')}
                        </p>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
              {!filteredReturnTemplates.length ? (
                <p className='px-3 py-3 text-center text-sm text-muted-foreground'>
                  {t('claimRequests.dialog.repetitiveResponses.empty', {
                    defaultValue: 'No saved responses match your text.',
                  })}
                </p>
              ) : null}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
