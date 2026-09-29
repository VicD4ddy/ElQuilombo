'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';

interface Tilt3DCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  glare?: boolean;
  glareOpacity?: number;
  disabled?: boolean;
}

export default function Tilt3DCard({
  children,
  className = '',
  style = {},
  maxTilt = 12,
  perspective = 1000,
  scale = 1.02,
  glare = true,
  glareOpacity = 0.2,
  disabled = false,
  ...rest
}: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>('');
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !cardRef.current) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (-maxTilt to +maxTilt)
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      // Glare calculation
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        setTransform(
          `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
        );

        if (glare) {
          setGlareStyle({
            opacity: glareOpacity,
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.45) 0%, rgba(168, 85, 247, 0.2) 40%, rgba(0, 240, 255, 0) 75%)`,
          });
        }
      });
    },
    [disabled, maxTilt, perspective, scale, glare, glareOpacity]
  );

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;
    setIsHovered(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;
    setIsHovered(false);
    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
      if (glare) {
        setGlareStyle({ opacity: 0 });
      }
    });
  }, [disabled, perspective, glare]);

  // Touch support for mobile: gentle tilt upon touch
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (disabled || !cardRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        handleMouseLeave();
        return;
      }

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -(maxTilt * 0.75);
      const rotateY = ((x - centerX) / centerX) * (maxTilt * 0.75);

      setTransform(
        `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
      );
    },
    [disabled, maxTilt, perspective, scale, handleMouseLeave]
  );

  const handleTouchEnd = useCallback(() => {
    handleMouseLeave();
  }, [handleMouseLeave]);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`tilt-3d-card ${isHovered ? 'tilt-active' : ''} ${className}`}
      style={{
        transform: transform || `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transformStyle: 'preserve-3d',
        transition: isHovered ? 'transform 0.1s cubic-bezier(0.2, 0.8, 0.4, 1)' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.4, 1)',
        willChange: 'transform',
        position: 'relative',
        ...style,
      }}
      {...rest}
    >
      {children}

      {/* Holographic Specular Glare Reflection Layer */}
      {glare && (
        <div
          className="tilt-3d-glare-overlay"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 10,
            transition: isHovered ? 'opacity 0.2s ease' : 'opacity 0.5s ease',
            ...glareStyle,
          }}
        />
      )}
    </div>
  );
}
