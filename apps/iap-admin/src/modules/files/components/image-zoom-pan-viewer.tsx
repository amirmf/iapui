import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { cn } from '@iap/ui'
import { Button } from '@iap/ui'
import { Tooltip, TooltipContent, TooltipTrigger } from '@iap/ui'
import {
  DEFAULT_IMAGE_VIEW_STATE,
  type ImageTransformState,
  type ImageViewState,
} from '@modules/files/components/use-image-viewer-state'
import {
  Download,
  RefreshCw,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  type ReactZoomPanPinchContentRef,
  type ReactZoomPanPinchProps,
  type ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch'

interface ImageZoomPanViewerProps {
  src: string
  viewKey: string
  viewState: ImageViewState
  onLatestTransformChange: (transform: ImageTransformState) => void
  onRotate: (angleDelta: number) => void
  onViewStateChange: (state: ImageViewState) => void
  alt?: string
  outerClassName?: string
  viewportClassName?: string
  transformComponentWrapperStyle?: CSSProperties
  transformComponentWrapperClassName?: string
}

export function ImageZoomPanViewer(props: ImageZoomPanViewerProps) {
  const {
    src,
    viewKey,
    viewState,
    onLatestTransformChange,
    onRotate,
    onViewStateChange,
    alt = 'attachment',
    outerClassName,
    viewportClassName,
    transformComponentWrapperStyle = {},
    transformComponentWrapperClassName,
  } = props
  const { t } = useTranslation()
  const [scale, setScale] = useState(viewState.scale)
  const [isPanning, setIsPanning] = useState(false)
  const latestTransformRef = useRef<ImageTransformState>({
    scale: viewState.scale,
    positionX: viewState.positionX,
    positionY: viewState.positionY,
  })
  const viewStateRef = useRef(viewState)
  viewStateRef.current = viewState
  const zoomFunctionsRef = useRef<ReactZoomPanPinchContentRef>(null)
  const initialTransformRef = useRef<ImageTransformState | null>(null)
  const initialTransformIdentity = `${viewKey}:${src}`
  const initialTransformIdentityRef = useRef(initialTransformIdentity)
  const hasUserChangedTransformRef = useRef(false)
  const imageLoadAnimationFrameRef = useRef<number | null>(null)

  const shouldCenterOnInit = isDefaultImageViewState(viewState)

  const cursor: CSSProperties['cursor'] = isPanning
    ? 'grabbing'
    : scale > 1
      ? 'grab'
      : 'default'

  const syncLatestTransform = useCallback(
    (transform: ImageTransformState) => {
      latestTransformRef.current = transform
      onLatestTransformChange(transform)
    },
    [onLatestTransformChange]
  )

  const persistCurrentViewState = useCallback(
    (rotation = viewState.rotation) => {
      onViewStateChange({
        ...latestTransformRef.current,
        rotation,
      })
    },
    [onViewStateChange, viewState.rotation]
  )

  const syncTransformFromRef = useCallback(
    (ref: ReactZoomPanPinchRef) => {
      const transform = getTransformState(ref)

      syncLatestTransform(transform)
      setScale(transform.scale)

      return transform
    },
    [syncLatestTransform]
  )

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = src
    link.download = src.split('/').pop()?.split('?')[0] || 'attachment'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleRotate = (angleDelta: number) => {
    hasUserChangedTransformRef.current = true
    onLatestTransformChange(latestTransformRef.current)
    onRotate(angleDelta)
  }

  const handleReset = () => {
    const zoomFunctions = zoomFunctionsRef.current
    const transform =
      initialTransformIdentityRef.current === initialTransformIdentity
        ? (initialTransformRef.current ?? getDefaultImageTransformState())
        : getDefaultImageTransformState()

    hasUserChangedTransformRef.current = false

    zoomFunctions?.setTransform(
      transform.positionX,
      transform.positionY,
      transform.scale,
      0
    )

    onViewStateChange({
      ...transform,
      rotation: DEFAULT_IMAGE_VIEW_STATE.rotation,
    })
    syncLatestTransform(transform)
    setScale(transform.scale)
  }

  useEffect(() => {
    if (initialTransformIdentityRef.current === initialTransformIdentity) {
      return
    }

    initialTransformIdentityRef.current = initialTransformIdentity
    initialTransformRef.current = null
    hasUserChangedTransformRef.current = false
  }, [initialTransformIdentity])

  useEffect(() => {
    const animationFrameId = window.requestAnimationFrame(() => {
      const zoomFunctions = zoomFunctionsRef.current

      if (shouldCenterOnInit) {
        if (!zoomFunctions) {
          return
        }

        const transform = getTransformState(zoomFunctions)

        initialTransformRef.current = transform
        initialTransformIdentityRef.current = initialTransformIdentity
        syncLatestTransform(transform)
        setScale(transform.scale)
        return
      }

      const { scale, positionX, positionY } = viewStateRef.current
      const transform = {
        scale,
        positionX,
        positionY,
      }

      if (!initialTransformRef.current) {
        initialTransformRef.current = transform
        initialTransformIdentityRef.current = initialTransformIdentity
      }
      zoomFunctions?.setTransform(
        transform.positionX,
        transform.positionY,
        transform.scale,
        0
      )
      syncLatestTransform(transform)
      setScale(transform.scale)
    })

    return () => window.cancelAnimationFrame(animationFrameId)
  }, [initialTransformIdentity, shouldCenterOnInit, syncLatestTransform])

  const handleImageLoad = useCallback(() => {
    if (!shouldCenterOnInit || hasUserChangedTransformRef.current) {
      return
    }

    const firstFrameId = window.requestAnimationFrame(() => {
      const secondFrameId = window.requestAnimationFrame(() => {
        const zoomFunctions = zoomFunctionsRef.current

        if (!zoomFunctions || hasUserChangedTransformRef.current) {
          return
        }

        const transform = getTransformState(zoomFunctions)

        initialTransformRef.current = transform
        initialTransformIdentityRef.current = initialTransformIdentity
        syncLatestTransform(transform)
        setScale(transform.scale)
      })

      imageLoadAnimationFrameRef.current = secondFrameId
    })

    imageLoadAnimationFrameRef.current = firstFrameId
  }, [initialTransformIdentity, shouldCenterOnInit, syncLatestTransform])

  useEffect(() => {
    return () => {
      if (imageLoadAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(imageLoadAnimationFrameRef.current)
      }
    }
  }, [])

  const toolbarLabels = {
    zoomIn: t('files.viewer.actions.zoomIn'),
    zoomOut: t('files.viewer.actions.zoomOut'),
    resetView: t('files.viewer.actions.resetView'),
    rotateLeft: t('files.viewer.actions.rotateLeft'),
    rotateRight: t('files.viewer.actions.rotateRight'),
    downloadImage: t('files.viewer.actions.downloadImage'),
  }

  const onTransform = useCallback<
    NonNullable<ReactZoomPanPinchProps['onTransform']>
  >(
    (_, state) => {
      syncLatestTransform(state)
    },
    [syncLatestTransform]
  )

  const onPanningStart = useCallback<
    NonNullable<ReactZoomPanPinchProps['onPanningStart']>
  >(() => {
    hasUserChangedTransformRef.current = true
    setIsPanning(true)
  }, [])

  const onPanningStop = useCallback<
    NonNullable<ReactZoomPanPinchProps['onPanningStop']>
  >(
    (ref) => {
      hasUserChangedTransformRef.current = true
      setIsPanning(false)
      syncTransformFromRef(ref)
      persistCurrentViewState()
    },
    [persistCurrentViewState, syncTransformFromRef]
  )

  const onPinchStop = useCallback<
    NonNullable<ReactZoomPanPinchProps['onPinchStop']>
  >(
    (ref) => {
      hasUserChangedTransformRef.current = true
      syncTransformFromRef(ref)
      persistCurrentViewState()
    },
    [persistCurrentViewState, syncTransformFromRef]
  )

  const onZoomStop = useCallback<
    NonNullable<ReactZoomPanPinchProps['onZoomStop']>
  >(
    (ref) => {
      hasUserChangedTransformRef.current = true
      syncTransformFromRef(ref)
      persistCurrentViewState()
    },
    [persistCurrentViewState, syncTransformFromRef]
  )

  const renderToolbarButton = (
    label: string,
    icon: ReactNode,
    onClick: () => void
  ) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          presentation='reference'
          type='button'
          size='sm'
          variant='outline'
          aria-label={label}
          onClick={onClick}
        >
          {icon}
          <span className='sr-only'>{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent presentation='reference'>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )

  return (
    <TransformWrapper
      ref={zoomFunctionsRef}
      key={viewKey}
      initialScale={viewState.scale}
      initialPositionX={viewState.positionX}
      initialPositionY={viewState.positionY}
      centerZoomedOut={shouldCenterOnInit}
      smooth
      limitToBounds={false}
      minScale={0.25}
      maxScale={6}
      doubleClick={{ disabled: true }}
      onTransform={onTransform}
      onPanningStart={onPanningStart}
      onPanningStop={onPanningStop}
      onPinchStop={onPinchStop}
      onZoomStop={onZoomStop}
      wheel={{
        step: 0.001,
      }}
    >
      {({ zoomIn, zoomOut }) => {
        return (
          <div className={cn('space-y-3', outerClassName)}>
            <div className='flex flex-wrap gap-2'>
              {renderToolbarButton(
                toolbarLabels.zoomIn,
                <ZoomIn className='h-4 w-4' />,
                () => {
                  hasUserChangedTransformRef.current = true
                  zoomIn()
                }
              )}
              {renderToolbarButton(
                toolbarLabels.zoomOut,
                <ZoomOut className='h-4 w-4' />,
                () => {
                  hasUserChangedTransformRef.current = true
                  zoomOut()
                }
              )}
              {renderToolbarButton(
                toolbarLabels.resetView,
                <RefreshCw className='h-4 w-4' />,
                handleReset
              )}
              {renderToolbarButton(
                toolbarLabels.rotateLeft,
                <RotateCcw className='h-4 w-4' />,
                () => handleRotate(-90)
              )}
              {renderToolbarButton(
                toolbarLabels.rotateRight,
                <RotateCw className='h-4 w-4' />,
                () => handleRotate(90)
              )}
              {renderToolbarButton(
                toolbarLabels.downloadImage,
                <Download className='h-4 w-4' />,
                handleDownload
              )}
            </div>

            <div
              className={cn('rounded border bg-muted/40', viewportClassName)}
            >
              <TransformComponent
                wrapperClass={cn(
                  'h-full max-h-[55vh] w-full !m-auto',
                  transformComponentWrapperClassName
                )}
                contentClass='flex h-full w-full items-center justify-center'
                wrapperStyle={Object.assign(
                  { cursor },
                  transformComponentWrapperStyle
                )}
                contentStyle={{
                  userSelect: 'none',
                }}
              >
                <div style={{ transform: `rotate(${viewState.rotation}deg)` }}>
                  <img
                    src={src}
                    alt={alt}
                    draggable={false}
                    className='h-full w-full object-contain'
                    onLoad={handleImageLoad}
                  />
                </div>
              </TransformComponent>
            </div>
          </div>
        )
      }}
    </TransformWrapper>
  )
}

function isDefaultImageViewState(viewState: ImageViewState) {
  return (
    viewState.scale === DEFAULT_IMAGE_VIEW_STATE.scale &&
    viewState.positionX === DEFAULT_IMAGE_VIEW_STATE.positionX &&
    viewState.positionY === DEFAULT_IMAGE_VIEW_STATE.positionY &&
    viewState.rotation === DEFAULT_IMAGE_VIEW_STATE.rotation
  )
}

function getDefaultImageTransformState(): ImageTransformState {
  return {
    scale: DEFAULT_IMAGE_VIEW_STATE.scale,
    positionX: DEFAULT_IMAGE_VIEW_STATE.positionX,
    positionY: DEFAULT_IMAGE_VIEW_STATE.positionY,
  }
}

function getTransformState(ref: ReactZoomPanPinchRef): ImageTransformState {
  const { scale, positionX, positionY } = ref.state

  return {
    scale,
    positionX,
    positionY,
  }
}

export default ImageZoomPanViewer
