// @vitest-environment jsdom
import {
  type AssessmentItemFormType,
  assessmentItemFormSchema,
} from '@features/assessment-items/model/assessment-item-form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@iap/forms'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { useForm, useWatch } from 'react-hook-form'
import { afterEach, expect, it, vi } from 'vitest'

import AssessmentItemsFormAmountItem from './assessment-items-form-amount-item'
import AssessmentItemsFormTooth from './assessment-items-form-tooth'

vi.mock('@shared/i18n/i18n', () => ({
  useTranslate: () => ({ t: (key: string) => key, i18n: { dir: () => 'rtl' } }),
}))
vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { dir: () => 'rtl' },
  }),
}))
Object.assign(globalThis, {
  ResizeObserver: class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
})
afterEach(cleanup)
function TestForm() {
  const methods = useForm<AssessmentItemFormType>({
    resolver: zodResolver(assessmentItemFormSchema((key) => key)),
    defaultValues: {
      claimRequestId: 'claim',
      damageCode: {
        id: '00000000-0000-4000-8000-000000000001',
        isDentalService: 1,
      },
      amountItem: '10000',
      quantity: '1',
      estimatedAmount: 10000,
      status: 'APPROVED',
      toothType: 'PERMANENT',
      toothNumbers: [906],
    },
  })
  const teeth = useWatch({ control: methods.control, name: 'toothNumbers' })
  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(() => undefined)}>
        <AssessmentItemsFormAmountItem />
        <AssessmentItemsFormTooth />
        <output aria-label='selected teeth'>{JSON.stringify(teeth)}</output>
        <button type='submit'>submit</button>
      </form>
    </Form>
  )
}
it('switches tooth modes and clears jaw selection through real form context', async () => {
  render(<TestForm />)
  expect(screen.getByLabelText('selected teeth').textContent).toBe('[906]')
  fireEvent.click(screen.getByRole('button', { name: 'tooth 21' }))
  expect(screen.getByLabelText('selected teeth').textContent).toBe('[21]')
  fireEvent.click(screen.getByRole('button', { name: 'tooth 21' }))
  expect(screen.getByLabelText('selected teeth').textContent).toBe('[]')
  fireEvent.click(screen.getByRole('button', { name: 'tooth 906' }))
  expect(screen.getByLabelText('selected teeth').textContent).toBe('[906]')
  fireEvent.click(
    screen.getByRole('radio', {
      name: 'assessmentItems.dialog.toothAssessment.fields.toothTypes.deciduous',
    })
  )
  await waitFor(() =>
    expect(screen.getByLabelText('selected teeth').textContent).toBe('[]')
  )
  expect(screen.queryByRole('button', { name: 'tooth 906' })).toBeNull()
  expect(screen.getByRole('button', { name: 'tooth 61' })).toBeTruthy()
})
it('renders amount validation with shared accessible field errors', async () => {
  render(<TestForm />)
  const input = screen.getByLabelText(
    'assessmentItems.dialog.fields.amountItem'
  )
  fireEvent.change(input, { target: { value: '9999' } })
  fireEvent.click(screen.getByRole('button', { name: 'submit' }))
  await waitFor(() =>
    expect(
      screen.getByText('assessmentItems.validation.amountItemMin')
    ).toBeTruthy()
  )
  expect(input.getAttribute('aria-invalid')).toBe('true')
  expect(input.getAttribute('aria-describedby')).toContain('form-item-message')
})
