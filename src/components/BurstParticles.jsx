import { useMemo } from 'react';

const BURST_COLORS = ['#F8dae9', '#b9d6f3', '#ff6b9d', '#c084fc', '#fbbf24', '#34d399'];

export default function BurstParticles({ active }) {
  const particles = useMemo(
    () => active
      ? BURST_COLORS.map((color, i) => ({
          id: i,
          color,
          delay: i * 0.05,
        }))
      : [],
    [active]
  );

  if (particles.length === 0) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9998, pointerEvents: 'none' }}>
      <style>{`
        @keyframes burstOut {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '80vw',
            height: '80vw',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${p.color}, transparent 70%)`,
            transform: 'translate(-50%, -50%) scale(0)',
            animation: `burstOut 1s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
