import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

export function useGsapTimeline() {
  const timelineRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [])

  const createTimeline = useCallback((config = {}) => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }
    timelineRef.current = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      ...config,
    })
    return timelineRef.current
  }, [])

  const tween = useCallback((target, vars) => {
    return new Promise((resolve) => {
      gsap.to(target, { ...vars, onComplete: resolve })
    })
  }, [])

  return { createTimeline, tween, timelineRef }
}
