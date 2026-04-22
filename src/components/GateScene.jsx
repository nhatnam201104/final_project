/* eslint-disable no-unused-vars */
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useCanvasAnimation } from "../hooks/useCanvasAnimation";
import styles from "../styles/GateScene.module.css";

function playPortalChime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime;
    [659.25, 783.99, 987.77].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.1, now + i * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 1.25);
    });
    setTimeout(() => ctx.close().catch(() => {}), 1400);
  } catch (e) {
    console.log(e);
  }
}

export default function GateScene({ onComplete }) {
  const { canvasRef, fitCanvas, stopAnimation } = useCanvasAnimation();
  const ringRef = useRef(null);
  const coreRef = useRef(null);
  const textRef = useRef(null);
  const flashRef = useRef(null);

  const runCanvas = useCallback(
    (durationMs) => {
      const canvas = canvasRef.current;
      if (!canvas) return Promise.resolve();
      const ctx = canvas.getContext("2d");
      let stars = [];

      const initStars = (w, h) => {
        const count = Math.min(1700, Math.max(750, Math.floor((w * h) / 1400)));
        stars = new Array(count).fill(0).map(() => ({
          x: Math.random() * w,
          y: Math.random() * h,
          size: 0.6 + Math.random() * 1.8,
          alpha: 0.1 + Math.random() * 0.8,
          tw: Math.random() * Math.PI * 2,
        }));
      };

      return new Promise((resolve) => {
        const start = performance.now();
        let raf;

        function frame(now) {
          const { width, height } = fitCanvas(ctx);
          if (stars.length === 0) initStars(width, height);

          const progress = Math.min(1, (now - start) / durationMs);
          const cx = width / 2;
          const cy = height / 2;

          ctx.fillStyle = `rgba(1, 3, 8, ${0.28 + progress * 0.45})`;
          ctx.fillRect(0, 0, width, height);

          for (const s of stars) {
            s.tw += 0.024;
            const a = s.alpha + Math.sin(s.tw) * 0.25;
            ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, a))})`;
            ctx.fillRect(s.x, s.y, s.size, s.size);
          }

          const rr = (0.08 + progress * 0.34) * Math.min(width, height);
          ctx.lineWidth = 2 + progress * 2;
          ctx.strokeStyle = `rgba(247, 209, 126, ${0.75 - progress * 0.52})`;
          ctx.beginPath();
          ctx.arc(cx, cy, rr, 0, Math.PI * 2);
          ctx.stroke();

          if (progress > 0.28) {
            const rayCount = 26;
            const raySpread = 110 + progress * 380;
            for (let i = 0; i < rayCount; i++) {
              const angle = (Math.PI * 2 * i) / rayCount + progress * 2.5;
              const inner = rr * 0.6;
              const outer = rr + raySpread * (0.2 + Math.random() * 0.8);
              ctx.strokeStyle = `rgba(255, 232, 182, ${0.15 + (1 - progress) * 0.3})`;
              ctx.lineWidth = 1 + Math.random() * 1.6;
              ctx.beginPath();
              ctx.moveTo(
                cx + Math.cos(angle) * inner,
                cy + Math.sin(angle) * inner,
              );
              ctx.lineTo(
                cx + Math.cos(angle) * outer,
                cy + Math.sin(angle) * outer,
              );
              ctx.stroke();
            }
          }

          if (progress > 0.84) {
            for (let i = 0; i < 180; i++) {
              const angle = Math.random() * Math.PI * 2;
              const dist =
                (progress - 0.84) *
                Math.min(width, height) *
                (0.2 + Math.random() * 1.4);
              ctx.fillStyle = `rgba(255, 246, 222, ${0.35 + Math.random() * 0.5})`;
              ctx.fillRect(
                cx + Math.cos(angle) * dist,
                cy + Math.sin(angle) * dist,
                1.8,
                1.8,
              );
            }
          }

          if (progress < 1) {
            raf = requestAnimationFrame(frame);
          } else {
            ctx.clearRect(0, 0, width, height);
            resolve();
          }
        }
        raf = requestAnimationFrame(frame);
      });
    },
    [canvasRef, fitCanvas],
  );

  useEffect(() => {
    playPortalChime();

    const ring = ringRef.current;
    const core = coreRef.current;
    const text = textRef.current;
    const flash = flashRef.current;

    gsap.set(ring, { opacity: 0, scale: 0.18 });
    gsap.set(core, { opacity: 0, scale: 0.3 });
    gsap.set(text, { opacity: 0, y: 14, filter: "blur(4px)" });
    gsap.set(flash, { opacity: 0, scale: 0.4 });

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: onComplete,
    });
    tl.to(ring, { opacity: 1, scale: 1, duration: 1.25 }, 0);
    tl.to(core, { opacity: 1, scale: 1.14, duration: 1.2 }, 0.15);
    tl.to(text, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 }, 0.72);
    tl.to(
      ring,
      { scale: 1.58, opacity: 0.1, duration: 1.05, ease: "power1.in" },
      1.85,
    );
    tl.to(
      core,
      { scale: 1.9, opacity: 0, duration: 0.9, ease: "power1.in" },
      2.05,
    );
    tl.to(text, { opacity: 0, filter: "blur(10px)", duration: 0.6 }, 2.15);
    tl.to(
      flash,
      { opacity: 1, scale: 1.65, duration: 0.42, ease: "power4.out" },
      2.44,
    );
    tl.to(flash, { opacity: 0, duration: 0.4, ease: "power1.in" }, 2.72);

    runCanvas(3000);

    return () => {
      tl.kill();
      stopAnimation();
    };
  }, [onComplete, runCanvas, stopAnimation]);

  return (
    <div className={styles.scene}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.portalWrap}>
        <div ref={ringRef} className={styles.portalRing} />
        <div ref={coreRef} className={styles.portalCore} />
      </div>
      <h2 ref={textRef} className={styles.gateText}>
        Khoảnh khắc của bạn sắp được hé lộ...
      </h2>
      <div ref={flashRef} className={styles.gateFlash} />
    </div>
  );
}
