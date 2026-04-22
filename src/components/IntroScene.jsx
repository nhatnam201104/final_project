import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from '../styles/IntroScene.module.css'

export default function IntroScene({ onComplete }) {
  const videoRef = useRef(null)
  const vignetteRef = useRef(null)
  const textRef = useRef(null)
  const handled = useRef(false)
  const failsafeRef = useRef(null)

  const triggerComplete = () => {
    if (handled.current) return
    handled.current = true
    if (failsafeRef.current) clearTimeout(failsafeRef.current)
    gsap.to(textRef.current, { opacity: 0, duration: 0.4 }).then(() => {
      onComplete()
    })
  }

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
    tl.fromTo(vignetteRef.current, { opacity: 0 }, { opacity: 1, duration: 1 })
    tl.fromTo(textRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.5)

    const video = videoRef.current
    video.muted = true
    video.play().catch(() => {})

    const onEnded = () => triggerComplete()
    const onError = () => {
      if (!handled.current) setTimeout(triggerComplete, 2000)
    }

    video.addEventListener('ended', onEnded)
    video.addEventListener('error', onError)

    failsafeRef.current = setTimeout(() => {
      if (!handled.current) triggerComplete()
    }, 18000)

    return () => {
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('error', onError)
      if (failsafeRef.current) clearTimeout(failsafeRef.current)
      tl.kill()
    }
  }, [])

  return (
    <div className={styles.scene}>
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        muted
        playsInline
        preload="auto"
      >
        <source src="/opening.mp4" type="video/mp4" />
      </video>
      <div ref={vignetteRef} className={styles.vignette} />
      <div ref={textRef} className={styles.topText}>
        HAPPY BIRTHDAY TO YOU
      </div>
    </div>
  )
}
