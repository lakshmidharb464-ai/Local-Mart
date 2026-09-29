import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal - triggers reveal when element enters viewport
 * @param {object} options - IntersectionObserver options
 * @returns [ref, isVisible]
 */
export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    // Check immediately if element is already within viewport on mount
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
        setIsVisible(true);
        return;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '100px 0px 50px 0px', ...options }
    );

    if (ref.current) {
      observer.observe(ref.current);
    } else {
      setIsVisible(true);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

/**
 * useCountUp - animates a number from 0 to target when triggered
 */
export const useCountUp = (target, duration = 2000, trigger = true) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, target, duration]);
  return count;
};
