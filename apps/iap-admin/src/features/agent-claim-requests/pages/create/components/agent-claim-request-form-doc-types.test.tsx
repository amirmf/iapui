// @vitest-environment jsdom
import { Form } from '@iap/forms'
import { cleanup, render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AgentClaimRequestFormDocTypes } from './agent-claim-request-form-doc-types'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@modules/doc-types', () => ({
  useDocTypesData: () => ({
    data: [
      {
        id: '1',
        docType: 'Dental',
        docTypeCode: 'DENT',
        documentGuide: 'Guide 1',
      },
      {
        id: '2',
        docType: 'Others',
        docTypeCode: 'others',
        documentGuide: 'Guide 2',
      },
    ],
    isLoading: false,
  }),
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
      <div data-testid='doc-types-select'>
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

function TestWrapper() {
  const form = useForm({
    defaultValues: {
      docType: { id: '', docType: '', docTypeCode: '', documentGuide: '' },
    },
  })

  return (
    <Form {...form}>
      <AgentClaimRequestFormDocTypes />
    </Form>
  )
}

describe('AgentClaimRequestFormDocTypes', () => {
  afterEach(cleanup)

  it('renders doc types field with items and placeholder', () => {
    render(<TestWrapper />)

    expect(
      screen.getByText('claimRequests.dialog.fields.docType')
    ).toBeDefined()
    expect(
      screen.getByText('claimRequests.dialog.fields.selectDocType')
    ).toBeDefined()
    expect(screen.getByText('Dental')).toBeDefined()
    expect(screen.getByText('Others')).toBeDefined()
  })
})
