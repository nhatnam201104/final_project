import { useRef, useState, useEffect, useCallback } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/LuckyWheel.module.css';

const SEGMENTS = [
  { label: 'Ăn vâng!', color: '#F8dae9', textColor: '#880e4f' },
  { label: 'Kẹo ngọt', color: '#b9d6f3', textColor: '#0d47a1' },
  { label: 'Bong bóng', color: '#F8dae9', textColor: '#880e4f' },
  { label: 'Thư nhỏ', color: '#b9d6f3', textColor: '#0d47a1' },
  { label: 'Hát cho nghe', color: '#F8dae9', textColor: '#880e4f' },
  { label: 'Cà phê', color: '#b9d6f3', textColor: '#0d47a1' },
  { label: 'Ôm thật chặt', color: '#F8dae9', textColor: '#880e4f' },
  { label: 'Điều ước', color: '#b9d6f3', textColor: '#0d47a1' },
];

export default function LuckyWheel({ onConfetti }) {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState('');
  const currentRotation = useRef(0);
  const [sectionRef, isVisible] = useIntersectionObserver();

  const getWheelSize = useCallback(() => {
    return Math.min(350, window.innerWidth * 0.85);
  }, []);

  const drawWheel = useCallback((rotation = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = getWheelSize();
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = Math.max(1, (size / 2) - 20);
    const segAngle = (2 * Math.PI) / SEGMENTS.length;

    ctx.clearRect(0, 0, size, size);

    SEGMENTS.forEach((seg, i) => {
      const startAngle = rotation + i * segAngle;
      const endAngle = startAngle + segAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segAngle / 2);
      ctx.fillStyle = seg.textColor;
      const fontSize = size < 300 ? 11 : 14;
      ctx.font = `bold ${fontSize}px 'Inter', sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText(seg.label, radius - 18, 5);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f1117';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.fillStyle = '#0f1117';
    ctx.font = `bold ${size < 300 ? 9 : 11}px 'Inter', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('QUAY', centerX, centerY);
  }, [getWheelSize]);

  useEffect(() => {
    drawWheel(currentRotation.current);
  }, [drawWheel]);

  useEffect(() => {
    const onResize = () => drawWheel(currentRotation.current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawWheel]);

  const getWinningSegment = () => {
    const segAngle = (2 * Math.PI) / SEGMENTS.length;
    const normalized = currentRotation.current % (2 * Math.PI);
    const pointerAngle = ((2 * Math.PI - normalized + (3 * Math.PI) / 2) % (2 * Math.PI));
    const index = Math.floor(pointerAngle / segAngle) % SEGMENTS.length;
    return SEGMENTS[index];
  };

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setShowResult(false);

    const totalRotation = (5 + Math.random() * 5) * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 4000;
    const startTime = performance.now();
    const startRotation = currentRotation.current;

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      currentRotation.current = startRotation + totalRotation * eased;
      drawWheel(currentRotation.current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setHasSpun(true);
        const winner = getWinningSegment();
        setResult(winner.label);
        setTimeout(() => {
          setShowResult(true);
          onConfetti?.();
        }, 300);
      }
    }
    requestAnimationFrame(animate);
  };

  return (
    <section
      ref={sectionRef}
      className={`${styles.wheelSection} ${isVisible ? styles.visible : ''}`}
      id="wheel-section"
    >
      <h2 className={styles.heading}>Vòng Quay May Mắn</h2>
      <p className={styles.subheading}>Hãy thử vận may của bạn nhé!</p>

      <div className={styles.wheelWrapper}>
        <div className={styles.pointer} />
        <canvas ref={canvasRef} className={styles.wheelCanvas} />

        <button
          className={styles.spinBtn}
          onClick={spin}
          disabled={spinning}
        >
          {spinning ? '...' : hasSpun ? 'Quay lại!' : 'Quay thôi!'}
        </button>
      </div>

      {showResult && (
        <div className={styles.resultOverlay} onClick={() => setShowResult(false)}>
          <div className={styles.resultCard} onClick={(e) => e.stopPropagation()}>
            <p className={styles.resultEmoji}>🎉</p>
            <p className={styles.resultText}>Bạn nhận được: <strong>{result}</strong></p>
            <button className={styles.closeBtn} onClick={() => setShowResult(false)}>
              Cảm ơn!
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
