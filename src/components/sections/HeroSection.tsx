'use client';

import React, { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

const VIRAL_COMMENTS = [
  { user: '@carlag_', text: 'NECESITO IRRRR no me lo pierdo por nada 😭💜' },
  { user: '@valen_trap', text: 'Amiga esto es un sueño en Valencia 🔥' },
  { user: '@santi.milo', text: 'Porfa metan temas de Milo J, Duki y Lit!' },
  { user: '@mari_quilombo', text: 'Ya compré mi preventa, nos vemos el 9! ⚡' },
  { user: '@mateo_arg', text: 'La milonista más milonista de Valencia jaja 🙌' },
];

interface HeroSectionProps {
  onOpenReel: () => void;
}

export default function HeroSection({ onOpenReel }: HeroSectionProps) {
  const { currentTrack, isPlaying, togglePlayPause } = useAudioPlayer();
  const [commentIndex, setCommentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCommentIndex((prev) => (prev + 1) % VIRAL_COMMENTS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-section" id="hero">
      <div className="container">
        {/* Top Presenter: Club Sonrisas */}
        <div className="hero-sponsor-wrap">
          <img
            src="/assets/img/club-sonrisas.png"
            alt="Club Sonrisas"
            className="hero-sponsor-logo"
          />
        </div>

        <div className="hero-grid">
          {/* Left: Hero Copy & Countdown */}
          <div className="hero-content">
            <div className="hero-brand-logo-wrap">
              <img
                src="/assets/img/el-quilombo-logo.png"
                alt="El Quilombo - Fiesta Temática Argentina"
                className="hero-official-logo"
              />
            </div>

            <h1 className="hero-title" style={{ marginTop: '0.75rem' }}>
              <span className="title-sub">⚡ LA FIESTA TEMÁTICA ARGENTINA EN VALENCIA 💜</span>
            </h1>

            <p className="hero-desc">
              La noche donde Valencia se transforma en Buenos Aires. Homenaje oficial a{' '}
              <strong>Milo J, Trueno, Duki, WOS, Dillom, Ca7riel &amp; Paco</strong> y los mayores referentes del trap argentino. Artistas en vivo sorpresa, After Party oficial extendido y dinámicas en tarima.
            </p>

            {/* Poster Price Blocks */}
            <div className="poster-prices-container" style={{ justifyContent: 'flex-start', margin: '1rem 0' }}>
              <div className="poster-price-box highlight">
                <span className="price-label">PREVENTA</span>
                <div className="price-amount">$10 USD</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', fontWeight: 700 }}>Entradas Limitadas</span>
              </div>
              <div className="poster-price-box">
                <span className="price-label" style={{ background: '#4a0e80' }}>EN PUERTA</span>
                <div className="price-amount" style={{ color: '#94a3b8' }}>$15 USD</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Noche del evento</span>
              </div>
            </div>

            {/* Age Restriction Notice */}
            <div className="age-restriction-pill" style={{ marginBottom: '1.25rem' }}>
              <span>PARA MAYORES DE <strong>+15</strong> (SI ES MENOR DEBE IR CON UN REPRESENTANTE)</span>
            </div>

            {/* Live Event Countdown */}
            <CountdownTimer />

            {/* Hero Action Buttons */}
            <div className="hero-actions">
              <a href="#entradas" className="btn-primary">
                <span>🔥 Apartar Preventa $10</span>
                <span>→</span>
              </a>
              <a href="#lineup" className="btn-secondary">
                <span>🎧 Ver Lineup (12 Artistas)</span>
              </a>
            </div>

            {/* Social Proof */}
            <div className="social-proof">
              <span className="flame">🔥</span>
              <span><strong>+420 personas</strong> ya están activas para el 9 de Octubre en Rock &amp; Riff</span>
            </div>
          </div>

          {/* Right: Interactive Visual Card */}
          <div className="hero-visual">
            <div className="visual-card">
              {/* Slanted Stickers */}
              <div className="sticker-date">⚡ VIERNES 09 OCT 💜</div>
              <div className="sticker-limited">🚨 PREVENTA $10 (LIMITADAS)</div>

              {/* Media Showcase */}
              <div
                className="visual-media"
                id="hero-visual-media"
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('#sound-widget')) return;
                  onOpenReel();
                }}
              >
                <img
                  src="/assets/img/flyer-quilombo.jpg"
                  alt="El Quilombo - Afiche Oficial Argento Party"
                  id="hero-reel-cover"
                  style={{ objectPosition: 'top center' }}
                />
                <div className="crt-overlay" id="hero-crt-overlay" />

                {/* TikTok Viral FOMO Centerpiece */}
                <div className="tiktok-card-overlay">
                  {/* Top Viral Badge */}
                  <div className="tiktok-viral-tag">
                    <span className="tiktok-logo-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                      </svg>
                    </span>
                    <span className="viral-text">VIRAL EN TIKTOK</span>
                    <span className="live-dot" />
                    <span className="views-highlight">140K+</span>
                  </div>

                  {/* Play Button Overlay */}
                  <button
                    type="button"
                    className="btn-tiktok-play"
                    id="btn-tiktok-play"
                    aria-label="Ver video viral en TikTok de El Quilombo"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenReel();
                    }}
                  >
                    <span className="tiktok-play-icon">▶</span>
                    <div className="tiktok-play-text">
                      <span className="tiktok-play-main">Ver Video Viral</span>
                      <span className="tiktok-play-sub">@belleamar_ en TikTok</span>
                    </div>
                  </button>

                  {/* FOMO Numbers Strip */}
                  <div className="tiktok-metrics-strip">
                    <div className="tiktok-stat">
                      <span className="stat-val">140K</span>
                      <span className="stat-lbl">Vistas 👁️</span>
                    </div>
                    <div className="tiktok-stat-sep" />
                    <div className="tiktok-stat">
                      <span className="stat-val">28.8K</span>
                      <span className="stat-lbl">Likes ❤️</span>
                    </div>
                    <div className="tiktok-stat-sep" />
                    <div className="tiktok-stat">
                      <span className="stat-val">842</span>
                      <span className="stat-lbl">Comments 💬</span>
                    </div>
                  </div>

                  {/* Live Fan Reactions Pill */}
                  <div className="tiktok-live-reaction-pill" key={commentIndex}>
                    <span className="reaction-user">{VIRAL_COMMENTS[commentIndex].user}:</span>
                    <span className="reaction-text">&ldquo;{VIRAL_COMMENTS[commentIndex].text}&rdquo;</span>
                  </div>
                </div>

                {/* Interactive Audio Equalizer Bar */}
                <div
                  className="sound-widget"
                  id="sound-widget"
                  title="Click para pausar/reanudar música"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                >
                  <div className="sound-info">
                    <span className="sound-title">Vibra Quilombo Sound</span>
                    <span className="sound-sub" id="sound-sub">
                      Sonando: {currentTrack.artist} - {currentTrack.title}
                    </span>
                  </div>
                  <div className="equalizer">
                    <div className={`eq-bar ${isPlaying ? 'running' : 'paused'}`} />
                    <div className={`eq-bar ${isPlaying ? 'running' : 'paused'}`} />
                    <div className={`eq-bar ${isPlaying ? 'running' : 'paused'}`} />
                    <div className={`eq-bar ${isPlaying ? 'running' : 'paused'}`} />
                    <div className={`eq-bar ${isPlaying ? 'running' : 'paused'}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
