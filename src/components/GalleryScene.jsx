import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import styles from '../styles/GalleryScene.module.css'

const MEMORIES = [
  {
    image: '/images/kiniem1.jpg',
    story: 'Lần đầu Mai Duyên nấu ăn cho tôiii',
    effects: ['sparkle'],
  },
  {
    image: '/images/kiniem2.jpg',
    story: 'Quà sinh nhật Mai Duyên tặng tôii',
    effects: ['bokeh'],
  },
  {
    image: '/images/kiniem3.jpg',
    story: 'Quà giáng sinh của Mai Duyên',
    effects: ['sparkle'],
  },
  {
    image: '/images/kiniem4.jpg',
    story: 'Chúc bạn luôn giữ được sự nhiệm huyết ấy, và gặp thật nhiều điều may trong năm mới!',
    effects: ['bokeh'],
  },
]

const AUTO_ADVANCE_DELAY = 5000

// Preload all images on mount
const preloadImages = (images) => {
  return Promise.all(
    images.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image()
          img.onload = () => resolve(src)
          img.onerror = () => resolve(src)
          img.src = src
        })
    )
  )
}

export default function GalleryScene({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const containerRef = useRef(null)
  const cardRef = useRef(null)
  const canvasRef = useRef(null)
  const canvasRaf = useRef(null)
  const autoTimerRef = useRef(null)
  const progressRef = useRef(null)
  const imageRef = useRef(null)

  const drawBokeh = useCallback((ctx, width, height) => {
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const r = 10 + Math.random() * 50
      const alpha = 0.04 + Math.random() * 0.1
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
      gradient.addColorStop(0, `rgba(255, 240, 200, ${alpha})`)
      gradient.addColorStop(0.5, `rgba(255, 220, 160, ${alpha * 0.4})`)
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.fillRect(x - r, y - r, r * 2, r * 2)
    }
  }, [])

  const drawSparkles = useCallback((ctx, width, height) => {
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = 1 + Math.random() * 3
      const alpha = 0.4 + Math.random() * 0.6
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.fillRect(x, y, size, size)
      if (Math.random() > 0.5) {
        ctx.fillStyle = `rgba(255, 245, 200, ${alpha * 0.5})`
        ctx.fillRect(x - size * 0.6, y, size * 2.2, 0.6)
        ctx.fillRect(x, y - size * 0.6, 0.6, size * 2.2)
      }
    }
  }, [])

  const runCanvasEffect = useCallback((memory) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const effects = memory?.effects || ['sparkle']

    const draw = () => {
      const { width, height } = { width: window.innerWidth, height: window.innerHeight }
      ctx.clearRect(0, 0, width, height)

      if (effects.includes('bokeh')) {
        drawBokeh(ctx, width, height)
      }
      if (effects.includes('sparkle')) {
        drawSparkles(ctx, width, height)
      }

      canvasRaf.current = requestAnimationFrame(draw)
    }
    draw()
  }, [drawBokeh, drawSparkles])

  const stopCanvas = useCallback(() => {
    if (canvasRaf.current) {
      cancelAnimationFrame(canvasRaf.current)
      canvasRaf.current = null
    }
  }, [])

  const clearAutoTimer = useCallback(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current)
      autoTimerRef.current = null
    }
  }, [])

  const goToNext = useCallback(() => {
    if (isAnimating || !isReady) return
    
    const card = cardRef.current
    const progress = progressRef.current
    
    if (currentIndex >= MEMORIES.length - 1) {
      clearAutoTimer()
      if (onComplete) onComplete()
      return
    }

    setIsAnimating(true)
    clearAutoTimer()

    // Reset progress bar
    if (progress) {
      gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })
    }

    // Flip out animation
    gsap.to(card, {
      rotateY: 90,
      scale: 0.95,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        setShowSkeleton(true)
        setCurrentIndex(prev => prev + 1)
        setIsAnimating(false)
        
        // Reset card position instantly
        gsap.set(card, { rotateY: -90, scale: 0.95, opacity: 0 })
        
        // Flip in animation
        gsap.to(card, {
          rotateY: 0,
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        })
      }
    })
  }, [currentIndex, onComplete, clearAutoTimer, isAnimating, isReady])

  useEffect(() => {
    // Preload all images first
    const images = MEMORIES.map(m => m.image)
    preloadImages(images).then(() => {
      setIsReady(true)
    })
  }, [])

  useEffect(() => {
    if (!isReady) return
    
    const container = containerRef.current
    const progress = progressRef.current
    
    gsap.set(container, { opacity: 0 })
    gsap.to(container, { opacity: 1, duration: 0.5 })
    
    runCanvasEffect(MEMORIES[currentIndex])
    
    // Start progress bar animation
    if (progress) {
      gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })
      gsap.to(progress, { 
        scaleX: 1, 
        duration: AUTO_ADVANCE_DELAY / 1000,
        ease: 'none'
      })
    }
    
    // Auto advance timer
    autoTimerRef.current = setInterval(() => {
      goToNext()
    }, AUTO_ADVANCE_DELAY)
    
    return () => {
      stopCanvas()
      clearAutoTimer()
    }
  }, [currentIndex, runCanvasEffect, stopCanvas, clearAutoTimer, goToNext, isReady])

  const handleCardClick = useCallback(() => {
    if (!isAnimating && isReady) {
      clearAutoTimer()
      goToNext()
    }
  }, [goToNext, clearAutoTimer, isAnimating, isReady])

  const handleImageLoad = useCallback(() => {
    setShowSkeleton(false)
  }, [])

  const currentMemory = MEMORIES[currentIndex]

  return (
    <div ref={containerRef} className={styles.scene}>
      <canvas ref={canvasRef} className={styles.canvas} />
      
      <div className={styles.progressContainer}>
        <div ref={progressRef} className={styles.progressBar} />
      </div>
      
      <div className={styles.counter}>
        {currentIndex + 1} / {MEMORIES.length}
      </div>
      
      <div 
        ref={cardRef}
        className={`${styles.card} ${!isReady ? styles.cardLoading : ''}`}
        onClick={handleCardClick}
        style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      >
        <div className={styles.cardInner}>
          {/* Skeleton loader */}
          {showSkeleton && (
            <div className={styles.skeleton} />
          )}
          
          <img
            ref={imageRef}
            src={currentMemory.image}
            alt={`Kỉ niệm ${currentIndex + 1}`}
            className={`${styles.image} ${!showSkeleton ? styles.imageLoaded : ''}`}
            draggable="false"
            onLoad={handleImageLoad}
          />
          
          <div className={styles.overlay} />
          
          <div className={styles.storyOverlay}>
            <p className={styles.storyText}>{currentMemory.story}</p>
          </div>
        </div>
      </div>

      <div className={styles.hint}>
        {isReady ? 'Bấm hoặc chờ để xem tiếp' : 'Đang tải...'}
      </div>
    </div>
  )
}