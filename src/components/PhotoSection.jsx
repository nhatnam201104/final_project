import { useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/PhotoSection.module.css';

export default function PhotoSection() {
  const [ref, isVisible] = useIntersectionObserver();

  useEffect(() => {
    if (!isVisible) return;

    const section = ref.current;
    if (!section) return;

    const particles = section.querySelector(`.${styles.particles}`);
    if (particles && particles.children.length === 0) {
      for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = styles.particle;
        p.style.cssText = `
          --delay: ${Math.random() * 5}s;
          --dur: ${4 + Math.random() * 5}s;
          --x: ${Math.random() * 100}%;
          --y: ${Math.random() * 100}%;
          --size: ${3 + Math.random() * 6}px;
          --color: ${['#F8dae9', '#b9d6f3', '#fbbf24', '#c084fc', '#ff6b9d'][Math.floor(Math.random() * 5)]};
        `;
        particles.appendChild(p);
      }
    }
  }, [isVisible]);

  return (
    <section
      ref={ref}
      className={`${styles.photoSection} ${isVisible ? styles.visible : ''}`}
      id="photo-section"
    >
      <div className={styles.particles} aria-hidden="true" />

      <div className={styles.content}>
        <h2 className={styles.heading}>
          <span className={styles.headingLine} />
          <span className={styles.headingText}>Những khoảnh khắc đẹp</span>
          <span className={styles.headingLine} />
        </h2>
        <p className={styles.subheading}>Những kỷ niệm đáng nhớ bên bạn</p>
      </div>

      <div className={styles.frames}>
        <div className={styles.frame} style={{ '--tilt': '-3deg' }}>
          <div className={styles.frameReveal}>
            <div className={styles.frameInner}>
              <div className={styles.placeholder}>
                <span>📷</span>
                <p>Ảnh 1</p>
              </div>
            </div>
          </div>
          <p className={styles.caption}>Kỷ niệm 1</p>
          <div className={styles.frameCornerTL} />
          <div className={styles.frameCornerBR} />
        </div>

        <div className={styles.frame} style={{ '--tilt': '2deg' }}>
          <div className={styles.frameReveal}>
            <div className={styles.frameInner}>
              <div className={styles.placeholder}>
                <span>📷</span>
                <p>Ảnh 2</p>
              </div>
            </div>
          </div>
          <p className={styles.caption}>Kỷ niệm 2</p>
          <div className={styles.frameCornerTL} />
          <div className={styles.frameCornerBR} />
        </div>
      </div>
    </section>
  );
}
