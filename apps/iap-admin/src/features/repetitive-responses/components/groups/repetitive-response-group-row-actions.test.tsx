import type { ReactNode } from 'react'

import { useRepetitiveResponseStore } from '@features/repetitive-responses/context/store/repetitive-response-store'
import { i18nReady } from '@shared/i18n/i18n'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { RepetitiveResponseGroupRowActions } from './repetitive-response-group-row-actions'

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

const group = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  seqNum: 1,
  title: 'پاسخ‌های پیگیری',
}

describe('RepetitiveResponseGroupRowActions', () => {
  beforeAll(async () => {
    await i18nReady
  })

  beforeEach(() => {
    useRepetitiveResponseStore.getState().reset()
  })

  it('stores the source group before opening each reference action', () => {
    render(
      <RepetitiveResponseGroupRowActions row={{ original: group } as never} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'مشاهده جزئیات' }))
    expect(useRepetitiveResponseStore.getState()).toMatchObject({
      currentGroupRow: group,
      groupOpen: 'view',
    })

    fireEvent.click(screen.getByRole('button', { name: 'ویرایش گروه' }))
    expect(useRepetitiveResponseStore.getState()).toMatchObject({
      currentGroupRow: group,
      groupOpen: 'edit',
    })
  })
})
