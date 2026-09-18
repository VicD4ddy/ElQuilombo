'use client';

import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [daysLeft, setDaysLeft] = useState<number>(16);

  useEffect(() => {
    const targetDate = new Date('2026-10-03T21:00:00');
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        setDaysLeft(days);
      } else {
        setDaysLeft(0);
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const elem = document.querySelector(href);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#hero" className="brand" onClick={(e) => handleSmoothScroll(e, '#hero')}>
          <img
            src="/recursos/El Quilombo.png"
            alt="Logo El Quilombo"
            className="brand-logo"
            width={120}
            height={48}
          />
        </a>

        <div className="date-badge">
          <span className="pulsing-dot" />
          <span>FALTAN {daysLeft} DÍAS • 3 DE OCT</span>
        </div>

        <nav className="nav-links">
          <a href="#experiencia" onClick={(e) => handleSmoothScroll(e, '#experiencia')}>Experiencia</a>
          <a href="#lineup" onClick={(e) => handleSmoothScroll(e, '#lineup')}>Lineup</a>
          <a href="#entradas" onClick={(e) => handleSmoothScroll(e, '#entradas')}>Entradas</a>
          <a href="#ubicacion" onClick={(e) => handleSmoothScroll(e, '#ubicacion')}>Ubicación</a>
          <a href="#faq" onClick={(e) => handleSmoothScroll(e, '#faq')}>FAQ</a>
        </nav>

        <div className="header-actions">
          <a
            href="#entradas"
            className="btn-header-cta"
            onClick={(e) => handleSmoothScroll(e, '#entradas')}
          >
            <span>Apartar Entrada</span>
            <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </header>
  );
}
