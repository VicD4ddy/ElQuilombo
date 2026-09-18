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
          {/* Left: Content */}
          <div className="hero-content">
            <div className="hero-pill">
              <span className="sparkle">⚡</span>
              <span>La Fiesta Temática Argentina en Valencia</span>
            </div>

            <h1 className="hero-title">
              VIVÍ LA NOCHE MÁS PICANTE DEL <span className="text-gradient">TRAP & CULTURA ARGENTA</span>
            </h1>

            <p className="hero-subtitle">
              Milo J, Trueno, Duki, Bizarrap, Nicki Nicole y los mejores clásicos de cumbia villera retumbando en una experiencia audiovisual única en Óleo Gastrobar.
            </p>

            {/* Countdown Widget */}
            <CountdownTimer />

            {/* Hero Action Buttons */}
            <div className="hero-actions">
              <a href="#entradas" className="btn-primary">
                <span>🔥 Apartar Preventa</span>
                <span>→</span>
              </a>
              <a href="#lineup" className="btn-secondary">
                <span>🎧 Ver Lineup</span>
              </a>
            </div>

            {/* Social Proof */}
            <div className="social-proof">
              <span className="flame">🔥</span>
              <span><strong>+360 personas</strong> ya están siguiendo el lanzamiento de la preventa</span>
            </div>
          </div>

          {/* Right: Interactive Visual Card */}
          <div className="hero-visual">
            <div className="visual-card">
              {/* Slanted Stickers */}
              <div className="sticker-date">⚡ 3 DE OCTUBRE 💜</div>
              <div className="sticker-limited">🚨 Aforo Limitado</div>

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
                  src="/assets/img/quilombo-hero.jpg"
                  alt="El Quilombo - Arte de la fiesta temática"
                  id="hero-reel-cover"
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
