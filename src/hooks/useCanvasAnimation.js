import { useEffect, useRef, useCallback } from 'react'

export function useCanvasAnimation() {
  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const runningRef = useRef(false)

  const fitCanvas = useCallback((ctx) => {
    const canvas = canvasRef.current
    if (!canvas) return { width: 0, height: 0 }
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = window.innerWidth
    const height = window.innerHeight
    const nextWidth = Math.floor(width * dpr)
    const nextHeight = Math.floor(height * dpr)

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth
      canvas.height = nextHeight
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    return { width, height }
  }, [])

  const stopAnimation = useCallback(() => {
    runningRef.current = false
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      stopAnimation()
    }
  }, [stopAnimation])

  return { canvasRef, fitCanvas, stopAnimation, runningRef, animFrameRef }
}
