import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PipelineExecutionsTable } from './pipeline-executions-table'

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>()
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  }
})

describe('PipelineExecutionsTable', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })
  it('renders loading state', () => {
    render(
      <PipelineExecutionsTable
        executions={[]}
        isError={false}
        isLoading={true}
        onRestart={vi.fn()}
        onRetry={vi.fn()}
        onStop={vi.fn()}
        pendingExecutionId={null}
      />
    )
    expect(screen.getByText('pipelines.loadingExecutions')).toBeDefined()
  })

  it('renders error state with retry button', async () => {
    const user = userEvent.setup()
    const handleRetry = vi.fn()

    render(
      <PipelineExecutionsTable
        executions={[]}
        isError={true}
        isLoading={false}
        onRestart={vi.fn()}
        onRetry={handleRetry}
        onStop={vi.fn()}
        pendingExecutionId={null}
      />
    )

    expect(screen.getByText('pipelines.errors.executions')).toBeDefined()
    const retryButton = screen.getByRole('button', { name: /common\.retry/i })
    await user.click(retryButton)
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  it('renders empty state when no executions are present', () => {
    render(
      <PipelineExecutionsTable
        executions={[]}
        isError={false}
        isLoading={false}
        onRestart={vi.fn()}
        onRetry={vi.fn()}
        onStop={vi.fn()}
        pendingExecutionId={null}
      />
    )
    expect(screen.getByText('pipelines.emptyExecutions')).toBeDefined()
  })

  it('renders execution rows with badges, dates, and actions', async () => {
    const user = userEvent.setup()
    const handleStop = vi.fn()
    const handleRestart = vi.fn()

    const executions = [
      {
        endTime: '2026-10-06T12:00:00Z',
        executionId: 101,
        startTime: '2026-10-06T10:00:00Z',
        status: 'COMPLETED',
      },
      {
        id: 102,
        startedAt: '2026-10-06T13:00:00Z',
        status: 'FAILED',
      },
    ]

    render(
      <PipelineExecutionsTable
        executions={executions}
        isError={false}
        isLoading={false}
        onRestart={handleRestart}
        onRetry={vi.fn()}
        onStop={handleStop}
        pendingExecutionId={102}
      />
    )

    expect(screen.getByText('101')).toBeDefined()
    expect(screen.getByText('102')).toBeDefined()
    expect(screen.getByText('COMPLETED')).toBeDefined()
    expect(screen.getByText('FAILED')).toBeDefined()

    const stopButtons = screen.getAllByRole('button', {
      name: /pipelines\.actions\.stop/i,
    })
    const restartButtons = screen.getAllByRole('button', {
      name: /pipelines\.actions\.restart/i,
    })

    expect((stopButtons[0] as HTMLButtonElement).disabled).toBe(false)
    expect((stopButtons[1] as HTMLButtonElement).disabled).toBe(true) // pendingExecutionId === 102

    expect((restartButtons[0] as HTMLButtonElement).disabled).toBe(false)
    expect((restartButtons[1] as HTMLButtonElement).disabled).toBe(true)

    await user.click(stopButtons[0])
    expect(handleStop).toHaveBeenCalledWith(101)

    await user.click(restartButtons[0])
    expect(handleRestart).toHaveBeenCalledWith(101)
  })
})
