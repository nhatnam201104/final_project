import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from '../styles/TeddyBearScene.module.css'

// Placeholder message - user can update later
const TEDDY_MESSAGE =
  'Cậu là người bạn tuyệt vời nhất mà tui có! Chúc cậu sinh nhật vui vẻ, luôn mạnh khỏe và gặp nhiều may mắn trong năm mới nha! 💝'

export default function TeddyBearScene({ onComplete }) {
  const containerRef = useRef(null)
  const bearRef = useRef(null)
  const heart1Ref = useRef(null)
  const heart2Ref = useRef(null)
  const heart3Ref = useRef(null)
  const messageRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const bear = bearRef.current
    const heart1 = heart1Ref.current
    const heart2 = heart2Ref.current
    const heart3 = heart3Ref.current
    const message = messageRef.current

    gsap.set(container, { opacity: 0 })
    gsap.set(bear, { scale: 0.5, opacity: 0, y: 40 })
    gsap.set([heart1, heart2, heart3], { scale: 0, opacity: 0 })
    gsap.set(message, { opacity: 0, y: 30 })

    gsap.to(container, { opacity: 1, duration: 0.6 })

    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } })
    tl.to(bear, { scale: 1, opacity: 1, y: 0, duration: 0.9 }, 0.4)
    tl.to(heart1, { scale: 1, opacity: 1, duration: 0.5 }, 0.9)
    tl.to(heart2, { scale: 1, opacity: 1, duration: 0.5 }, 1.1)
    tl.to(heart3, { scale: 1, opacity: 1, duration: 0.5 }, 1.3)
    tl.to(message, { opacity: 1, y: 0, duration: 0.7 }, 1.6)
    tl.to(bear, { scale: 1.08, duration: 0.4, ease: 'power1.inOut' }, 2.5)
    tl.to(bear, { scale: 1, duration: 0.4, ease: 'power1.inOut' }, 2.9)
    
    // Show message longer - 8 seconds total before auto transition
    tl.to(container, { opacity: 0, duration: 0.5 }, 8)

    // Floating hearts animation
    const floatHearts = () => {
      gsap.to([heart1, heart2, heart3], {
        y: 'random(-15, -30)',
        duration: 'random(1.5, 2.5)',
        ease: 'sine.inOut',
        onComplete: floatHearts,
      })
    }
    const floatTimer = setTimeout(floatHearts, 2500)

    // Auto complete after 8 seconds
    const autoTimer = setTimeout(() => {
      onComplete()
    }, 8500)

    return () => {
      tl.kill()
      clearTimeout(floatTimer)
      clearTimeout(autoTimer)
    }
  }, [onComplete])

  return (
    <div ref={containerRef} className={styles.scene}>
      <div className={styles.bearContainer}>
        <div ref={bearRef} className={styles.bear}>
          <div className={styles.bearHead}>
            <div className={styles.bearEarLeft} />
            <div className={styles.bearEarRight} />
            <div className={styles.bearFace}>
              <div className={styles.bearEyeLeft} />
              <div className={styles.bearEyeRight} />
              <div className={styles.bearNose} />
              <div className={styles.bearMouth} />
            </div>
          </div>
          <div className={styles.bearBody}>
            <div className={styles.bearArmLeft} />
            <div className={styles.bearArmRight} />
          </div>
        </div>

        <div ref={heart1Ref} className={`${styles.heart} ${styles.heart1}`}>💖</div>
        <div ref={heart2Ref} className={`${styles.heart} ${styles.heart2}`}>💕</div>
        <div ref={heart3Ref} className={`${styles.heart} ${styles.heart3}`}>💝</div>
      </div>

      <div ref={messageRef} className={styles.messageCard}>
        <p className={styles.messageText}>{TEDDY_MESSAGE}</p>
      </div>
    </div>
  )
}
