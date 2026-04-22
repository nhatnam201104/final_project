import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/TeddySection.module.css';

export default function TeddySection() {
  const [ref, isVisible] = useIntersectionObserver();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const section = ref.current;
    if (!section) return;

    const bgSparkles = section.querySelector(`.${styles.bgSparkles}`);
    if (bgSparkles && bgSparkles.children.length === 0) {
      for (let i = 0; i < 20; i++) {
        const spark = document.createElement('div');
        spark.className = styles.bgSparkle;
        spark.style.cssText = `
          --size: ${3 + Math.random() * 5}px;
          --delay: ${Math.random() * 6}s;
          --dur: ${3 + Math.random() * 4}s;
          --x: ${Math.random() * 100}%;
          --y: ${Math.random() * 100}%;
        `;
        bgSparkles.appendChild(spark);
      }
    }

    const heartsContainer = section.querySelector(`.${styles.floatingHearts}`);
    if (heartsContainer && heartsContainer.children.length === 0) {
      for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.className = styles.floatingHeart;
        heart.style.cssText = `
          --delay: ${Math.random() * 8}s;
          --dur: ${5 + Math.random() * 6}s;
          --x: ${Math.random() * 100}%;
          --size: ${14 + Math.random() * 16}px;
        `;
        heart.textContent = ['❤', '💕', '💗', '💖'][Math.floor(Math.random() * 4)];
        heartsContainer.appendChild(heart);
      }
    }
  }, [isVisible, ref]);

  return (
    <section
      ref={ref}
      className={styles.teddySection}
      id="teddy-section"
    >
      <div className={styles.bgSparkles} aria-hidden="true" />

      <h2 className={`${styles.heading} ${isVisible ? styles.visible : ''}`}>
        Từ Gấu Bông Dành Cho Bạn
      </h2>
      <p className={`${styles.subheading} ${isVisible ? styles.visible : ''}`}>
        Một lời chúc từ người bạn nhỏ bé nhất
      </p>

      <div className={styles.cards}>
        <div className={`${styles.imageCard} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.imageInner}>
            <div className={styles.imagePlaceholder}>
              <span>🧸</span>
              <p>Ảnh cùng gấu bông</p>
            </div>
          </div>
          <p className={styles.imageCaption}>Bạn và gấu bông</p>
        </div>

        <div className={`${styles.messageCard} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.teddyIcon}>
            <span className={styles.teddyEmoji}>🧸</span>
          </div>

          <div className={styles.speechBubble}>
            <p>
              Tớ là gấu bông của bạn nè! Mỗi ngày được ở bên bạn là niềm hạnh phúc lớn nhất của tớ.
              Chúc bạn sinh nhật thật vui vẻ, hạnh phúc và luôn cười thật tươi nha!
            </p>
          </div>

          <p className={styles.signature}>— Gấu bông của bạn ❤️</p>

          <div className={styles.floatingHearts} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
