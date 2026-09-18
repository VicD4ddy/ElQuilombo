'use client';

import React from 'react';

export default function Footer() {
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
    <footer className="footer" id="contacto" style={{ paddingBottom: '160px' }}>
      <div className="container">
        <div className="footer-grid">
          
          {/* Columna 1: Brand & Bio */}
          <div className="footer-brand">
            <img
              src="/assets/img/el-quilombo-logo.png"
              alt="El Quilombo Logo"
              className="footer-logo-img"
            />
            <p className="footer-desc">
              La fiesta temática que une a los amantes del trap, freestyle, cumbia 420 y la cultura urbana argentina en Valencia, Venezuela.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <a
                href="https://www.instagram.com/elquilombo.vzla/"
                target="_blank"
                rel="noopener noreferrer"
                className="tag-badge tag-arg"
                style={{ textDecoration: 'none' }}
              >
                @elquilombo.vzla ↗
              </a>
              <a
                href="https://www.instagram.com/oleo.gastrobar/"
                target="_blank"
                rel="noopener noreferrer"
                className="tag-badge tag-loc"
                style={{ textDecoration: 'none' }}
              >
                @oleo.gastrobar ↗
              </a>
            </div>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h4 className="footer-col-title">Navegación</h4>
            <ul className="footer-links">
              <li>
                <a href="#hero" className="footer-link" onClick={(e) => handleSmoothScroll(e, '#hero')}>
                  Inicio
                </a>
              </li>
              <li>
                <a href="#experiencia" className="footer-link" onClick={(e) => handleSmoothScroll(e, '#experiencia')}>
                  Experiencia
                </a>
              </li>
              <li>
                <a href="#lineup" className="footer-link" onClick={(e) => handleSmoothScroll(e, '#lineup')}>
                  Artistas
                </a>
              </li>
              <li>
                <a href="#entradas" className="footer-link" onClick={(e) => handleSmoothScroll(e, '#entradas')}>
                  Preventa
                </a>
              </li>
              <li>
                <a href="#ubicacion" className="footer-link" onClick={(e) => handleSmoothScroll(e, '#ubicacion')}>
                  Ubicación
                </a>
              </li>
              <li>
                <a href="#faq" className="footer-link" onClick={(e) => handleSmoothScroll(e, '#faq')}>
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Créditos Oficiales */}
          <div>
            <h4 className="footer-col-title">Créditos Oficiales</h4>
            <ul className="footer-links">
              <li>
                <a
                  href="https://www.instagram.com/belleamar_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Creadora: <span style={{ color: '#fff' }}>@belleamar_</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/andrea_calanche/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Diseño Gráfico: <span style={{ color: '#fff' }}>@andrea_calanche</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/Vicdaddy.js/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                  style={{ color: 'var(--neon-cyan)', fontWeight: 800 }}
                >
                  Diseñador Web: @Vicdaddy.js
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/oleo.gastrobar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Venue: <span style={{ color: '#fff' }}>@oleo.gastrobar</span>
                </a>
              </li>
              <li>
                <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                  Valencia, Edo. Carabobo 🇻🇪
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Barra Inferior del Footer */}
        <div className="footer-bottom">
          <span>© 2026 El Quilombo Vzla. Todos los derechos reservados.</span>
          <span>
            Diseño & Desarrollo Web por{' '}
            <a
              href="https://www.instagram.com/Vicdaddy.js/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--neon-cyan)', fontWeight: 800, textDecoration: 'none' }}
            >
              @Vicdaddy.js
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
