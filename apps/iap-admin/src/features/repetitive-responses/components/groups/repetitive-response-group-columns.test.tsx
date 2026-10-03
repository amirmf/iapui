import { i18nReady } from '@shared/i18n/i18n'
import { renderHook } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'

import { useRepetitiveResponseGroupColumns } from './repetitive-response-group-columns'

describe('useRepetitiveResponseGroupColumns', () => {
  beforeAll(async () => {
    await i18nReady
  })

  it('keeps the reference sticky action-column width metadata', () => {
    const { result } = renderHook(() => useRepetitiveResponseGroupColumns())
    const actionColumn = result.current.find(
      (column) => column.id === 'actions'
    )

    expect(actionColumn?.meta).toMatchObject({
      className: 'sticky left-0 bg-background max-w-22 w-22',
    })
  })
})
