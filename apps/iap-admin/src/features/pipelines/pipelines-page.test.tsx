import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PipelinesPage } from './pages/pipelines-page'
import pipelineService from './services/pipeline-service'

const toast = vi.hoisted(() => ({
  error: vi.fn(),
  success: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast,
}))

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>()
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, options?: { jobName?: string }) => {
        if (options?.jobName) return `${key}:${options.jobName}`
        return key
      },
    }),
  }
})

vi.mock('./services/pipeline-service', () => ({
  default: {
    getExecutions: vi.fn(),
    getJobs: vi.fn(),
    restart: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  },
  pipelineService: {
    getExecutions: vi.fn(),
    getJobs: vi.fn(),
    restart: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  },
}))

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <PipelinesPage />
    </QueryClientProvider>
  )
}

describe('PipelinesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    )
    vi.mocked(pipelineService.getJobs).mockResolvedValue([])
    vi.mocked(pipelineService.getExecutions).mockResolvedValue([])
    vi.mocked(pipelineService.start).mockResolvedValue({
      executionId: 1,
      status: 'STARTING',
    })
    vi.mocked(pipelineService.stop).mockResolvedValue(undefined)
    vi.mocked(pipelineService.restart).mockResolvedValue({
      executionId: 2,
      status: 'STARTING',
    })
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('renders page header and selects first job by default', async () => {
    vi.mocked(pipelineService.getJobs).mockResolvedValue([
      'job-billing',
      'job-reports',
    ])
    vi.mocked(pipelineService.getExecutions).mockResolvedValue([
      {
        executionId: 501,
        startTime: '2026-10-06T10:00:00Z',
        status: 'COMPLETED',
      },
    ])

    renderPage()

    expect(screen.getByText('pipelines.title')).toBeDefined()
    expect(screen.getByText('pipelines.actions.refresh')).toBeDefined()

    await waitFor(() => {
      expect(screen.getByText('job-billing')).toBeDefined()
      expect(screen.getByText('job-reports')).toBeDefined()
    })

    await waitFor(() => {
      expect(screen.getByText('501')).toBeDefined()
      expect(screen.getByText('COMPLETED')).toBeDefined()
    })
  })

  it('renders jobs error alert with retry button', async () => {
    vi.mocked(pipelineService.getJobs).mockRejectedValue(
      new Error('Jobs failed')
    )
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('pipelines.errors.jobs')).toBeDefined()
    })

    const retryButton = screen.getByRole('button', { name: /common\.retry/i })
    expect(retryButton).toBeDefined()
  })

  it('starts a job and triggers toast notification', async () => {
    const user = userEvent.setup()
    vi.mocked(pipelineService.getJobs).mockResolvedValue(['job-reporting'])
    vi.mocked(pipelineService.getExecutions).mockResolvedValue([])
    vi.mocked(pipelineService.start).mockResolvedValue({
      executionId: 601,
      status: 'STARTING',
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('job-reporting')).toBeDefined()
    })

    // Wait until selectedJobName is committed and executions section rendered
    expect(
      await screen.findByText('pipelines.executionsDescription:job-reporting')
    ).toBeDefined()

    const startButtons = await screen.findAllByRole('button', {
      name: /pipelines\.actions\.start/i,
    })
    await user.click(startButtons[0]!)

    await waitFor(() => {
      expect(pipelineService.start).toHaveBeenCalledWith(
        { jobName: 'job-reporting' },
        expect.anything()
      )
      expect(toast.success).toHaveBeenCalledWith('pipelines.messages.started')
    })
  })

  it('stops an execution through confirm dialog', async () => {
    const user = userEvent.setup()
    vi.mocked(pipelineService.getJobs).mockResolvedValue(['job-billing'])
    vi.mocked(pipelineService.getExecutions).mockResolvedValue([
      {
        executionId: 701,
        status: 'STARTED',
      },
    ])
    vi.mocked(pipelineService.stop).mockResolvedValue(undefined)

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('701')).toBeDefined()
    })

    const stopButtons = screen.getAllByRole('button', {
      name: /pipelines\.actions\.stop/i,
    })
    await user.click(stopButtons[0]!)

    // Confirm dialog should appear
    expect(await screen.findByText('pipelines.stopDialog.title')).toBeDefined()
    expect(screen.getByText('pipelines.stopDialog.description')).toBeDefined()

    // Click confirm inside dialog
    const alertDialog = screen.getByRole('alertdialog')
    const confirmButtonsInDialog = within(alertDialog).getAllByRole('button', {
      name: /pipelines\.actions\.stop/i,
    })
    await user.click(confirmButtonsInDialog[0]!)

    await waitFor(() => {
      expect(pipelineService.stop).toHaveBeenCalledWith(
        { executionId: 701 },
        expect.anything()
      )
      expect(toast.success).toHaveBeenCalledWith('pipelines.messages.stopped')
    })
  })

  it('restarts an execution and shows toast', async () => {
    const user = userEvent.setup()
    vi.mocked(pipelineService.getJobs).mockResolvedValue(['job-billing'])
    vi.mocked(pipelineService.getExecutions).mockResolvedValue([
      {
        executionId: 801,
        status: 'STOPPED',
      },
    ])
    vi.mocked(pipelineService.restart).mockResolvedValue({
      executionId: 802,
      status: 'STARTING',
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('801')).toBeDefined()
    })

    const restartButtons = screen.getAllByRole('button', {
      name: /pipelines\.actions\.restart/i,
    })
    await user.click(restartButtons[0]!)

    await waitFor(() => {
      expect(pipelineService.restart).toHaveBeenCalledWith(
        { executionId: 801 },
        expect.anything()
      )
      expect(toast.success).toHaveBeenCalledWith('pipelines.messages.restarted')
    })
  })
})
