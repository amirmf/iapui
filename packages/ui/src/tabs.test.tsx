import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

function ExampleTabs() {
  return (
    <Tabs defaultValue='overview'>
      <TabsList aria-label='Policy details'>
        <TabsTrigger value='overview'>Overview</TabsTrigger>
        <TabsTrigger value='documents'>Documents</TabsTrigger>
        <TabsTrigger disabled value='history'>
          History
        </TabsTrigger>
      </TabsList>
      <TabsContent value='overview'>Overview panel</TabsContent>
      <TabsContent value='documents'>Documents panel</TabsContent>
      <TabsContent value='history'>History panel</TabsContent>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('renders accessible tab semantics and the active panel', () => {
    render(<ExampleTabs />)

    const overviewTab = screen.getByRole('tab', { name: 'Overview' })

    expect(screen.getByRole('tablist', { name: 'Policy details' })).toHaveClass(
      'overflow-x-auto'
    )
    expect(overviewTab).toHaveAttribute('aria-selected', 'true')
    expect(overviewTab).toHaveClass('data-[state=active]:bg-surface')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel')
  })

  it('supports pointer and keyboard tab selection', async () => {
    const user = userEvent.setup()
    render(<ExampleTabs />)

    await user.click(screen.getByRole('tab', { name: 'Documents' }))

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Documents panel')

    await user.keyboard('{ArrowLeft}')

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel')
  })

  it('preserves disabled semantics and a visible focus treatment', () => {
    render(<ExampleTabs />)

    expect(screen.getByRole('tab', { name: 'History' })).toBeDisabled()
    expect(screen.getByRole('tab', { name: 'Documents' })).toHaveClass(
      'focus-visible:ring-2',
      'disabled:opacity-50'
    )
  })
})
