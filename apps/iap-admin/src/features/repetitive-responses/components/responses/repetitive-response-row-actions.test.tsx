import type { ReactNode } from 'react'

import { useRepetitiveResponseStore } from '@features/repetitive-responses/model/repetitive-response-store'
import { i18nReady } from '@shared/i18n/i18n'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { RepetitiveResponseRowActions } from './repetitive-response-row-actions'

vi.mock('@shared/tables', () => ({
  TableActionButton: ({
    label,
    onClick,
  }: {
    label: string
    onClick: () => void
  }) => (
    <button onClick={onClick} type='button'>
      {label}
    </button>
  ),
  TableActions: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}))

const response = {
  description: 'متن پاسخ',
  id: '550e8400-e29b-41d4-a716-446655440000',
  repetitiveResponseGroupId: '550e8400-e29b-41d4-a716-446655440001',
  seqNum: 1,
  title: 'پاسخ',
  usageCount: 2,
}

describe('RepetitiveResponseRowActions', () => {
  beforeAll(async () => {
    await i18nReady
  })

  beforeEach(() => {
    useRepetitiveResponseStore.getState().reset()
  })

  it('stores the source row before opening each reference action', () => {
    render(
      <RepetitiveResponseRowActions row={{ original: response } as never} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'مشاهده جزئیات' }))
    expect(useRepetitiveResponseStore.getState()).toMatchObject({
      currentResponseRow: response,
      responseOpen: 'view',
    })

    fireEvent.click(screen.getByRole('button', { name: 'ویرایش پاسخ تکراری' }))
    expect(useRepetitiveResponseStore.getState()).toMatchObject({
      currentResponseRow: response,
      responseOpen: 'edit',
    })
  })
})
