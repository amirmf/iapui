import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PipelineJobsTable } from './pipeline-jobs-table'

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>()
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  }
})

describe('PipelineJobsTable', () => {
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
      <PipelineJobsTable
        isLoading={true}
        jobs={[]}
        onSelect={vi.fn()}
        onStart={vi.fn()}
        pendingJobName={null}
        selectedJobName={null}
      />
    )
    expect(screen.getByText('pipelines.loadingJobs')).toBeDefined()
  })

  it('renders empty state when no jobs available', () => {
    render(
      <PipelineJobsTable
        isLoading={false}
        jobs={[]}
        onSelect={vi.fn()}
        onStart={vi.fn()}
        pendingJobName={null}
        selectedJobName={null}
      />
    )
    expect(screen.getByText('pipelines.emptyJobs')).toBeDefined()
  })

  it('renders jobs list and handles onSelect and onStart', async () => {
    const user = userEvent.setup()
    const handleSelect = vi.fn()
    const handleStart = vi.fn()

    render(
      <PipelineJobsTable
        isLoading={false}
        jobs={['job-alpha', 'job-beta']}
        onSelect={handleSelect}
        onStart={handleStart}
        pendingJobName='job-beta'
        selectedJobName='job-alpha'
      />
    )

    expect(screen.getByText('job-alpha')).toBeDefined()
    expect(screen.getByText('job-beta')).toBeDefined()

    // Select second job
    await user.click(screen.getByText('job-beta'))
    expect(handleSelect).toHaveBeenCalledWith('job-beta')

    // Start buttons
    const startButtons = screen.getAllByRole('button', {
      name: /pipelines\.actions\.start/i,
    })
    expect(startButtons).toHaveLength(2)

    // First button enabled, second disabled (pendingJobName='job-beta')
    expect((startButtons[0] as HTMLButtonElement).disabled).toBe(false)
    expect((startButtons[1] as HTMLButtonElement).disabled).toBe(true)

    await user.click(startButtons[0])
    expect(handleStart).toHaveBeenCalledWith('job-alpha')
  })
})
