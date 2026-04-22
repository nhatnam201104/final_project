import { useState, useCallback } from 'react';
import LoginSection from './components/LoginSection';
import CakeSection from './components/CakeSection';
import PhotoSection from './components/PhotoSection';
import TeddySection from './components/TeddySection';
import LuckyWheel from './components/LuckyWheel';
import MessageSection from './components/MessageSection';
import ClosingSection from './components/ClosingSection';
import FlashOverlay from './components/FlashOverlay';
import BurstParticles from './components/BurstParticles';
import Confetti from './components/Confetti';
import { useAudio } from './hooks/useAudio';

export default function App() {
  const [phase, setPhase] = useState('login');
  const [showFlash, setShowFlash] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const { initAudio, play } = useAudio();

  const handleExplode = useCallback(() => {
    setShowFlash(true);
    setShowBurst(true);

    setTimeout(() => {
      setPhase('birthday');
      setShowFlash(false);
      setConfettiTrigger((n) => n + 1);
    }, 400);

    setTimeout(() => {
      setShowBurst(false);
    }, 1200);

    setTimeout(() => {
      play();
    }, 800);
  }, [play]);

  return (
    <>
      <style>{`
        @keyframes flashFade {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>

      {phase === 'login' && (
        <LoginSection onExplode={handleExplode} initAudio={initAudio} />
      )}

      {phase === 'birthday' && (
        <>
          <CakeSection />
          <PhotoSection />
          <TeddySection />
          <LuckyWheel onConfetti={() => setConfettiTrigger((n) => n + 1)} />
          <MessageSection />
          <ClosingSection />
        </>
      )}

      <FlashOverlay active={showFlash} />
      <BurstParticles active={showBurst} />
      <Confetti launch={confettiTrigger} />
    </>
  );
}
