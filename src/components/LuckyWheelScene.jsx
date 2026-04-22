import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import styles from "../styles/LuckyWheelScene.module.css";

const PRIZES = [
  { text: "Bình An", emoji: "🕊️", color: "#4a9eff" },
  { text: "Hạnh Phúc", emoji: "💖", color: "#ff6b9d" },
  { text: "Thành Công", emoji: "🏆", color: "#ffd93d" },
  { text: "May Mắn", emoji: "🍀", color: "#6bff8e" },
  { text: "Tình Yêu", emoji: "💕", color: "#ff8fab" },
  { text: "Sức Khỏe", emoji: "💪", color: "#ffaa5b" },
  { text: "Niềm Vui", emoji: "🌟", color: "#b56bff" },
  { text: "Ước Mơ", emoji: "✨", color: "#5bffff" },
];

function playWinSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.55);
    });
    setTimeout(() => ctx.close().catch(() => {}), 2000);
  } catch (e) {
    console.log(e);
    /* Audio context may already be closed */
  }
}

export default function LuckyWheelScene({ onComplete }) {
  const canvasRef = useRef(null);
  const pointerRef = useRef(null);
  const containerRef = useRef(null);
  const resultRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const rafRef = useRef(null);
  const wheelRotationRef = useRef(0);
  const hasSpun = useRef(false);

  const drawWheel = useCallback((ctx, cx, cy, radius, rotation) => {
    ctx.clearRect(
      cx - radius - 20,
      cy - radius - 20,
      (radius + 20) * 2,
      (radius + 20) * 2,
    );

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.translate(-cx, -cy);

    const sliceAngle = (Math.PI * 2) / PRIZES.length;
    const isMobile = window.innerWidth < 600;
    const fontSize = isMobile
      ? Math.floor(radius * 0.13)
      : Math.floor(radius * 0.12);
    const emojiSize = isMobile
      ? Math.floor(radius * 0.18)
      : Math.floor(radius * 0.16);

    PRIZES.forEach((prize, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      const gradient = ctx.createRadialGradient(
        cx,
        cy,
        radius * 0.1,
        cx,
        cy,
        radius,
      );
      gradient.addColorStop(0, prize.color + "cc");
      gradient.addColorStop(1, prize.color + "55");
      ctx.fillStyle = gradient;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.translate(0, -radius * 0.6);
      ctx.rotate(Math.PI / 2);

      ctx.font = `${emojiSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(prize.emoji, 0, 0);

      ctx.font = `bold ${fontSize}px Montserrat, sans-serif`;
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.fillText(prize.text, 0, emojiSize * 0.9);
      ctx.shadowBlur = 0;

      ctx.restore();
    });

    // Center circle
    const centerGradient = ctx.createRadialGradient(
      cx,
      cy,
      0,
      cx,
      cy,
      radius * 0.18,
    );
    centerGradient.addColorStop(0, "#fff");
    centerGradient.addColorStop(0.5, "#ffe9bc");
    centerGradient.addColorStop(1, "#ffd700");
    ctx.fillStyle = centerGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(139, 90, 43, 0.6)";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  }, []);

  const startSpin = useCallback(() => {
    if (spinning || hasSpun.current) return;
    setSpinning(true);
    hasSpun.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isMobile = window.innerWidth < 600;
    const radius = Math.min(window.innerWidth * 0.42, isMobile ? 160 : 260);
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2 - 20;

    const targetIndex = Math.floor(Math.random() * PRIZES.length);
    const sliceAngle = (Math.PI * 2) / PRIZES.length;
    const targetAngle = -targetIndex * sliceAngle - sliceAngle / 2;
    const extraSpins = 4 + Math.floor(Math.random() * 3);
    const targetRotation =
      wheelRotationRef.current +
      extraSpins * Math.PI * 2 +
      targetAngle -
      (wheelRotationRef.current % (Math.PI * 2));

    const duration = 4500 + Math.random() * 1000;
    const start = performance.now();
    const startRotation = wheelRotationRef.current;

    playWinSound();

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 4);

      wheelRotationRef.current =
        startRotation + (targetRotation - startRotation) * ease;
      drawWheel(ctx, cx, cy, radius, wheelRotationRef.current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete - final draw and cleanup
        wheelRotationRef.current = targetRotation;
        drawWheel(ctx, cx, cy, radius, wheelRotationRef.current);
        rafRef.current = null;

        setTimeout(() => {
          setResult(PRIZES[targetIndex]);
          setSpinning(false);

          const resultEl = resultRef.current;
          if (resultEl) {
            gsap.fromTo(
              resultEl,
              { scale: 0.5, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
            );
          }
        }, 300);
      }
    };
    requestAnimationFrame(animate);
  }, [spinning, drawWheel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const container = containerRef.current;
    gsap.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.6 });

    const isMobile = window.innerWidth < 600;
    const radius = Math.min(window.innerWidth * 0.42, isMobile ? 160 : 260);
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2 - 20;

    drawWheel(ctx, cx, cy, radius, 0);

    // Auto spin after 1.5 seconds
    setTimeout(() => {
      startSpin();
    }, 1500);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawWheel, startSpin]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = window.innerWidth < 600;
      const radius = Math.min(window.innerWidth * 0.42, isMobile ? 160 : 260);
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2 - 20;

      drawWheel(ctx, cx, cy, radius, wheelRotationRef.current);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawWheel]);

  const handleContinue = () => {
    if (!hasSpun.current || !result) return;
    gsap.to(containerRef.current, { opacity: 0, duration: 0.5 }).then(() => {
      onComplete();
    });
  };

  return (
    <div ref={containerRef} className={styles.scene}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div ref={pointerRef} className={styles.pointer} />

      <h2 className={styles.title}>Vòng Quay May Mắn</h2>
      <p className={styles.subtitle}>Đang chờ kết quả...</p>

      {!result && <div className={styles.spinningText}>Vui lòng đợi...</div>}

      {result && (
        <div ref={resultRef} className={styles.resultCard}>
          <div className={styles.resultEmoji}>{result.emoji}</div>
          <div className={styles.resultText}>Bạn nhận được</div>
          <div className={styles.resultPrize}>{result.text}</div>
          <button className={styles.continueBtn} onClick={handleContinue}>
            Tiếp tục
          </button>
        </div>
      )}
    </div>
  );
}
