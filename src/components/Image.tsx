import React, { CSSProperties, RefObject, useEffect, useRef, useState } from 'react'

import { shakeUndifindedItem } from '@/functions/arrayMethods'
import mergeRef from '@/functions/react/mergeRef'
import { useClick } from '@/hooks/useClick'

import { getFileNameOfURI } from '../functions/dom/getFileNameOfURI'
import { isArray } from '@/functions/judgers/dateType'

/**
 * usually in the leading part of an list-item
 */
export default function Image({
  width,
  height,

  src,
  fallbackSrc,
  fallbackColor,
  alt: alert,
  onClick,
  domRef,
  className,
  style
}: {
  width?: number
  height?: number
  /** can accept multi srcs */
  src: string | string[] | undefined
  fallbackSrc?: string
  // only when loading and no fallbackSrc
  fallbackColor?: string
  alt?: string // for readability
  onClick?: () => void
  domRef?: RefObject<any>
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLImageElement>(null)
  useClick(ref, { onClick })
  const srcSet = (isArray(src) ? src.length > 0 : src) ? shakeUndifindedItem([src, fallbackSrc].flat()) : []
  const srcFingerprint = srcSet.join(' ')
  const [currentUsedSrcIndex, setCurrentUsedSrcIndex] = useState(0)
  const currentSrc = srcSet[currentUsedSrcIndex] || fallbackSrc
  const alertText = alert ?? getFileNameOfURI(currentSrc ?? '')

  useEffect(() => {
    setCurrentUsedSrcIndex(0)
  }, [srcFingerprint])

  useEffect(() => {
    ref.current?.addEventListener('error', (ev) => {
      setCurrentUsedSrcIndex((n) => n + 1)
    })
  }, [])
  return (
    <img
      width={width}
      height={height}
      ref={mergeRef(domRef, ref)}
      className={`Image ${src || srcSet.length ? '' : 'invisible'} ${className ?? ''}`}
      src={currentSrc}
      alt={alertText}
      style={{ ...style, backgroundColor: fallbackColor }}
    />
  )
}
