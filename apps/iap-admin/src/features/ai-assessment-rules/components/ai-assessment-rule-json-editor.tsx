import {
  type ComponentProps,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { cn } from '@iap/ui'
import type {
  Content,
  ContentErrors,
  OnChange,
  JsonEditor as VanillaJsonEditor,
} from 'vanilla-jsoneditor'
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'

type JsonEditorProps = Omit<
  ComponentProps<'div'>,
  'children' | 'onChange' | 'value'
> & {
  ariaLabel: string
  onChange: (value: string) => void
  onErrorChange?: (message: string | undefined) => void
  readOnly?: boolean
  value: string
}

function toJsonText(content: Content): string {
  if ('text' in content) return content.text

  return JSON.stringify(content.json, null, 2)
}

function getErrorMessage(contentErrors: ContentErrors | undefined) {
  if (!contentErrors) return undefined

  if ('parseError' in contentErrors) {
    const { column, line, message } = contentErrors.parseError
    const location = [line, column]
      .filter((value): value is number => value !== undefined)
      .join(':')

    return location ? `${message} (${location})` : message
  }

  return contentErrors.validationErrors
    .map(({ message }) => message)
    .filter(Boolean)
    .join(', ')
}

export const AiAssessmentRuleJsonEditor = forwardRef<
  HTMLDivElement,
  JsonEditorProps
>(function AiAssessmentRuleJsonEditor(
  {
    ariaLabel,
    className,
    onChange,
    onErrorChange,
    onFocus,
    readOnly = false,
    value,
    ...props
  },
  forwardedRef
) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<VanillaJsonEditor | null>(null)
  const valueRef = useRef(value)
  const onChangeRef = useRef(onChange)
  const onErrorChangeRef = useRef(onErrorChange)
  const readOnlyRef = useRef(readOnly)

  useImperativeHandle(forwardedRef, () => containerRef.current!, [])

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    onErrorChangeRef.current = onErrorChange
  }, [onErrorChange])

  useEffect(() => {
    if (typeof document === 'undefined') return

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, {
      attributeFilter: ['class'],
      attributes: true,
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let isDisposed = false
    const handleChange: NonNullable<OnChange> = (
      content,
      _previousContent,
      { contentErrors }
    ) => {
      const nextValue = toJsonText(content)

      valueRef.current = nextValue
      onChangeRef.current(nextValue)
      onErrorChangeRef.current?.(getErrorMessage(contentErrors))
    }

    void import('vanilla-jsoneditor')
      .then(({ createJSONEditor }) => {
        if (isDisposed || !containerRef.current) return

        editorRef.current = createJSONEditor({
          props: {
            ariaLabel,
            content: { text: valueRef.current },
            mode: 'text',
            onChange: handleChange,
            readOnly: readOnlyRef.current,
          },
          target: containerRef.current,
        })
        onErrorChangeRef.current?.(
          getErrorMessage(editorRef.current.validate())
        )
      })
      .catch((error: unknown) => {
        if (isDisposed) return

        const message = error instanceof Error ? error.message : undefined

        onErrorChangeRef.current?.(message)
      })

    return () => {
      isDisposed = true
      void editorRef.current?.destroy()
      editorRef.current = null
    }
  }, [ariaLabel])

  useEffect(() => {
    readOnlyRef.current = readOnly
    editorRef.current?.updateProps({ readOnly })
  }, [readOnly])

  useEffect(() => {
    if (!editorRef.current || value === valueRef.current) return

    valueRef.current = value
    editorRef.current.updateProps({ content: { text: value } })
  }, [value])

  return (
    <div
      aria-readonly={readOnly}
      className={cn(
        'min-h-64 overflow-hidden rounded-md border border-input bg-background text-foreground',
        isDark && 'jse-theme-dark',
        className
      )}
      dir='ltr'
      onFocus={(event) => {
        onFocus?.(event)
        editorRef.current?.focus()
      }}
      ref={containerRef}
      tabIndex={0}
      {...props}
    />
  )
})
