import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import styles from "../styles/LetterScene.module.css";

// Placeholder letter content - user can update later
const LETTER_CONTENT =
  "Người bạn thân yêu của tui,\n\nSinh nhật vui vẻ nha! Tui muốn nói rằng cậu là người bạn tuyệt vời nhất. Cảm ơn cậu đã luôn ở bên tui trong những lúc vui cũng như buồn.\n\nChúc cậu một năm mới tràn đầy niềm vui, sức khỏe dồi dào và gặp nhiều điều tốt lành!\n\nYêu cậu rất nhiều! 💝";

function playEnvelopeSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime;
    // Paper rustling + soft chime
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 800 + i * 200;
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.06, now + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.15 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.35);
    }
    setTimeout(() => ctx.close().catch(() => {}), 1500);
  } catch (e) {
    console.error("Error playing envelope sound:", e);
  }
}

export default function LetterScene({ onComplete }) {
  const containerRef = useRef(null);
  const envelopeRef = useRef(null);
  const flapRef = useRef(null);
  const letterRef = useRef(null);
  const letterContentRef = useRef(null);
  const [stage, setStage] = useState("closed"); // closed | opening | open | reading
  const handled = useRef(false);

  const typeText = useCallback((element, text, speed = 40) => {
    if (!element) return;
    element.textContent = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text[i];
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return interval;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const envelope = envelopeRef.current;
    const flap = flapRef.current;
    const letter = letterRef.current;

    gsap.set(container, { opacity: 0 });
    gsap.set(envelope, { scale: 0.6, opacity: 0 });
    gsap.set(flap, { rotationX: 0, transformOrigin: "top center" });
    gsap.set(letter, { y: 0, opacity: 0 });

    gsap.to(container, { opacity: 1, duration: 0.6 });

    gsap.to(envelope, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "back.out(1.5)",
    });
  }, []);

  const handleEnvelopeClick = () => {
    if (stage !== "closed" || handled.current) return;
    handled.current = true;
    setStage("opening");
    playEnvelopeSound();

    const flap = flapRef.current;
    const envelope = envelopeRef.current;
    const letter = letterRef.current;

    // Open flap animation
    gsap.to(flap, {
      rotationX: -170,
      duration: 0.7,
      ease: "power2.in",
    });

    gsap.to(envelope, {
      scale: 1.1,
      duration: 0.4,
      ease: "power2.out",
    });

    setTimeout(() => {
      setStage("open");
      gsap.to(letter, {
        y: -80,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.4)",
      });

      setTimeout(() => {
        setStage("reading");
        const content = letterContentRef.current;
        if (content) {
          gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 0.5 });
          typeText(content, LETTER_CONTENT, 35);
        }

        setTimeout(
          () => {
            if (!handled.current) return;
            handled.current = true;
            gsap
              .to(containerRef.current, { opacity: 0, duration: 0.6 })
              .then(() => {
                onComplete();
              });
          },
          LETTER_CONTENT.length * 35 + 4000,
        );
      }, 1000);
    }, 800);
  };

  const handleSkip = () => {
    if (handled.current) return;
    handled.current = true;

    const content = letterContentRef.current;
    if (content) {
      content.textContent = LETTER_CONTENT;
    }

    gsap.to(containerRef.current, { opacity: 0, duration: 0.6 }).then(() => {
      onComplete();
    });
  };

  return (
    <div ref={containerRef} className={styles.scene}>
      <h2 className={styles.title}>Một lá thư dành tặng bạn</h2>

      <div
        ref={envelopeRef}
        className={`${styles.envelope} ${stage !== "closed" ? styles.envelopeOpen : ""}`}
        onClick={handleEnvelopeClick}
      >
        <div className={styles.envelopeBody}>
          <div className={styles.envelopeShadow} />
        </div>
        <div ref={flapRef} className={styles.envelopeFlap}>
          <div className={styles.envelopeFlapInner} />
        </div>

        <div ref={letterRef} className={styles.letter}>
          <div className={styles.letterContent}>
            <div className={styles.letterDecorTop}>💌</div>
            <p ref={letterContentRef} className={styles.letterText} />
            <div className={styles.letterDecorBottom}>💝</div>
          </div>
        </div>
      </div>

      <p className={styles.hint}>
        {stage === "closed" && "Bấm vào phong bì để mở thư nhé"}
        {stage === "opening" && "Đang mở..."}
        {stage === "open" && "Lá thư đang hiện ra..."}
        {stage === "reading" && "Đang đọc lời chúc..."}
      </p>

      {stage === "reading" && (
        <button className={styles.skipBtn} onClick={handleSkip}>
          Bỏ qua
        </button>
      )}
    </div>
  );
}
