import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { Attachment } from '@iap/api-types'

export type ImageViewState = {
  scale: number
  positionX: number
  positionY: number
  rotation: number
}

export type ImageViewStateMap = Record<string, ImageViewState>

export type ImageTransformState = Pick<
  ImageViewState,
  'scale' | 'positionX' | 'positionY'
>

export const DEFAULT_IMAGE_VIEW_STATE: ImageViewState = {
  scale: 1,
  positionX: 0,
  positionY: 0,
  rotation: 0,
}

type ImageViewFile = Attachment & {
  url?: unknown
  src?: unknown
  path?: unknown
}

interface UseImageViewerStateParams {
  activeFile?: Attachment
  activeIndex: number
  onSelectImage: (index: number) => void
}

export function getImageViewKey(file: Attachment | undefined, index: number) {
  const imageFile = file as ImageViewFile | undefined
  const stableIdentifier =
    getStringFileField(imageFile, 'id') ??
    getStringFileField(imageFile, 'url') ??
    getStringFileField(imageFile, 'src') ??
    getStringFileField(imageFile, 'path')

  return stableIdentifier ?? `index:${index}`
}

export function useImageViewerState(params: UseImageViewerStateParams) {
  const { activeFile, activeIndex, onSelectImage } = params
  const [imageViewStateMap, setImageViewStateMap] = useState<ImageViewStateMap>(
    {}
  )
  const activeImageViewKey = useMemo(
    () => getImageViewKey(activeFile, activeIndex),
    [activeFile, activeIndex]
  )
  const activeImageViewKeyRef = useRef(activeImageViewKey)
  const latestImageViewStateRef = useRef<ImageViewState>(
    DEFAULT_IMAGE_VIEW_STATE
  )

  const activeImageViewState =
    imageViewStateMap[activeImageViewKey] ?? DEFAULT_IMAGE_VIEW_STATE

  const persistCurrentImageViewState = useCallback(
    (state = latestImageViewStateRef.current) => {
      const imageViewKey = activeImageViewKeyRef.current

      setImageViewStateMap((prev) => {
        const previousState = prev[imageViewKey]

        if (areImageViewStatesEqual(previousState, state)) {
          return prev
        }

        return {
          ...prev,
          [imageViewKey]: state,
        }
      })
    },
    []
  )

  const updateLatestImageTransform = useCallback(
    (transform: ImageTransformState) => {
      latestImageViewStateRef.current = {
        ...latestImageViewStateRef.current,
        ...transform,
      }
    },
    []
  )

  const updateCurrentImageViewState = useCallback(
    (state: ImageViewState) => {
      latestImageViewStateRef.current = state
      persistCurrentImageViewState(state)
    },
    [persistCurrentImageViewState]
  )

  const rotateCurrentImage = useCallback(
    (angleDelta: number) => {
      const nextState = {
        ...latestImageViewStateRef.current,
        rotation: latestImageViewStateRef.current.rotation + angleDelta,
      }

      latestImageViewStateRef.current = nextState
      persistCurrentImageViewState(nextState)
    },
    [persistCurrentImageViewState]
  )

  const selectImage = useCallback(
    (index: number) => {
      persistCurrentImageViewState()
      onSelectImage(index)
    },
    [onSelectImage, persistCurrentImageViewState]
  )

  useEffect(() => {
    activeImageViewKeyRef.current = activeImageViewKey
    latestImageViewStateRef.current = activeImageViewState
  }, [activeImageViewKey, activeImageViewState])

  return {
    activeImageViewKey,
    activeImageViewState,
    imageViewStateMap,
    persistCurrentImageViewState,
    rotateCurrentImage,
    selectImage,
    updateCurrentImageViewState,
    updateLatestImageTransform,
  }
}

function getStringFileField(
  file: ImageViewFile | undefined,
  field: keyof ImageViewFile
) {
  const value = file?.[field]

  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  return undefined
}

function areImageViewStatesEqual(
  left: ImageViewState | undefined,
  right: ImageViewState
) {
  return (
    left?.scale === right.scale &&
    left.positionX === right.positionX &&
    left.positionY === right.positionY &&
    left.rotation === right.rotation
  )
}
