// @vitest-environment jsdom
import { act, createElement } from 'react'

import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { type Root, createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it } from 'vitest'

import { SupportFlowMessage } from './support-flow-message'

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true
window.scrollTo = () => undefined

let container: HTMLDivElement | undefined
let root: Root | undefined

afterEach(() => {
  act(() => root?.unmount())
  container?.remove()
  container = undefined
  root = undefined
})

async function renderSupportFlowMessage(message: string) {
  const rootRoute = createRootRoute({ component: Outlet })
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => createElement(SupportFlowMessage, { message }),
  })
  const internalRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'internal',
    component: () => createElement('div', undefined, 'Internal page'),
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, internalRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })

  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)

  await router.load()
  act(() => {
    root?.render(createElement(RouterProvider, { router }))
  })

  return router
}

describe('SupportFlowMessage', () => {
  it('renders GitHub-Flavored Markdown as safe React content', () => {
    const markup = renderToStaticMarkup(
      createElement(SupportFlowMessage, {
        message:
          '# Status\n\n**Approved**\n\n- First\n- Second\n\n| Claim | State |\n| --- | --- |\n| 1 | Open |\n\n![Logo](https://example.com/logo.png)',
      })
    )

    expect(markup).toContain('<h1')
    expect(markup).toContain('<strong>Approved</strong>')
    expect(markup).toContain('<ul')
    expect(markup).toContain('<table')
    expect(markup).toContain('src="https://example.com/logo.png"')
  })

  it('accepts HTTPS links', () => {
    const markup = renderToStaticMarkup(
      createElement(SupportFlowMessage, {
        message: '[Claim details](https://example.com/claims/1)',
      })
    )

    expect(markup).toContain('href="https://example.com/claims/1"')
  })

  it('renders only validated editor color spans', () => {
    const markup = renderToStaticMarkup(
      createElement(SupportFlowMessage, {
        message:
          '<span style="color: #1d4ed8; background-color: #fef3c7">Approved</span>',
      })
    )

    expect(markup).toContain('color:#1d4ed8')
    expect(markup).toContain('background-color:#fef3c7')
    expect(markup).toContain('Approved')
  })

  it('preserves HTTP(S) links inside validated editor color spans', () => {
    const markup = renderToStaticMarkup(
      createElement(SupportFlowMessage, {
        message:
          '<span style="color: #1d4ed8">[Claim details](https://example.com/claims/1)</span>',
      })
    )

    expect(markup).toContain('color:#1d4ed8')
    expect(markup).toContain('href="https://example.com/claims/1"')
    expect(markup).toContain('Claim details')
  })

  it('preserves a link label and combined bold and italic marks from Tiptap', () => {
    const markup = renderToStaticMarkup(
      createElement(SupportFlowMessage, {
        message:
          '[<span style="color: #1d4ed8">***Claim details***</span>](https://example.com/claims/1)',
      })
    )

    expect(markup).toContain('color:#1d4ed8')
    expect(markup).toContain('href="https://example.com/claims/1"')
    expect(markup).toContain('<strong>Claim details</strong>')
    expect(markup).toContain('<em><strong>Claim details</strong></em>')
  })

  it('renders the current editor text-style syntax', () => {
    const markup = renderToStaticMarkup(
      createElement(SupportFlowMessage, {
        message:
          '[{{tiptap-style:color=%231d4ed8|***Claim details***}}](https://example.com/claims/1)',
      })
    )

    expect(markup).toContain('color:#1d4ed8')
    expect(markup).toContain('href="https://example.com/claims/1"')
    expect(markup).toContain('<em><strong>Claim details</strong></em>')
  })

  it('does not render raw HTML or non-HTTP(S) URLs', () => {
    const markup = renderToStaticMarkup(
      createElement(SupportFlowMessage, {
        message:
          '<img src=x onerror="alert(1)">\n\n[JavaScript](javascript:alert(1))\n\n[Mail](mailto:support@example.com)\n\n[FTP](ftp://example.com)\n\n![Unsafe](data:image/png;base64,AAAA)',
      })
    )

    expect(markup).not.toContain('onerror')
    expect(markup).not.toContain('javascript:')
    expect(markup).not.toContain('mailto:')
    expect(markup).not.toContain('ftp:')
    expect(markup).not.toContain('data:image')
    expect(markup).not.toContain('<img')
  })

  it('does not render unrecognized color spans or arbitrary raw HTML', () => {
    const markup = renderToStaticMarkup(
      createElement(SupportFlowMessage, {
        message:
          '<span style="color: red">Unsafe</span>\n\n<iframe src="https://example.com"></iframe>',
      })
    )

    expect(markup).not.toContain('color:red')
    expect(markup).not.toContain('<span')
    expect(markup).not.toContain('<iframe')
  })

  it('renders soft line breaks as visible line breaks', async () => {
    await renderSupportFlowMessage('First line\nSecond line')

    expect(container?.querySelectorAll('br')).toHaveLength(1)
  })

  it('uses router navigation for internal links', async () => {
    const router = await renderSupportFlowMessage(
      '[Open internal page](/internal)'
    )
    const link = container?.querySelector<HTMLAnchorElement>(
      'a[href="/internal"]'
    )

    expect(link).toBeDefined()
    await act(async () => {
      link?.click()
      await router.load()
    })

    expect(router.state.location.pathname).toBe('/internal')
  })

  it('keeps external links as safe new-tab anchors', async () => {
    await renderSupportFlowMessage('[Open documentation](https://example.com)')
    const link = container?.querySelector<HTMLAnchorElement>(
      'a[href="https://example.com/"]'
    )

    expect(link?.target).toBe('_blank')
    expect(link?.rel).toBe('noreferrer')
  })
})
