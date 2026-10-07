import { useClaimRequestFilterGroups } from '@features/claim-requests/components/use-claim-request-filter-groups'
import { toClaimRequestQuickStatusSearch } from '@features/claim-requests/route-adapters/use-claim-request-table-search'
import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const session = vi.hoisted(() => ({ roles: [] as string[] }))
vi.mock('@iap/auth', () => ({
  useAuthSession: () => ({ user: session }),
  isDoctorRole: () => false,
}))
vi.mock('@modules/doc-types', () => ({
  useDocTypesData: {
    options: () => ({
      options: [
        { label: 'Document', value: 'doc-1' },
        { label: '', value: '' },
      ],
    }),
  },
}))
vi.mock('react-i18next', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-i18next')>()),
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('claim request grouped toolbar', () => {
  beforeEach(() => {
    session.roles = []
  })
  it('matches the ordered reference groups, visible fields, and disease options', () => {
    session.roles = ['ROLE_ADMIN_USER']
    const { result } = renderHook(() =>
      useClaimRequestFilterGroups({ quickStatus: 'ALL' })
    )
    expect(
      result.current.map((group) => [
        group.id,
        group.filters.map((item) => item.config.id),
      ])
    ).toEqual([
      [
        'request',
        [
          'businessKey',
          'docType.id',
          'status',
          'aiStatus',
          'isReturn',
          'requestType',
          'createdAt',
          'submitDate',
        ],
      ],
      [
        'insured',
        [
          'extMainNationalCode',
          'extNationalCode',
          'extDisplayName',
          'extMainDisplayName',
          'extCustomerName',
          'extPlanCaption',
          'specialDiseases',
        ],
      ],
      [
        'organization',
        [
          'extContractId',
          'extPolicyId',
          'extWorkUnitName',
          'extWorkUnitCode',
          'extWorkUnitCityName',
          'extWorkUnitProvinceName',
        ],
      ],
      [
        'financial',
        [
          'outpatientDocAcceptanceExtId',
          'amount',
          'totalSumAmount',
          'corePaidAmount',
          'corePaidAmountPercent',
          'seenBy',
          'ibanStatus',
        ],
      ],
      [
        'assessment',
        [
          'latestAssignementDisplayName',
          'latestAssignementUsername',
          'assessedAt',
          'mainAssignedUserDisplayName',
          'mainAssignedUserUsername',
          'registeredByAgentDisplayName',
          'registeredByAgentUsername',
        ],
      ],
    ])
    const docType = result.current[0]!.filters.find(
      (item) => item.config.id === 'docType.id'
    )!
    if (docType.type === 'faceted')
      expect(docType.config.options).toEqual([
        { label: 'Document', value: 'doc-1' },
        { label: '', value: '' },
      ])
    const disease = result.current[1]!.filters.find(
      (item) => item.config.id === 'specialDiseases'
    )!
    expect(disease.type).toBe('faceted')
    if (disease.type === 'faceted')
      expect(disease.config.options.map((option) => option.value)).toEqual([
        'VIP',
        'LEVEL_ONE',
        'LEVEL_TWO',
        'SPECIAL_DISEASES',
        'SACRIFICE',
      ])
  })
  it('gates document lookup and restricts the status facet to ALL', () => {
    const { result } = renderHook(() =>
      useClaimRequestFilterGroups({ quickStatus: 'IN_ASSESSMENT' })
    )
    expect(result.current[0]!.filters.map((item) => item.config.id)).toEqual([
      'businessKey',
      'aiStatus',
      'isReturn',
      'requestType',
      'createdAt',
      'submitDate',
    ])
  })
  it('changes only source quick-status URL keys without adding defaults', () => {
    expect(toClaimRequestQuickStatusSearch({}, 'ALL')).toEqual({
      quickStatus: 'ALL',
    })
    const previous = {
      features: 'tickets',
      page: '4',
      status: ['PAID'],
      extPaymentDate: 'Y',
      extPaymentDate__neq: 'N',
      size: '80',
      sort: 'amount',
      direction: 'desc',
      specialDiseases: ['VIP'],
    }
    expect(toClaimRequestQuickStatusSearch(previous, 'ALL')).toEqual({
      size: '80',
      sort: 'amount',
      direction: 'desc',
      specialDiseases: ['VIP'],
      quickStatus: 'ALL',
    })
    expect(previous.page).toBe('4')
  })
})
