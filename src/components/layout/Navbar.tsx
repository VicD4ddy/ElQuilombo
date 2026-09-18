'use client';

import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [daysLeft, setDaysLeft] = useState<number>(16);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <header className="navbar">
      <div className="container">
        <a href="#hero" className="nav-brand" onClick={(e) => handleSmoothScroll(e, '#hero')}>
          <img
            src="/assets/img/el-quilombo-logo.png"
            alt="El Quilombo"
            className="nav-logo-img"
          />
        </a>

        <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`} id="nav-links">
          <li>
            <a href="#experiencia" className="nav-link" onClick={(e) => handleSmoothScroll(e, '#experiencia')}>
              Experiencia
            </a>
          </li>
          <li>
            <a href="#lineup" className="nav-link" onClick={(e) => handleSmoothScroll(e, '#lineup')}>
              Artistas
            </a>
          </li>
          <li>
            <a href="#entradas" className="nav-link" onClick={(e) => handleSmoothScroll(e, '#entradas')}>
              Entradas
            </a>
          </li>
          <li>
            <a href="#ubicacion" className="nav-link" onClick={(e) => handleSmoothScroll(e, '#ubicacion')}>
              Ubicación
            </a>
          </li>
          <li>
            <a href="#faq" className="nav-link" onClick={(e) => handleSmoothScroll(e, '#faq')}>
              FAQ
            </a>
          </li>
        </ul>

        <div className="nav-right-actions">
          <div className="nav-pill-date">
            <span className="dot" />
            <span id="nav-cd-pill">3 Oct • Preventa Activa ({daysLeft}d)</span>
          </div>
          <a
            href="#entradas"
            className="btn-nav-cta"
            onClick={(e) => handleSmoothScroll(e, '#entradas')}
          >
            Apartar Entrada
          </a>
          <button
            className="nav-toggle"
            id="nav-toggle"
            aria-label="Abrir Menú"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
