import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/CakeSection.module.css';

// Generate random sparkle styles once at module load time (not during render)
const sparkleStyles = Array.from({ length: 10 }).map(() => ({
  left: `${20 + Math.random() * 60}%`,
  top: `${10 + Math.random() * 30}%`,
  animationDelay: `${Math.random() * 2}s`,
  animationDuration: `${1.5 + Math.random() * 1.5}s`,
}));

export default function CakeSection() {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section
      ref={ref}
      className={`${styles.cakeSection} ${isVisible ? styles.visible : ''}`}
      id="cake-section"
    >
      <div className={styles.bgCircle} aria-hidden="true" />
      <div className={styles.bgCircle} aria-hidden="true" />
      <div className={styles.bgCircle} aria-hidden="true" />

      <h2 className={styles.heading}>Happy Birthday!</h2>
      <p className={styles.subheading}>Một chiếc bánh nhỏ dành cho bạn</p>

      <div className={styles.cakeContainer}>
        <div className={styles.sparkles}>
          {sparkleStyles.map((style, i) => (
            <span key={i} className={styles.sparkle} style={style} />
          ))}
        </div>

        <div className={styles.candles}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.candle}>
              <div className={styles.flame} style={{ animationDelay: `${i * 0.15}s` }} />
              <div className={styles.flameGlow} style={{ animationDelay: `${i * 0.15}s` }} />
              <div className={styles.candleBody} />
            </div>
          ))}
        </div>

        <div className={styles.cakeTop}>
          <div className={styles.frosting} />
        </div>
        <div className={styles.cakeMiddle} />
        <div className={styles.cakeBottom} />
        <div className={styles.cakePlate} />
      </div>

      <p className={styles.cakeLabel}>✨ Make a wish! ✨</p>
    </section>
  );
}
