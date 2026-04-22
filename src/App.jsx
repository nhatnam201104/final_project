import { useState, useCallback, useRef, useEffect } from 'react'
import gsap from 'gsap'
import RegisterPage from './components/RegisterPage'
import IntroScene from './components/IntroScene'
import GateScene from './components/GateScene'
import GalleryScene from './components/GalleryScene'
import LuckyWheelScene from './components/LuckyWheelScene'
import TeddyBearScene from './components/TeddyBearScene'
import LetterScene from './components/LetterScene'
import FinaleScene from './components/FinaleScene'
import AudioControls from './components/AudioControls'

const SCENE_ORDER = ['intro', 'gate', 'gallery', 'wheel', 'teddy', 'letter', 'finale']

const sceneComponents = {
  intro: IntroScene,
  gate: GateScene,
  gallery: GalleryScene,
  wheel: LuckyWheelScene,
  teddy: TeddyBearScene,
  letter: LetterScene,
  finale: FinaleScene,
}

export default function App() {
  const [view, setView] = useState('register')
  const [sceneIndex, setSceneIndex] = useState(0)
  const fadeRef = useRef(null)
  const bgMusicRef = useRef(null)
  const [showAudio, setShowAudio] = useState(false)

  // Background music that plays across scenes
  useEffect(() => {
    const audio = bgMusicRef.current
    if (audio && view === 'birthday') {
      audio.volume = 0.5
      audio.play().catch(() => {})
    }
    return () => {
      if (audio) {
        audio.pause()
      }
    }
  }, [view])

  const transitionTo = useCallback(async (nextSceneIndex) => {
    if (nextSceneIndex < 0 || nextSceneIndex >= SCENE_ORDER.length) return
    const fade = fadeRef.current
    if (!fade) return

    gsap.to(fade, { opacity: 1, duration: 0.7, ease: 'power2.inOut' })
    await new Promise((r) => setTimeout(r, 750))
    setSceneIndex(nextSceneIndex)
    gsap.to(fade, { opacity: 0, duration: 0.5, ease: 'power1.out' })
  }, [])

  const handleRegisterComplete = useCallback(() => {
    gsap.to(fadeRef.current, { opacity: 1, duration: 0.9, ease: 'power2.inOut' }).then(() => {
      setView('birthday')
      setShowAudio(true)
      setTimeout(() => {
        gsap.to(fadeRef.current, { opacity: 0, duration: 0.5, ease: 'power1.out' })
      }, 100)
    })
  }, [])

  const handleSceneComplete = useCallback(() => {
    const next = sceneIndex + 1
    if (next < SCENE_ORDER.length) {
      transitionTo(next)
    }
  }, [sceneIndex, transitionTo])

  const currentScene = SCENE_ORDER[sceneIndex]
  const SceneComponent = sceneComponents[currentScene]

  return (
    <div className="app-shell relative overflow-hidden">
      <audio ref={bgMusicRef} loop preload="auto">
        <source src="/themesong.mp3" type="audio/mp3" />
      </audio>
      
      {view === 'register' ? (
        <RegisterPage onComplete={handleRegisterComplete} />
      ) : (
        <div className="relative h-full w-full overflow-hidden">
          {SceneComponent && (
            <SceneComponent onComplete={handleSceneComplete} />
          )}
        </div>
      )}

      <div
        ref={fadeRef}
        className="pointer-events-none fixed inset-0 z-100 bg-black opacity-0"
      />

      {showAudio && <AudioControls />}
    </div>
  )
}
