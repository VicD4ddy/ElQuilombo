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
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
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
