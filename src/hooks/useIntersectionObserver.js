import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver(callback, options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (callback) callback(element);
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [callback, options]);

  return [ref, isVisible];
}
