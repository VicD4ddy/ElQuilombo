'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollReveal3DProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delayMs?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'flip';
}

export default function ScrollReveal3D({
  children,
  className = '',
  style = {},
  delayMs = 0,
  direction = 'up',
}: ScrollReveal3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Immediately reveal if already visible in initial viewport
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '40px 0px -20px 0px',
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`scroll-reveal-3d ${direction} ${isRevealed ? 'is-revealed' : ''} ${className}`}
      style={{
        transitionDelay: `${delayMs}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
