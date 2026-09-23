import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

class ResizeObserverMock {
  disconnect() {}
  observe() {}
  unobserve() {}
}

globalThis.ResizeObserver = ResizeObserverMock
HTMLElement.prototype.scrollIntoView = () => {}

afterEach(() => {
  cleanup()
  document.body.removeAttribute('style')
})
