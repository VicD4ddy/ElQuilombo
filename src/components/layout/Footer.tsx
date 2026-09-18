import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand-col">
          <img
            src="/recursos/El Quilombo.png"
            alt="El Quilombo Logo"
            className="footer-logo"
            width={140}
            height={56}
          />
          <p className="footer-desc">
            La fiesta temática argentina que reúne los sonidos más influyentes del trap, freestyle, hip-hop, cumbia 420 y rock nacional en Valencia, Venezuela.
          </p>
          <div className="footer-social-links">
            <a
              href="https://www.instagram.com/elquilombo.vzla/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              title="Instagram Oficial"
            >
              Instagram @elquilombo.vzla ↗
            </a>
          </div>
        </div>

        <div className="footer-links-col">
          <h4 className="footer-col-title">Navegación</h4>
          <ul className="footer-links-list">
            <li><a href="#experiencia">Experiencia</a></li>
            <li><a href="#lineup">Lineup</a></li>
            <li><a href="#entradas">Preventa</a></li>
            <li><a href="#ubicacion">Ubicación</a></li>
            <li><a href="#faq">Preguntas Frecuentes</a></li>
          </ul>
        </div>

        <div className="footer-credits-col">
          <h4 className="footer-col-title">Créditos Oficiales</h4>
          <p className="footer-credit-line">
            <strong>Producción:</strong> El Quilombo Team
          </p>
          <p className="footer-credit-line">
            <strong>Diseño Gráfico:</strong>{' '}
            <a
              href="https://www.instagram.com/andrea_calanche/"
              target="_blank"
              rel="noopener noreferrer"
              className="credit-link"
            >
              @andrea_calanche
            </a>
          </p>
          <p className="footer-credit-line">
            <strong>Diseñador Web:</strong>{' '}
            <a
              href="https://www.instagram.com/Vicdaddy.js/"
              target="_blank"
              rel="noopener noreferrer"
              className="credit-link highlight-credit"
            >
              @Vicdaddy.js
            </a>
          </p>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="container footer-bottom-inner">
          <p>© 2026 El Quilombo. Todos los derechos reservados. Valencia, Venezuela.</p>
          <p className="footer-designer-tag">
            Desarrollo Web por{' '}
            <a
              href="https://www.instagram.com/Vicdaddy.js/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @Vicdaddy.js
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
