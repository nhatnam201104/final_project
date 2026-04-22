import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import styles from '../styles/GalleryScene.module.css'

const MEMORIES = [
  {
    image: '/images/kiniem1.jpg',
    story: 'Ngày đầu tiên gặp nhau, ai ngờ sau này lại thành người bạn thân nhất của nhau...',
    effects: ['sparkle'],
  },
  {
    image: '/images/kiniem2.jpg',
    story: 'Những buổi chiều cà phê, những cuộc nói chuyện không bao giờ hết...',
    effects: ['bokeh'],
  },
  {
    image: '/images/kiniem3.jpg',
    story: 'Cùng nhau chia sẻ cả niềm vui lẫn nỗi buồn, đó mới là điều quý giá nhất...',
    effects: ['sparkle'],
  },
  {
    image: '/images/kiniem4.jpg',
    story: 'Chúc bạn luôn giữ được sự nhiệm huyết ấy, và gặp thật nhiều điều may trong năm mới!',
    effects: ['bokeh'],
  },
]

const AUTO_ADVANCE_DELAY = 4000

export default function GalleryScene({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showText, setShowText] = useState(false)
  const containerRef = useRef(null)
  const imageWrapRef = useRef(null)
  const textRef = useRef(null)
  const canvasRef = useRef(null)
  const navRef = useRef(null)
  const autoTimerRef = useRef(null)
  const canvasRaf = useRef(null)
  const isTransitioning = useRef(false)
  
  // Use ref to store goToCard function for recursive calls
  const goToCardRef = useRef(null)

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
      clearTimeout(autoTimerRef.current)
      autoTimerRef.current = null
    }
  }, [])

  // Go to specific card with animation - defined as regular function to use ref
  const goToCard = useCallback((newIndex) => {
    if (isTransitioning.current) return
    if (newIndex < 0 || newIndex >= MEMORIES.length) return
    
    isTransitioning.current = true
    clearAutoTimer()

    const imageWrap = imageWrapRef.current
    const text = textRef.current

    // Fade out current content
    gsap.to(imageWrap, {
      opacity: 0,
      scale: 1.08,
      duration: 0.4,
      ease: 'power2.in',
    })
    
    if (text) {
      gsap.to(text, { opacity: 0, duration: 0.2 })
    }

    // After fade out, update and fade in
    setTimeout(() => {
      stopCanvas()
      setCurrentIndex(newIndex)
      setShowText(false)
      
      // Reset and animate image in
      gsap.set(imageWrap, { scale: 0.92 })
      gsap.to(imageWrap, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' })
      
      // Start canvas effect
      runCanvasEffect(MEMORIES[newIndex])
      
      // Reset and animate text
      if (text) {
        gsap.set(text, { opacity: 0, y: 20 })
        gsap.to(text, { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: 'power2.out' })
      }

      // After animation completes, set showText and schedule next or complete
      setTimeout(() => {
        setShowText(true)
        isTransitioning.current = false
        
        if (newIndex < MEMORIES.length - 1) {
          // Not the last card - auto advance
          autoTimerRef.current = setTimeout(() => {
            if (goToCardRef.current) {
              goToCardRef.current(newIndex + 1)
            }
          }, AUTO_ADVANCE_DELAY)
        } else {
          // Last card - complete after delay
          setTimeout(() => {
            if (onComplete) onComplete()
          }, AUTO_ADVANCE_DELAY)
        }
      }, 500)
    }, 400)
  }, [clearAutoTimer, stopCanvas, runCanvasEffect, onComplete])

  // Store goToCard in ref for recursive calls
  useEffect(() => {
    goToCardRef.current = goToCard
  }, [goToCard])

  const handleCardClick = useCallback(() => {
    if (isTransitioning.current) return
    const next = currentIndex + 1
    if (next < MEMORIES.length) {
      goToCard(next)
    } else {
      if (onComplete) onComplete()
    }
  }, [currentIndex, goToCard, onComplete])

  const handleNavClick = useCallback((index) => {
    if (index !== currentIndex && !isTransitioning.current) {
      goToCard(index)
    }
  }, [currentIndex, goToCard])

  useEffect(() => {
    const container = containerRef.current
    const imageWrap = imageWrapRef.current
    const nav = navRef.current

    // Fade in container
    gsap.set(container, { opacity: 0 })
    gsap.to(container, { opacity: 1, duration: 0.6 })

    // Fade in image
    gsap.set(imageWrap, { scale: 0.92, opacity: 0 })
    gsap.to(imageWrap, { scale: 1, opacity: 1, duration: 0.7, delay: 0.2, ease: 'power2.out' })

    // Start canvas effect
    runCanvasEffect(MEMORIES[0])

    // Fade in nav
    gsap.set(nav, { opacity: 0 })
    gsap.to(nav, { opacity: 1, duration: 0.5, delay: 0.6 })

    // Show text and start auto-advance after initial delay
    setTimeout(() => {
      setShowText(true)
      autoTimerRef.current = setTimeout(() => {
        if (goToCardRef.current) {
          goToCardRef.current(1)
        }
      }, AUTO_ADVANCE_DELAY)
    }, 1200)

    return () => {
      stopCanvas()
      clearAutoTimer()
    }
  }, [runCanvasEffect, stopCanvas, clearAutoTimer])

  const currentMemory = MEMORIES[currentIndex]

  return (
    <div ref={containerRef} className={styles.scene}>
      <canvas ref={canvasRef} className={styles.canvas} />
      
      <div 
        ref={imageWrapRef} 
        className={styles.imageWrap}
        onClick={handleCardClick}
      >
        <img
          src={currentMemory.image}
          alt={`Kỉ niệm ${currentIndex + 1}`}
          className={styles.image}
        />
      </div>

      {showText && (
        <div ref={textRef} className={styles.textOverlay}>
          <p className={styles.storyText}>{currentMemory.story}</p>
        </div>
      )}

      <div ref={navRef} className={styles.nav}>
        {MEMORIES.map((_, i) => (
          <button
            key={i}
            className={`${styles.navDot} ${i === currentIndex ? styles.navDotActive : ''}`}
            onClick={() => handleNavClick(i)}
          />
        ))}
      </div>
    </div>
  )
}
