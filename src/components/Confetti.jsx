import { useEffect, useRef } from 'react';
import { ConfettiSystem } from '../utils/confettiSystem';

export default function Confetti({ launch }) {
  const canvasRef = useRef(null);
  const systemRef = useRef(null);

  useEffect(() => {
    systemRef.current = new ConfettiSystem(canvasRef.current);

    const onResize = () => {
      if (systemRef.current) systemRef.current.resize();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (launch && systemRef.current) {
      systemRef.current.launch(120);
    }
  }, [launch]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9997,
      }}
    />
  );
}
