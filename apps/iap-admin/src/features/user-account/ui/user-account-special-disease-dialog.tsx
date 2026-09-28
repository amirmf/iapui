import { useCallback, useMemo, useState } from 'react'

import { type InsuredPerson } from '@iap/api-types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { personSpecialDiseaseService } from '@modules/person-special-diseases'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useUserAccountStore } from '../model/user-account-store'
import { UserAccountSpecialDiseaseForm } from './user-account-special-disease-form'
import { UserAccountSpecialDiseasePersonList } from './user-account-special-disease-person-list'

export function UserAccountSpecialDiseaseDialog() {
  const { t } = useTranslation()
  const { closeDialog, currentUser, dialog } = useUserAccountStore()
  const [selectedPerson, setSelectedPerson] = useState<InsuredPerson | null>(
    null
  )
  const isOpen = dialog === 'specialDiseases'
  const personsQuery = useQuery({
    enabled: isOpen && Boolean(currentUser?.id),
    queryFn: ({ signal }) =>
      personSpecialDiseaseService.getInsuredPersonsByUserAccountId(
        currentUser!.id,
        signal
      ),
    queryKey: ['user-account', 'insured-persons', currentUser?.id],
    gcTime: 60_000,
    staleTime: 60_000,
  })
  const handleClose = useCallback(() => {
    closeDialog()
    setSelectedPerson(null)
  }, [closeDialog])
  const persons = useMemo<InsuredPerson[]>(
    () =>
      currentUser
        ? [
            {
              id: null,
              lastName: currentUser.lname,
              name: currentUser.fname ?? currentUser.displayName,
              nationalCode: currentUser.username,
            },
            ...(personsQuery.data ?? []),
          ]
        : [],
    [currentUser, personsQuery.data]
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('parties.actions.specialDiseases')}</DialogTitle>
          <DialogDescription>
            {currentUser?.displayName ?? currentUser?.username ?? '-'}
          </DialogDescription>
        </DialogHeader>
        {selectedPerson ? (
          <UserAccountSpecialDiseaseForm
            onBack={() => setSelectedPerson(null)}
            onSuccess={() => setSelectedPerson(null)}
            person={selectedPerson}
          />
        ) : personsQuery.isLoading ? (
          <p className='text-sm text-muted-foreground'>{t('common.loading')}</p>
        ) : personsQuery.isError ? (
          <p className='text-sm text-destructive'>
            {t('parties.userAccount.messages.loadError')}
          </p>
        ) : persons.length > 0 ? (
          <UserAccountSpecialDiseasePersonList
            onSelect={setSelectedPerson}
            persons={persons}
          />
        ) : (
          <p className='text-sm text-muted-foreground'>
            {t('parties.noParties')}
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
