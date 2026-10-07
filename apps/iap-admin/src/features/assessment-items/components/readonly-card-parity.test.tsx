// @vitest-environment jsdom
import { TooltipProvider } from '@iap/ui'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import AssessmentItemCard from './assessment-item-card'
import AssessmentItemCardRowData from './assessment-item-card-row-data'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('@iap/ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@iap/ui')>()),
  LongText: (props: { children: React.ReactNode }) => (
    <div>{props.children}</div>
  ),
}))
afterEach(cleanup)
it('renders readonly floating coverage, adjustment and calculation information', () => {
  render(
    <TooltipProvider>
      <AssessmentItemCard
        deleteAccess={false}
        adjustmentAccess={false}
        mode='readonly'
        overrideInsuredPerson={{
          id: 7,
          fullName: 'Person',
          nationalCode: '123',
        }}
        item={{
          damageCode: { code: 'D1', title: 'Damage' },
          overrideInsuredPersonId: 7,
          description: 'Description',
          claimRequestAdjustment: { status: 'PAID', amount: 90 },
        }}
        fanavaranCalculationResult={[
          { approvedAmount: 100, franchise: 20, totalAmount: 80 },
        ]}
      />
    </TooltipProvider>
  )
  expect(screen.getByText('Person (123)')).toBeTruthy()
  expect(
    screen.getByText('assessmentItems.adjustment.status.paid')
  ).toBeTruthy()
  expect(screen.getByText('assessmentItems.fanavarnCalc.title')).toBeTruthy()
  expect(screen.getByText('Description')).toBeTruthy()
  expect(screen.queryByRole('button')).toBeNull()
})
it('omits absent amounts and translates the source jaw-quarter value', () => {
  render(<AssessmentItemCardRowData quantity={0} toothNumbers={[901]} />)
  expect(
    screen.queryByText('assessmentItems.dialog.fields.amountPaid')
  ).toBeNull()
  expect(
    screen.getByText(
      'assessmentItems.dialog.toothAssessment.fields.jawQuarters.901'
    )
  ).toBeTruthy()
  expect(screen.getByText('(1عدد)')).toBeTruthy()
})
