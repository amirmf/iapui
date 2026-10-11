import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ImageZoomPanViewer from './image-zoom-pan-viewer'
import { DEFAULT_IMAGE_VIEW_STATE } from './use-image-viewer-state'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
)

afterEach(cleanup)

describe('source image toolbar tooltip composition', () => {
  it('mounts outside a global tooltip provider and opens its source tooltip immediately', async () => {
    render(
      <ImageZoomPanViewer
        src='blob:test-image'
        alt='scan.jpg'
        viewKey='scan'
        viewState={DEFAULT_IMAGE_VIEW_STATE}
        onViewStateChange={vi.fn()}
        onLatestTransformChange={vi.fn()}
        onRotate={vi.fn()}
      />
    )
    const button = screen.getByRole('button', {
      name: 'files.viewer.actions.zoomIn',
    })
    expect(screen.getAllByRole('button')).toHaveLength(6)
    fireEvent.focus(button)
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeTruthy())
    expect(screen.getByRole('tooltip').textContent).toBe(
      'files.viewer.actions.zoomIn'
    )
  })
})
