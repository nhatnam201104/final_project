import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import styles from '../styles/FinaleScene.module.css'

function playFinaleSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    const now = ctx.currentTime
    // Triumphant fanfare
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, now + i * 0.18)
      gain.gain.linearRampToValueAtTime(0.08, now + i * 0.18 + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.18 + 0.6)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.18)
      osc.stop(now + i * 0.18 + 0.65)
    })
    setTimeout(() => ctx.close().catch(() => {}), 3000)
  } catch (_e) { /* Audio context may already be closed */ }
}

function createFirework(ctx, x, y, color, progress) {
  const count = Math.floor(40 * progress)
  const spread = 80 * progress
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count
    const dist = spread * (0.4 + Math.random() * 0.6)
    const px = x + Math.cos(angle) * dist
    const py = y + Math.sin(angle) * dist
    ctx.fillStyle = color
    ctx.globalAlpha = 1 - progress * 0.5
    ctx.fillRect(px - 1, py - 1, 2, 2)
  }
  ctx.globalAlpha = 1
}

export default function FinaleScene({ onComplete }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const subRef = useRef(null)
  const cakeRef = useRef(null)
  const rafRef = useRef(null)
  const fireworksRef = useRef([])

  const launchFirework = useCallback((x, y, color) => {
    fireworksRef.current.push({
      x, y, color,
      start: performance.now(),
      duration: 1200 + Math.random() * 600,
    })
  }, [])

  const runFireworks = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const colors = ['#ff6b6b', '#ffd93d', '#6bff8e', '#4a9eff', '#b56bff', '#ff8fab', '#ffd700']

    const launchInterval = setInterval(() => {
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight * 0.5
      launchFirework(x, y, colors[Math.floor(Math.random() * colors.length)])
    }, 400)

    const animate = (now) => {
      const { width, height } = { width: window.innerWidth, height: window.innerHeight }

      ctx.fillStyle = 'rgba(2, 4, 12, 0.15)'
      ctx.fillRect(0, 0, width, height)

      fireworksRef.current = fireworksRef.current.filter(fw => {
        const progress = (now - fw.start) / fw.duration
        if (progress < 1) {
          createFirework(ctx, fw.x, fw.y, fw.color, progress)
          return true
        }
        return false
      })

      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      clearInterval(launchInterval)
    }
  }, [launchFirework])

  useEffect(() => {
    playFinaleSound()
    const cleanup = runFireworks()

    const container = containerRef.current
    const title = titleRef.current
    const sub = subRef.current
    const cake = cakeRef.current

    gsap.set(container, { opacity: 0 })
    gsap.set(title, { scale: 0.3, opacity: 0, filter: 'blur(20px)' })
    gsap.set(sub, { scale: 0.5, opacity: 0 })
    gsap.set(cake, { scale: 0, opacity: 0 })

    gsap.to(container, { opacity: 1, duration: 0.5 })

    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } })
    tl.to(title, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1 }, 0.3)
    tl.to(cake, { scale: 1, opacity: 1, duration: 0.8 }, 0.8)
    tl.to(sub, { scale: 1, opacity: 1, duration: 0.6 }, 1.2)

    // Subtle continuous cake animation
    gsap.to(cake, {
      y: -12,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })

    // NO auto-complete - finale scene stays forever until page refresh
    // User can close browser or refresh to restart

    return () => {
      tl.kill()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      cleanup?.()
    }
  }, [runFireworks])

  return (
    <div ref={containerRef} className={styles.scene}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div ref={cakeRef} className={styles.cakeContainer}>
        <div className={styles.cakeBase}>
          <div className={styles.cakeLayer1} />
          <div className={styles.cakeLayer2} />
          <div className={styles.cakeLayer3} />
          <div className={styles.candle} />
          <div className={styles.flame} />
        </div>
        <div className={styles.cakeEmojis}>
          <span>🎂</span>
          <span>🎈</span>
          <span>🎁</span>
          <span>🎉</span>
        </div>
      </div>

      <h1 ref={titleRef} className={styles.title}>
        Happy Birthday!
      </h1>
      <h2 ref={subRef} className={styles.subtitle}>
        Chúc bạn một ngày sinh nhật tuyệt vời!
      </h2>
    </div>
  )
}
