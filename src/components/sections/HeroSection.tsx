'use client';

import React, { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';

// Real verified comments extracted directly from the viral TikTok video by @belleamar_ (ID: 7677661590254046482)
const REAL_TIKTOK_COMMENTS = [
  {
    user: '@sugarbite15',
    nickname: 'Jesús Ruiz',
    text: 'NECESITO IRRRR',
    likes: 6,
  },
  {
    user: '@yuxerneim',
    nickname: 'yuxerneim',
    text: 'porfa metan música de bhavi, duki, lit, khea, ysy y neo PORFAVOR',
    likes: 57,
  },
  {
    user: '@daviangely.s',
    nickname: '𝑫𝒂𝒗𝒊🌷',
    text: 'Amiga como que en Valencia y no en Caracas? ya me había ilusionado 😔✋🏻',
    likes: 183,
  },
  {
    user: '@cruelwriter',
    nickname: 'estefany 📚',
    text: 'POR QUÉ TENGO QUE ESTAR EN CARACAS SI ESTE ES LITERALMENTE MI SUEÑO ?????',
    likes: 21,
  },
  {
    user: '@dalessiooo',
    nickname: 'D’Alessio ⟭⟬⁷',
    text: 'La milonista más milonista de Valencia no podrá ir 😔✋🏻',
    likes: 5,
  },
  {
    user: '@andres666.00',
    nickname: '~𝕺𝖇𝖊𝖗𝐲𝖓.🫓🕯️',
    text: 'Milo vas a venir a Venezuela?',
    likes: 62,
  },
  {
    user: '@kaadlv1',
    nickname: 'kaadlv1',
    text: 'Me ilusionaste',
    likes: 71,
  },
  {
    user: '@zizugd',
    nickname: 'zizu',
    text: 'Y pa los larenses??? 🥺',
    likes: 34,
  },
  {
    user: '@soffi_111_',
    nickname: 'sofi',
    text: 'cómo que en Valencia?? 😭😭😭😭',
    likes: 31,
  },
  {
    user: '@lanoviadesaturogojo6',
    nickname: '✪-𝓢𝓪𝓽𝓾𝓻𝓸 𝓖𝓸𝓳𝓸-✪',
    text: 'POR QUÉ TENGO QUE SER MWNOR DE EDAD POR QUÉ',
    likes: 5,
  },
  {
    user: '@mai280827',
    nickname: '🪷Mai🪷',
    text: 'pero si viene Milo o q?',
    likes: 19,
  },
];

interface HeroSectionProps {
  onOpenReel: () => void;
}

export default function HeroSection({ onOpenReel }: HeroSectionProps) {
  const [commentIndex, setCommentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCommentIndex((prev) => (prev + 1) % REAL_TIKTOK_COMMENTS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const currentComment = REAL_TIKTOK_COMMENTS[commentIndex];

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

          {/* Right: Interactive Visual Card (Direct TikTok Video & Real FOMO Reactions) */}
          <div className="hero-visual">
            <div className="visual-card">
              {/* Slanted Stickers */}
              <div className="sticker-date">⚡ VIERNES 09 OCT 💜</div>
              <div className="sticker-limited">🚨 PREVENTA $10 (LIMITADAS)</div>

              {/* Direct TikTok Video Player Showcase */}
              <div className="visual-media is-video-active" id="hero-visual-media">
                <div className="inline-tiktok-wrapper">
                  <iframe
                    id="hero-inline-tiktok"
                    src="https://www.tiktok.com/embed/v2/7677661590254046482"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    title="TikTok Viral El Quilombo por @belleamar_"
                    className="inline-tiktok-iframe"
                    scrolling="no"
                    style={{ width: '100%', height: '100%', border: 'none', overflow: 'hidden' }}
                  />
                </div>
              </div>

              {/* Real TikTok FOMO Metrics & Verified Comments Panel */}
              <div className="hero-inline-fomo-panel">
                {/* 4 Real Metrics */}
                <div className="tiktok-metrics-strip inline-fomo-metrics">
                  <div className="tiktok-stat">
                    <span className="stat-val">140.0K</span>
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
                  <div className="tiktok-stat-sep" />
                  <div className="tiktok-stat">
                    <span className="stat-val">4.1K</span>
                    <span className="stat-lbl">Shares ↗</span>
                  </div>
                </div>

                {/* Real Verified Comments Ticker */}
                <div className="tiktok-live-reaction-pill" key={commentIndex}>
                  <span className="reaction-user">{currentComment.user}</span>
                  <span className="reaction-nickname">({currentComment.nickname}):</span>
                  <span className="reaction-text">&ldquo;{currentComment.text}&rdquo;</span>
                  {currentComment.likes > 0 && (
                    <span className="reaction-likes">❤️ {currentComment.likes}</span>
                  )}
                </div>

                {/* Action Bar */}
                <div className="hero-video-actions-bar">
                  <button
                    type="button"
                    className="btn-video-fullscreen-action"
                    onClick={onOpenReel}
                    title="Ver en pantalla completa"
                  >
                    <span>⛶ Pantalla Completa</span>
                  </button>
                  <a
                    href="https://www.tiktok.com/@belleamar_/video/7677661590254046482"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-video-tiktok-link"
                    title="Abrir en TikTok"
                  >
                    <span>TikTok ↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
