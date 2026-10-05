import { useEffect, useMemo, useState } from 'react'

import { Button, Textarea } from '@iap/ui'
import { Bot, ChevronRight, RotateCcw, Send, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  optionsFromResponse,
  useSupportFlowStore,
} from './context/store/support-store'
import type { SupportFlowContext } from './model/support-flow-context'

type SupportWidgetProps = {
  context: SupportFlowContext
  position?: 'default' | 'admin'
}

export function SupportWidget({
  context,
  position = 'default',
}: SupportWidgetProps) {
  const { t: translate } = useTranslation()
  const t = translate as (key: string) => string
  const [value, setValue] = useState('')
  const {
    close,
    error,
    goBack,
    hasInitialQuestions,
    isLoading,
    isLoadingMore,
    isOpen,
    loadMore,
    open,
    reset,
    response,
    select,
    selected,
    submitText,
  } = useSupportFlowStore()

  useEffect(() => {
    void reset(context)
  }, [context, reset])

  const options = useMemo(() => optionsFromResponse(response), [response])
  const isTextInput = response?.response?.requiredParamInputDisplay === 'TEXT'

  if (!hasInitialQuestions && !isOpen) return null

  if (!isOpen)
    return (
      <Button
        aria-label={t('supportFlow.openLabel')}
        className={
          position === 'admin'
            ? 'fixed bottom-6 left-6 z-50 hidden min-h-12 gap-2 rounded-2xl md:flex'
            : 'fixed bottom-16 left-6 z-50 hidden min-h-12 gap-2 rounded-2xl md:flex'
        }
        onClick={open}
        type='button'
      >
        <Bot aria-hidden='true' className='size-5' />
        {t(
          position === 'admin'
            ? 'supportFlow.floatingButtonAdmin'
            : 'supportFlow.floatingButton'
        )}
      </Button>
    )

  return (
    <section
      aria-labelledby='support-flow-title'
      aria-modal='true'
      className='bg-card md:border-border fixed inset-0 z-50 flex flex-col shadow-2xl md:inset-auto md:bottom-6 md:left-6 md:h-[min(760px,calc(100dvh-3rem))] md:w-[min(460px,calc(100vw-3rem))] md:rounded-[2rem] md:border'
      role='dialog'
    >
      <header className='bg-primary text-primary-foreground flex items-center gap-3 px-4 py-4'>
        <Bot aria-hidden='true' className='size-7' />
        <h2 className='flex-1 font-semibold' id='support-flow-title'>
          {t('supportFlow.title')}
        </h2>
        <button
          aria-label={t('supportFlow.actions.close')}
          className='grid size-11 place-items-center rounded-xl hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none'
          onClick={close}
          type='button'
        >
          <X aria-hidden='true' className='size-5' />
        </button>
      </header>
      <div className='border-border flex items-center gap-2 border-b px-4 py-2'>
        <Button
          disabled={selected.length === 0 || isLoading}
          onClick={goBack}
          size='sm'
          type='button'
          variant='ghost'
        >
          {t('supportFlow.actions.back')}
        </Button>
        <Button
          disabled={isLoading}
          onClick={() => void reset(context)}
          size='sm'
          type='button'
          variant='ghost'
        >
          <RotateCcw aria-hidden='true' className='size-4' />
          {t('supportFlow.actions.restart')}
        </Button>
      </div>
      <div className='flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4'>
        {selected.map((item, index) => (
          <p
            className='bg-muted self-end rounded-xl px-3 py-2 text-sm'
            key={`${item}-${index}`}
          >
            {item}
          </p>
        ))}
        {response?.response?.message ? (
          <p className='border-border bg-surface rounded-xl border p-3 text-sm leading-7'>
            {response.response.message}
          </p>
        ) : null}
        {error ? (
          <p className='text-destructive text-sm'>
            {t('supportFlow.errors.generic')}
          </p>
        ) : null}
        {isLoading ? (
          <p className='text-muted-foreground text-sm'>
            {t('supportFlow.loading')}
          </p>
        ) : null}
        {!isLoading &&
          options.map((option) => (
            <Button
              className='min-h-12 justify-between text-right whitespace-normal'
              key={`${option.source}-${option.id}`}
              onClick={() => void select(option)}
              type='button'
              variant='outline'
            >
              <span>{option.label}</span>
              <ChevronRight
                aria-hidden='true'
                className='size-4 shrink-0 rtl:rotate-180'
              />
            </Button>
          ))}
        {!isLoading &&
        response?.response?.options &&
        !response.response.options.last ? (
          <Button
            disabled={isLoadingMore}
            onClick={() => void loadMore()}
            type='button'
            variant='ghost'
          >
            {isLoadingMore
              ? t('supportFlow.loading')
              : t('supportFlow.actions.mainMenu')}
          </Button>
        ) : null}
      </div>
      {isTextInput ? (
        <form
          className='border-border flex gap-2 border-t p-3'
          onSubmit={(event) => {
            event.preventDefault()
            if (value.trim()) {
              void submitText(value)
              setValue('')
            }
          }}
        >
          <Textarea
            aria-label={t('supportFlow.input.placeholder')}
            className='min-h-12'
            onChange={(event) => setValue(event.target.value)}
            placeholder={t('supportFlow.input.placeholder')}
            value={value}
          />
          <Button
            aria-label={t('supportFlow.actions.send')}
            disabled={!value.trim() || isLoading}
            size='icon'
            type='submit'
          >
            <Send aria-hidden='true' className='size-4 rtl:rotate-180' />
          </Button>
        </form>
      ) : null}
    </section>
  )
}
