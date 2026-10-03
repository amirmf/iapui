import { i18nReady } from '@shared/i18n/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { RepetitiveResponseGroupFormDialog } from './repetitive-response-group-form-dialog'

vi.mock(
  '@features/repetitive-responses/services/repetitive-response-group-service',
  () => ({
    repetitiveResponseGroupService: {
      create: vi.fn(),
      update: vi.fn(),
    },
  })
)

function renderDialog(title: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <RepetitiveResponseGroupFormDialog
        currentRow={{ id: 'group-id', seqNum: 1, title }}
        onOpenChange={vi.fn()}
        open
      />
    </QueryClientProvider>
  )
}

describe('RepetitiveResponseGroupFormDialog', () => {
  beforeAll(async () => {
    await i18nReady
  })

  it('resets field values when the selected group changes while the dialog is open', () => {
    const view = renderDialog('گروه اول')

    view.rerender(
      <QueryClientProvider client={new QueryClient()}>
        <RepetitiveResponseGroupFormDialog
          currentRow={{ id: 'group-id-2', seqNum: 2, title: 'گروه دوم' }}
          onOpenChange={vi.fn()}
          open
        />
      </QueryClientProvider>
    )

    expect((screen.getByLabelText('عنوان') as HTMLInputElement).value).toBe(
      'گروه دوم'
    )
    expect(
      (screen.getByLabelText('شماره ترتیب') as HTMLInputElement).value
    ).toBe('2')
  })
})
