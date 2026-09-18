import React from 'react';
import { FAQS } from '../../data/faq';

export default function VenueFaqSection() {
  return (
    <>
      {/* Venue Section */}
      <section className="section" id="ubicacion">
        <div className="container">
          <div className="section-header">
            <span className="section-pill">Punto de Encuentro</span>
            <h2 className="section-title">
              EL LUGAR: <span className="text-gradient">ÓLEO GASTROBAR</span>
            </h2>
            <p className="section-subtitle">
              Uno de los spots más top de La Viña en Valencia, acondicionado especialmente con sonido y ambientación para El Quilombo.
            </p>
          </div>

          <div className="venue-grid">
            <div className="venue-card">
              <div className="venue-tag">📍 Ubicación Oficial</div>
              <h3 className="venue-name">Óleo Gastrobar</h3>
              <p className="venue-address">Urb. La Viña, Valencia, Estado Carabobo, Venezuela.</p>

              <ul className="venue-details-list">
                <li className="v-item">
                  <span className="v-item-icon">⏰</span>
                  <div>
                    <strong>Hora de inicio:</strong> 9:00 PM (Apertura de puertas)
                  </div>
                </li>
                <li className="v-item">
                  <span className="v-item-icon">🌙</span>
                  <div>
                    <strong>After Party:</strong> Hasta el amanecer con zona lounge
                  </div>
                </li>
                <li className="v-item">
                  <span className="v-item-icon">🛡️</span>
                  <div>
                    <strong>Seguridad & Estacionamiento:</strong> Vigilancia privada garantizada
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
                href="https://maps.google.com/?q=Oleo+Gastrobar+La+Viña+Valencia+Venezuela"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-maps"
              >
                <span>📍 Abrir en Google Maps</span>
                <span>↗</span>
              </a>
            </div>

            <div className="venue-map-frame">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.986795415712!2d-68.0125434!3d10.222384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e804368142ff6c5%3A0x6b772099f6ec36e6!2sLa%20Vi%C3%B1a%2C%20Valencia%2C%20Carabobo!5e0!3m2!1ses!2sve!4v1700000000000!5m2!1ses!2sve"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de Óleo Gastrobar, La Viña"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="section" id="faq">
        <div className="container">
          <div className="section-header">
            <span className="section-pill">Resolvemos tus Dudas</span>
            <h2 className="section-title">
              PREGUNTAS <span className="text-gradient">FRECUENTES</span>
            </h2>
            <p className="section-subtitle">
              Todo lo que necesitás saber antes de llegar al Quilombo.
            </p>
          </div>

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
        </div>
      </section>
    </>
  );
}
