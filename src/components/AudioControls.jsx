import { useState, useRef, useEffect, useCallback } from 'react'
import styles from '../styles/AudioControls.module.css'

export default function AudioControls() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
  }, [playing])

  const changeVolume = useCallback((e) => {
    const v = Number(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [volume])

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src="/opening.mp4" type="audio/mp4" />
      </audio>
      <div className={styles.controls}>
        <button onClick={toggle} className={styles.btn}>
          {playing ? '⏸' : '▶'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={changeVolume}
          className={styles.slider}
        />
        <span className={styles.label}>
          {playing ? 'Đang phát' : 'Tạm dừng'}
        </span>
      </div>
    </>
  )
}
