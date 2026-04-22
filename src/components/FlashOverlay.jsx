import { useEffect, useState } from 'react';

export default function FlashOverlay({ active }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!visible) return null;

  return <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'white',
    zIndex: 9999,
    opacity: 1,
    animation: 'flashFade 0.4s ease-out forwards',
    pointerEvents: 'none',
  }} />;
}
