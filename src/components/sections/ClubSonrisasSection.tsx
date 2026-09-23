import React from 'react';

export default function ClubSonrisasSection() {
  return (
    <section className="section club-sonrisas-section" id="club-sonrisas">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-pill" style={{ borderColor: 'rgba(255, 214, 0, 0.4)', color: '#ffd600', background: 'rgba(255, 214, 0, 0.08)' }}>
            💛 Causa Solidaria • Club Sonrisas
          </span>
          <h2 className="section-title">
            RECAUDACIÓN SOLIDARIA: <span className="text-gradient">UNIDOS POR LA GUAIRA</span>
          </h2>
          <p className="section-subtitle">
            Porque la música nos une y la empatía nos define. Este 09 de Octubre en Rock &amp; Riff nos unimos a <strong>Club Sonrisas</strong> para recaudar insumos y fondos para las familias afectadas por el doble terremoto del 24 de junio en La Guaira.
          </p>
        </div>

        {/* Hero Spotlight Card */}
        <div className="club-sonrisas-hero-card">
          <div className="club-sonrisas-hero-grid">
            {/* Left: Logo & Partnership Badge */}
            <div className="club-sonrisas-brand-col">
              <a
                href="https://www.instagram.com/clubsonrisasproject?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="club-sonrisas-logo-box"
                title="Visitar Instagram de @clubsonrisasproject"
              >
                <img
                  src="/assets/img/club-sonrisas.png"
                  alt="Club Sonrisas Logo Oficial"
                  className="club-sonrisas-logo-img"
                  loading="lazy"
                />
              </a>
              <a
                href="https://www.instagram.com/clubsonrisasproject?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="club-sonrisas-badge"
                title="Visitar Instagram de @clubsonrisasproject"
              >
                <span>✨</span> ALIANZA OFICIAL EL QUILOMBO ↗
              </a>
            </div>

            {/* Right: Mission Statement */}
            <div className="club-sonrisas-text-col">
              <h3 className="club-sonrisas-hero-heading">
                Bailar, disfrutar y tenderle la mano a nuestra gente 🇻🇪
              </h3>
              <p className="club-sonrisas-hero-desc">
                Durante toda la noche de <strong>El Quilombo</strong>, el equipo voluntario de <strong>Club Sonrisas</strong> tendrá habilitado un <strong>Centro de Acopio en Puerta</strong> y alcancías de recaudación solidaria dentro de <strong>Rock &amp; Riff</strong>.
              </p>
              <div style={{ marginTop: '0.35rem' }}>
                <a
                  href="https://www.instagram.com/clubsonrisasproject?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="club-sonrisas-ig-btn"
                  title="Visitar @clubsonrisasproject en Instagram"
                >
                  <span>📸</span> Conocer más en @clubsonrisasproject ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
