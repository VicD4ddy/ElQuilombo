import React from 'react';
import { FAQS } from '../../data/faq';
import ClubSonrisasSection from './ClubSonrisasSection';
import Tilt3DCard from '../effects/Tilt3DCard';
import ScrollReveal3D from '../effects/ScrollReveal3D';

export default function VenueFaqSection() {
  return (
    <>
      {/* Venue Section */}
      <section className="section" id="ubicacion" style={{ position: 'relative' }}>
        <div className="container">
          <ScrollReveal3D direction="up">
            <div className="section-header">
              <span className="section-pill badge-3d-float">Punto de Encuentro</span>
              <h2 className="section-title">
                EL LUGAR: <span className="text-gradient">ROCK &amp; RIFF</span>{' '}
                <span className="badge-3d-float" style={{ display: 'inline-block', verticalAlign: 'middle' }}>📍</span>
              </h2>
            </div>
          </ScrollReveal3D>

          <div className="venue-grid">
            <Tilt3DCard maxTilt={8} scale={1.015} glare={true} glareOpacity={0.18}>
              <div className="venue-card" style={{ height: '100%' }}>
                <div className="venue-tag" style={{ transform: 'translateZ(25px)' }}>📍 Ubicación Oficial</div>
                <h3 className="venue-name" style={{ transform: 'translateZ(20px)' }}>Rock &amp; Riff</h3>
                <p className="venue-address" style={{ transform: 'translateZ(15px)' }}>
                  Urb. La Viña, Valencia, Estado Carabobo.
                  <br />
                  <span style={{ fontSize: '0.78rem', color: '#ffd600', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.45rem' }}>
                    ℹ️ Nota: En Google Maps figura aún como &ldquo;Óleo Gastrobar&rdquo;
                  </span>
                </p>

                <div style={{ margin: '0.75rem 0 1.25rem', transform: 'translateZ(20px)' }}>
                  <a
                    href="https://www.instagram.com/rocknriffbar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tag-badge tag-loc"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>📷 @rocknriffbar ↗</span>
                  </a>
                </div>

                <ul className="venue-details-list" style={{ transform: 'translateZ(15px)' }}>
                  <li className="v-item">
                    <span className="v-item-icon">⏰</span>
                    <div>
                      <strong>Horario:</strong> 8:00 PM a 3:00 AM (Apertura de puertas 8:00 PM)
                    </div>
                  </li>
                  <li className="v-item">
                    <span className="v-item-icon">🌙</span>
                    <div>
                      <strong>After Party:</strong> Confirmado (la fiesta sigue extendida)
                    </div>
                  </li>
                  <li className="v-item">
                    <span className="v-item-icon">🔞</span>
                    <div>
                      <strong>Edad de Ingreso:</strong> Mayores de +15 años (con representante si es menor)
                    </div>
                  </li>
                  <li className="v-item">
                    <span className="v-item-icon">👟</span>
                    <div>
                      <strong>Dress Code:</strong> Streetwear, aesthetic urbano o camisetas de Argentina
                    </div>
                  </li>
                </ul>

                <a
                  href="https://maps.app.goo.gl/TVEdzrkQBRe8s6H59"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-maps btn-3d-tactile"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  <span>📍 Abrir en Google Maps</span>
                  <span>↗</span>
                </a>
              </div>
            </Tilt3DCard>

            <div className="venue-map-frame">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1964.9!2d-68.0100133!3d10.2134622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e80456bcc98cbdb%3A0x7681825935910fd6!2sOleo%20Gastrobar!5e0!3m2!1ses!2sve!4v1700000000000!5m2!1ses!2sve"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de ubicación Rock and Riff (Óleo Gastrobar, La Viña)"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Club Sonrisas: Recaudación para los Afectados de La Guaira */}
      <ClubSonrisasSection />

      {/* FAQ Accordion Section */}
      <section className="section" id="faq" style={{ position: 'relative' }}>
        <div className="container">
          <ScrollReveal3D direction="up">
            <div className="section-header">
              <span className="section-pill badge-3d-float">Resolvemos tus Dudas</span>
              <h2 className="section-title">
                PREGUNTAS <span className="text-gradient">FRECUENTES</span>{' '}
                <span className="badge-3d-float" style={{ display: 'inline-block', verticalAlign: 'middle' }}>❓</span>
              </h2>
              <p className="section-subtitle">
                Todo lo que necesitás saber antes de llegar al Quilombo.
              </p>
            </div>
          </ScrollReveal3D>

          <ScrollReveal3D direction="up" delayMs={100}>
            <div className="faq-container">
              {FAQS.map((faq, idx) => (
                <details key={idx} className="faq-item" open={faq.defaultOpen}>
                  <summary className="faq-summary">
                    <span>{faq.question}</span>
                    <span className="faq-arrow">+</span>
                  </summary>
                  <div className="faq-content">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </ScrollReveal3D>
        </div>
      </section>
    </>
  );
}
