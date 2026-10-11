// @vitest-environment jsdom
import { Form } from '@iap/forms'
import { cleanup, render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AgentClaimRequestInquiryNationalCodeFormField } from './agent-claim-request-inquiry-national-code-form-field'

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

function TestWrapper({
  selectedUserDisplayName,
}: {
  selectedUserDisplayName?: string
}) {
  const form = useForm({
    defaultValues: {
      inquiryNationalCode: '0123456789',
    },
  })

  return (
    <Form {...form}>
      <AgentClaimRequestInquiryNationalCodeFormField
        selectedUserDisplayName={selectedUserDisplayName}
      />
    </Form>
  )
}

describe('AgentClaimRequestInquiryNationalCodeFormField', () => {
  afterEach(cleanup)

  it('renders input, label and support feature button', () => {
    render(<TestWrapper />)

    expect(
      screen.getByText('agent.claimRequests.create.fields.inquiryNationalCode')
    ).toBeDefined()
    expect(screen.getByTestId('support-btn').textContent).toBe(
      'help_nationalCode'
    )
    const input = screen.getByPlaceholderText(
      'agent.claimRequests.create.fields.inquiryNationalCodePlaceholder'
    ) as HTMLInputElement
    expect(input).toBeDefined()
    expect(input.value).toBe('0123456789')
  })

  it('renders selected user display name when provided', () => {
    render(<TestWrapper selectedUserDisplayName='Reza Ahmadi' />)

    expect(
      screen.getByText(
        'agent.claimRequests.create.fields.selectedNationalCode:'
      )
    ).toBeDefined()
    expect(screen.getByText('Reza Ahmadi')).toBeDefined()
  })
})
