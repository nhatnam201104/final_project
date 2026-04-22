import { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/MessageSection.module.css';

const MESSAGES = [
  'Những ngày qua, mình đã nghĩ về bạn...',
  'Về những ngày chúng ta đã cùng nhau đi qua,',
  'về những nụ cười và cả những giọt nước mắt.',
  '',
  'Hôm nay là một ngày đặc biệt!',
  'Chúc bạn sinh nhật vui vẻ, hạnh phúc!',
  'Mong rằng mọi điều tốt đẹp sẽ đến với bạn.',
  '',
  'Cảm ơn vì đã luôn là chính mình,',
  'vì đã luôn mang nụ cười đến cho mọi người.',
  '',
  'Happy Birthday! 🎂💕',
];

function typeLine(element, text, speed = 50) {
  return new Promise((resolve) => {
    let i = 0;
    element.textContent = '';
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }
    type();
  });
}

export default function MessageSection() {
  const [ref, isVisible] = useIntersectionObserver();
  const [started, setStarted] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      setStarted(true);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!started) return;

    const lines = document.querySelectorAll(`.${styles.line}`);
    let index = 0;

    async function animateNext() {
      if (index < lines.length) {
        const line = lines[index];
        const text = MESSAGES[index];
        line.style.opacity = '1';
        if (text === '') {
          index++;
          setTimeout(animateNext, 300);
        } else {
          await typeLine(line, text, 50);
          index++;
          setTimeout(animateNext, 400);
        }
      }
    }

    const timer = setTimeout(animateNext, 500);
    return () => clearTimeout(timer);
  }, [started]);

  return (
    <section
      ref={ref}
      className={`${styles.messageSection} ${isVisible ? styles.visible : ''}`}
      id="message-section"
    >
      <div className={styles.letterPaper}>
        <p className={styles.dear}>Gửi bạn,</p>
        {MESSAGES.map((_, i) => (
          <p key={i} className={styles.line} />
        ))}
        <p className={styles.sign}>— Từ tận đáy lòng ❤️</p>
      </div>
    </section>
  );
}
