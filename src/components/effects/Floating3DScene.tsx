'use client';

import React, { useEffect, useState } from 'react';

interface Floating3DSceneProps {
  intensity?: 'subtle' | 'vibrant';
  showVinyl?: boolean;
}

export default function Floating3DScene({
  intensity = 'vibrant',
  showVinyl = true,
}: Floating3DSceneProps) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Only bind mousemove on devices with fine pointer (mouse/trackpad) to save mobile battery
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return;

    let rafId: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        setMouseOffset({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className={`floating-3d-scene ${intensity}`}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        perspective: '1200px',
      }}
    >
      {/* 3D Parallax Space Container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate3d(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px, 0)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Floating 3D Vinyl Record */}
        {showVinyl && (
          <div
            className="floating-vinyl-3d-wrap"
            style={{
              position: 'absolute',
              top: '12%',
              right: '5%',
              transform: `translate3d(${mouseOffset.x * -0.6}px, ${mouseOffset.y * -0.6}px, 50px) rotateX(25deg) rotateY(-20deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="vinyl-disc-3d">
              {/* Outer Vinyl Grooves */}
              <div className="vinyl-groove-rings" />
              {/* Center Holographic Label */}
              <div className="vinyl-center-label">
                <span className="vinyl-center-logo">Q</span>
                <span className="vinyl-center-text">QUILOMBO SOUND</span>
              </div>
              {/* Spindle hole */}
              <div className="vinyl-spindle-hole" />
              {/* Light Sheen Reflection */}
              <div className="vinyl-glare-reflection" />
            </div>
          </div>
        )}

        {/* 3D Floating Neon Diamonds & Cyber Shapes */}
        <div
          className="floating-neon-gem gem-1"
          style={{
            position: 'absolute',
            top: '25%',
            left: '8%',
            transform: `translate3d(${mouseOffset.x * 0.8}px, ${mouseOffset.y * 0.8}px, 40px)`,
          }}
        >
          <div className="gem-3d-face front" />
          <div className="gem-3d-face back" />
        </div>

        <div
          className="floating-neon-gem gem-2"
          style={{
            position: 'absolute',
            top: '68%',
            right: '12%',
            transform: `translate3d(${mouseOffset.x * -0.7}px, ${mouseOffset.y * -0.7}px, 60px)`,
          }}
        >
          <div className="gem-3d-face front cyan" />
          <div className="gem-3d-face back cyan" />
        </div>

        <div
          className="floating-neon-gem gem-3"
          style={{
            position: 'absolute',
            top: '82%',
            left: '15%',
            transform: `translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 20px)`,
          }}
        >
          <div className="gem-3d-face front pink" />
          <div className="gem-3d-face back pink" />
        </div>

        {/* Ambient 3D Neon Glow Orbs */}
        <div
          className="ambient-orb-3d orb-purple"
          style={{
            position: 'absolute',
            top: '15%',
            left: '20%',
            transform: `translate3d(${mouseOffset.x * 0.3}px, ${mouseOffset.y * 0.3}px, -100px)`,
          }}
        />

        <div
          className="ambient-orb-3d orb-cyan"
          style={{
            position: 'absolute',
            top: '55%',
            right: '18%',
            transform: `translate3d(${mouseOffset.x * -0.3}px, ${mouseOffset.y * -0.3}px, -80px)`,
          }}
        />
      </div>
    </div>
  );
}
