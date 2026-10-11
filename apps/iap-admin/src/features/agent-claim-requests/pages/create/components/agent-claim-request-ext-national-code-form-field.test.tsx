// @vitest-environment jsdom
import { Form } from '@iap/forms'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AgentClaimRequestExtNationalCodeFormField } from './agent-claim-request-ext-national-code-form-field'

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

vi.mock('../../../services/agent-claim-request-service', () => ({
  default: {
    getSubInsuredPeople: vi.fn().mockResolvedValue([
      {
        id: 1,
        nationalCode: '1111111111',
        fullName: 'Person A',
        isForeign: 'N',
      },
      {
        id: 2,
        nationalCode: '2222222222',
        fullName: 'Person B',
        isForeign: 'Y',
      },
    ]),
  },
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
      <div data-testid='sub-insured-select'>
        <span>{props.placeholder}</span>
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
  policyId = 101,
  inquiryNationalCode = '0123456789',
}: {
  policyId?: number
  inquiryNationalCode?: string
}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  const form = useForm({
    defaultValues: {
      extPolicyId: policyId,
      extNationalCode: { id: 0, nationalCode: '', fullName: '' },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <Form {...form}>
        <AgentClaimRequestExtNationalCodeFormField
          inquiryNationalCode={inquiryNationalCode}
        />
      </Form>
    </QueryClientProvider>
  )
}

describe('AgentClaimRequestExtNationalCodeFormField', () => {
  afterEach(cleanup)

  it('renders label, placeholder and support button', () => {
    render(<TestWrapper />)

    expect(
      screen.getByText('claimRequests.dialog.fields.subInsuredPerson')
    ).toBeDefined()
    expect(screen.getByTestId('support-btn').textContent).toBe(
      'help_extNationalCode'
    )
    expect(
      screen.getByText('claimRequests.dialog.fields.selectSubInsuredPerson')
    ).toBeDefined()
  })
})
