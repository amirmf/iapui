import type { ComponentProps } from 'react'
import { useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { RepetitiveResponseTextarea } from './repetitive-response-textarea'

const getPageFull = vi.hoisted(() => vi.fn())

vi.mock(
  '@features/repetitive-responses/services/repetitive-response-service',
  () => ({ repetitiveResponseService: { getPageFull } })
)

vi.mock('@shared/i18n/i18n', () => ({
  useTranslate: () => ({
    t: (key: string, options?: { count?: number; defaultValue?: string }) => {
      if (key === 'claimRequests.dialog.repetitiveResponses.queryTooShort') {
        return `برای جستجو حداقل ${options?.count} کاراکتر وارد کنید.`
      }

      return options?.defaultValue ?? key
    },
  }),
}))

function TextareaHarness(
  props: Partial<ComponentProps<typeof RepetitiveResponseTextarea>>
) {
  const [value, setValue] = useState(props.value ?? '')
  const { onValueChange, ...textareaProps } = props

  return (
    <RepetitiveResponseTextarea
      {...textareaProps}
      onValueChange={(nextValue) => {
        setValue(nextValue)
        onValueChange?.(nextValue)
      }}
      value={value}
    />
  )
}

function renderTextarea(
  props: Partial<ComponentProps<typeof RepetitiveResponseTextarea>> = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <TextareaHarness {...props} />
    </QueryClientProvider>
  )
}

describe('RepetitiveResponseTextarea', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('does not search before three focused characters and explains the threshold', async () => {
    renderTextarea()

    const textarea = screen.getByRole('textbox')
    textarea.focus()
    fireEvent.input(textarea, { target: { value: 'دو' } })

    expect(getPageFull).not.toHaveBeenCalled()
    expect(
      screen.getByText('برای جستجو حداقل 3 کاراکتر وارد کنید.')
    ).toBeTruthy()
  })

  it('searches after the 700ms debounce and applies the selected saved response', async () => {
    const onValueChange = vi.fn()
    getPageFull.mockResolvedValue({
      content: [
        {
          description: 'پاسخ ذخیره‌شده',
          id: '550e8400-e29b-41d4-a716-446655440000',
          repetitiveResponseGroupId: '550e8400-e29b-41d4-a716-446655440001',
          seqNum: 1,
          title: 'عنوان',
          usageCount: 1,
        },
      ],
    })
    vi.useFakeTimers()
    renderTextarea({ onValueChange })

    const textarea = screen.getByRole('textbox')
    textarea.focus()
    fireEvent.input(textarea, { target: { value: 'پاس' } })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(700)
    })

    expect(getPageFull).toHaveBeenCalledWith({
      filters: { description: 'پاس' },
      page: 0,
      signal: expect.any(AbortSignal),
      size: 20,
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0)
    })
    fireEvent.click(screen.getByRole('button', { name: 'پاسخ ذخیره‌شده' }))

    expect(onValueChange).toHaveBeenLastCalledWith('پاسخ ذخیره‌شده')
    expect(screen.queryByRole('button', { name: 'پاسخ ذخیره‌شده' })).toBeNull()
  })
})
