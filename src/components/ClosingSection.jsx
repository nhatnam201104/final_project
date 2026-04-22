import { useEffect, useState, useCallback } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import styles from "../styles/ClosingSection.module.css";

const BALLOON_COLORS = [
  "#F8dae9",
  "#b9d6f3",
  "#ff6b9d",
  "#c084fc",
  "#fbbf24",
  "#34d399",
];

export default function ClosingSection() {
  const [ref, isVisible] = useIntersectionObserver();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const container = document.querySelector(`.${styles.balloonContainer}`);
    if (!container || container.children.length > 0) return;

    for (let i = 0; i < 18; i++) {
      const balloon = document.createElement("div");
      balloon.className = styles.balloon;
      const color =
        BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
      balloon.style.cssText = `
        --color: ${color};
        --delay: ${Math.random() * 8}s;
        --duration: ${8 + Math.random() * 10}s;
        --sway: ${-30 + Math.random() * 60}deg;
        --x: ${Math.random() * 100}%;
        left: var(--x);
        animation-delay: var(--delay);
        animation-duration: var(--duration);
      `;
      container.appendChild(balloon);
    }

    const heartsContainer = document.querySelector(
      `.${styles.heartsContainer}`,
    );
    if (!heartsContainer || heartsContainer.children.length > 0) return;

    for (let i = 0; i < 12; i++) {
      const heart = document.createElement("div");
      heart.className = styles.heart;
      heart.style.cssText = `
        --delay: ${Math.random() * 10}s;
        --duration: ${6 + Math.random() * 8}s;
        --x: ${Math.random() * 100}%;
        --size: ${16 + Math.random() * 14}px;
        left: var(--x);
        animation-delay: var(--delay);
        animation-duration: var(--duration);
      `;
      heart.textContent = "❤";
      heartsContainer.appendChild(heart);
    }
  }, [isVisible]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: "Chúc Mừng Sinh Nhật!",
      text: "Một ngày đặc biệt dành cho bạn!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        // user cancelled
        console.log(e);
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          shareData.text + " " + shareData.url,
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        // clipboard not available
        console.log(e);
      }
    }
  }, []);

  return (
    <section
      ref={ref}
      className={`${styles.closingSection} ${isVisible ? styles.visible : ""}`}
      id="closing-section"
    >
      <div className={styles.balloonContainer} aria-hidden="true" />
      <div className={styles.heartsContainer} aria-hidden="true" />

      <div className={styles.content}>
        <h2 className={styles.heading}>Thank You</h2>
        <p className={styles.message}>
          Cảm ơn bạn đã đến đây.
          <br />
          Chúc bạn một cuộc đời thật nhiều niềm vui!
        </p>

        <button className={styles.shareBtn} onClick={handleShare}>
          {copied ? "Đã sao chép!" : "Gửi yêu thương"}
        </button>
      </div>
    </section>
  );
}
