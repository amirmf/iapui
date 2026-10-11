// @vitest-environment jsdom
import { Form } from '@iap/forms'
import { cleanup, render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AgentClaimRequestExtPolicyIdFormField } from './agent-claim-request-ext-policy-id-form-field'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@iap/support', () => ({
  SupportFeatureButton: ({ featureKey }: { featureKey: string }) => (
    <span data-testid='support-btn'>{featureKey}</span>
  ),
}))

vi.mock('@iap/ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@iap/ui')>()
  return {
    ...actual,
    SearchableSelect: (props: {
      placeholder?: string
      items: Array<{ label: string; value: string }>
      value?: string
      isLoading?: boolean
    }) => (
      <div data-testid='searchable-select' data-loading={props.isLoading}>
        <span>{props.placeholder}</span>
        <span data-testid='selected-val'>{props.value}</span>
        <ul>
          {props.items.map((i) => (
            <li key={i.value}>{i.label}</li>
          ))}
        </ul>
      </div>
    ),
  }
})

function TestWrapper({
  policies,
  isInquiryLoading = false,
}: {
  policies?: Array<{ id: number; planId: number; title: string }>
  isInquiryLoading?: boolean
}) {
  const form = useForm({
    defaultValues: {
      extPolicyId: 0,
      extNationalCode: { id: 0, nationalCode: '', fullName: '' },
    },
  })

  return (
    <Form {...form}>
      <AgentClaimRequestExtPolicyIdFormField
        policies={policies}
        isInquiryLoading={isInquiryLoading}
      />
    </Form>
  )
}

describe('AgentClaimRequestExtPolicyIdFormField', () => {
  afterEach(cleanup)

  it('renders label, placeholder and support button', () => {
    render(<TestWrapper policies={[]} isInquiryLoading={false} />)

    expect(
      screen.getByText('claimRequests.dialog.fields.insurancePolicy')
    ).toBeDefined()
    expect(screen.getByTestId('support-btn').textContent).toBe(
      'help_insurancePolicy'
    )
    expect(
      screen.getByText('claimRequests.dialog.fields.selectInsurancePolicy')
    ).toBeDefined()
  })

  it('auto-selects first policy when policies are loaded and none was selected', () => {
    const policies = [
      { id: 101, planId: 1, title: 'Policy A' },
      { id: 102, planId: 2, title: 'Policy B' },
    ]

    render(<TestWrapper policies={policies} />)

    expect(screen.getByText('Policy A')).toBeDefined()
    expect(screen.getByText('Policy B')).toBeDefined()
    expect(screen.getByTestId('selected-val').textContent).toBe('101')
  })
})
