import { useEffect, useMemo, useState } from 'react'

import { Button } from '@iap/ui'
import { Main } from '@shared/components/layout/main'
import { IconRefresh } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { ConfirmDialog } from '../components/confirm-dialog'
import { PipelineExecutionsTable } from '../components/pipeline-executions-table'
import { PipelineJobsTable } from '../components/pipeline-jobs-table'
import {
  pipelineQueryKeys,
  usePipelineExecutions,
  usePipelineJobs,
} from '../hooks/use-pipelines'
import pipelineService from '../services/pipeline-service'

export default function PipelinesPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [selectedJobName, setSelectedJobName] = useState<string | null>(null)
  const [executionToStop, setExecutionToStop] = useState<number | null>(null)
  const jobsQuery = usePipelineJobs()
  const executionsQuery = usePipelineExecutions(selectedJobName)
  const jobs = useMemo(() => jobsQuery.data ?? [], [jobsQuery.data])

  useEffect(() => {
    if (selectedJobName && jobs.includes(selectedJobName)) return
    setSelectedJobName(jobs[0] ?? null)
  }, [jobs, selectedJobName])

  const invalidatePipelines = async () => {
    await queryClient.invalidateQueries({ queryKey: pipelineQueryKeys.all })
  }

  const startMutation = useMutation({
    mutationFn: pipelineService.start,
    onSuccess: async () => {
      await invalidatePipelines()
      toast.success(t('pipelines.messages.started'))
    },
  })

  const stopMutation = useMutation({
    mutationFn: pipelineService.stop,
    onSuccess: async () => {
      await invalidatePipelines()
      setExecutionToStop(null)
      toast.success(t('pipelines.messages.stopped'))
    },
  })

  const restartMutation = useMutation({
    mutationFn: pipelineService.restart,
    onSuccess: async () => {
      await invalidatePipelines()
      toast.success(t('pipelines.messages.restarted'))
    },
  })

  const isRefreshing = jobsQuery.isFetching || executionsQuery.isFetching
  const pendingExecutionId = stopMutation.isPending
    ? (stopMutation.variables?.executionId ?? null)
    : restartMutation.isPending
      ? (restartMutation.variables?.executionId ?? null)
      : null

  return (
    <Main>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h2 className='text-xl font-bold tracking-tight'>
            {t('pipelines.title')}
          </h2>
        </div>
        <Button
          className='gap-2'
          disabled={isRefreshing}
          onClick={() => {
            void jobsQuery.refetch()
            if (selectedJobName) void executionsQuery.refetch()
          }}
          type='button'
          variant='outline'
        >
          <IconRefresh
            aria-hidden='true'
            className={isRefreshing ? 'size-4 animate-spin' : 'size-4'}
          />
          {t('pipelines.actions.refresh')}
        </Button>
      </div>

      {jobsQuery.isError ? (
        <div
          className='mb-4 flex items-center gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive'
          role='alert'
        >
          <span>{t('pipelines.errors.jobs')}</span>
          <Button
            onClick={() => jobsQuery.refetch()}
            size='sm'
            type='button'
            variant='outline'
          >
            {t('common.retry')}
          </Button>
        </div>
      ) : null}

      <section aria-labelledby='pipeline-jobs-title' className='mb-10'>
        <div className='mb-6'>
          <h3 className='text-lg font-semibold' id='pipeline-jobs-title'>
            {t('pipelines.jobsTitle')}
          </h3>
        </div>
        <div className='-mx-4 overflow-auto px-4 py-1'>
          <PipelineJobsTable
            isLoading={jobsQuery.isLoading}
            jobs={jobs}
            onSelect={setSelectedJobName}
            onStart={(jobName) => startMutation.mutate({ jobName })}
            pendingJobName={
              startMutation.isPending
                ? (startMutation.variables?.jobName ?? null)
                : null
            }
            selectedJobName={selectedJobName}
          />
        </div>
      </section>

      <section aria-labelledby='pipeline-executions-title'>
        <div className='mb-6'>
          <h3 className='text-lg font-semibold' id='pipeline-executions-title'>
            {t('pipelines.executionsTitle')}
          </h3>
          <p className='text-sm text-muted-foreground'>
            {selectedJobName
              ? t('pipelines.executionsDescription', {
                  jobName: selectedJobName,
                })
              : t('pipelines.selectJob')}
          </p>
        </div>
        {selectedJobName ? (
          <div className='-mx-4 overflow-auto px-4 py-1'>
            <PipelineExecutionsTable
              executions={executionsQuery.data ?? []}
              isError={executionsQuery.isError}
              isLoading={executionsQuery.isLoading}
              onRestart={(executionId) =>
                restartMutation.mutate({ executionId })
              }
              onRetry={() => executionsQuery.refetch()}
              onStop={setExecutionToStop}
              pendingExecutionId={pendingExecutionId}
            />
          </div>
        ) : null}
      </section>

      <ConfirmDialog
        confirmText={t('pipelines.actions.stop')}
        desc={t('pipelines.stopDialog.description')}
        destructive
        handleConfirm={() => {
          if (executionToStop !== null) {
            stopMutation.mutate({ executionId: executionToStop })
          }
        }}
        isLoading={stopMutation.isPending}
        onOpenChange={(open) => !open && setExecutionToStop(null)}
        open={executionToStop !== null}
        title={t('pipelines.stopDialog.title')}
      />
    </Main>
  )
}

export { PipelinesPage }
