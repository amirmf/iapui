import { useCallback, useMemo, useState } from 'react'

import { UserAccountSpecialDiseaseForm } from '@features/user-account/components/user-account-special-disease-form'
import { UserAccountSpecialDiseasePersonList } from '@features/user-account/components/user-account-special-disease-person-list'
import { useUserAccountStore } from '@features/user-account/context/store/user-account-store'
import { type InsuredPerson } from '@iap/api-types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { personSpecialDiseaseService } from '@modules/person-special-diseases'
import { useTranslate } from '@shared/i18n/i18n'
import { useQuery } from '@tanstack/react-query'

export function UserAccountSpecialDiseaseDialog() {
  const { t } = useTranslate()
  const closeDialog = useUserAccountStore((state) => state.closeDialog)
  const currentUser = useUserAccountStore((state) => state.currentUser)
  const dialog = useUserAccountStore((state) => state.dialog)
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
