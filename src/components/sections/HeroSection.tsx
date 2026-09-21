'use client';

import React from 'react';
import CountdownTimer from './CountdownTimer';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

interface HeroSectionProps {
  onOpenReel: () => void;
}

export default function HeroSection({ onOpenReel }: HeroSectionProps) {
  const { currentTrack, isPlaying, togglePlayPause } = useAudioPlayer();

  return (
    <section className="hero-section" id="hero">
      <div className="container">


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

                {/* Play Button Overlay */}
                <button
                  type="button"
                  className="btn-reel-play"
                  id="btn-reel-play"
                  aria-label="Reproducir Reel de Instagram"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenReel();
                  }}
                >
                  <span className="play-icon">▶</span>
                  <span className="play-label">Ver Reel Oficial</span>
                </button>

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
