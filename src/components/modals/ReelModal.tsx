'use client';

import React, { useEffect, useState } from 'react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

interface ReelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIKTOK_VIDEO_ID = '7677661590254046482';
const TIKTOK_URL = `https://www.tiktok.com/@belleamar_/video/${TIKTOK_VIDEO_ID}`;
const TIKTOK_EMBED_URL = `https://www.tiktok.com/embed/v2/${TIKTOK_VIDEO_ID}`;

const REAL_REACTIONS = [
  { user: '@sugarbite15', nickname: 'Jesús Ruiz', text: 'NECESITO IRRRR', tag: '🔥 Valencia' },
  { user: '@yuxerneim', nickname: 'yuxerneim', text: 'porfa metan música de bhavi, duki, lit, khea, ysy y neo PORFAVOR', tag: '❤️ 57 likes' },
  { user: '@daviangely.s', nickname: '𝑫𝒂𝒗𝒊🌷', text: 'Amiga como que en Valencia y no en Caracas? ya me había ilusionado 😔✋🏻', tag: '❤️ 183 likes' },
  { user: '@cruelwriter', nickname: 'estefany 📚', text: 'POR QUÉ TENGO QUE ESTAR EN CARACAS SI ESTE ES LITERALMENTE MI SUEÑO ?????', tag: '❤️ 21 likes' },
  { user: '@dalessiooo', nickname: 'D’Alessio ⟭⟬⁷', text: 'La milonista más milonista de Valencia no podrá ir 😔✋🏻', tag: '⚡ Fans Milo J' },
  { user: '@andres666.00', nickname: '~𝕺𝖇𝖊𝖗𝐲𝖓.🫓🕯️', text: 'Milo vas a venir a Venezuela?', tag: '❤️ 62 likes' },
  { user: '@zizugd', nickname: 'zizu', text: 'Y pa los larenses??? 🥺', tag: '❤️ 34 likes' },
  { user: '@soffi_111_', nickname: 'sofi', text: 'cómo que en Valencia?? 😭😭😭😭', tag: '❤️ 31 likes' },
];

export default function ReelModal({ isOpen, onClose }: ReelModalProps) {
  const { pauseAudio } = useAudioPlayer();
  const [isLoading, setIsLoading] = useState(true);
  const [reactionIndex, setReactionIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      pauseAudio();
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, pauseAudio]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setReactionIndex((prev) => (prev + 1) % REAL_REACTIONS.length);
    }, 3400);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleGoToTickets = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      const el = document.getElementById('entradas');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#entradas';
      }
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div
      className="reel-fullscreen-modal tiktok-theme-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Video Viral en TikTok de El Quilombo"
    >
      <div className="reel-modal-backdrop" onClick={onClose} />
      <div className="reel-modal-container">
        {/* Modal Header */}
        <div className="reel-modal-header">
          <div className="reel-modal-brand">
            <span className="tiktok-header-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
              </svg>
            </span>
            <div className="tiktok-header-titles">
              <span className="reel-brand-title">VIRAL EN TIKTOK</span>
              <span className="tiktok-header-creator">@belleamar_</span>
            </div>
            <span className="tiktok-live-pill">🔥 140K+ VISTAS</span>
          </div>
          <div className="reel-modal-actions">
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-reel-external btn-tiktok-external"
              title="Abrir en TikTok"
            >
              <span>TikTok ↗</span>
            </a>
            <button
              type="button"
              className="btn-reel-modal-close"
              onClick={onClose}
              aria-label="Cerrar video de TikTok"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Top FOMO Metrics Strip */}
        <div className="tiktok-modal-fomo-strip">
          <div className="fomo-strip-stat">
            <span className="fomo-val">140.0K</span>
            <span className="fomo-lbl">Vistas 👁️</span>
          </div>
          <div className="fomo-strip-sep" />
          <div className="fomo-strip-stat">
            <span className="fomo-val">28.8K</span>
            <span className="fomo-lbl">Likes ❤️</span>
          </div>
          <div className="fomo-strip-sep" />
          <div className="fomo-strip-stat">
            <span className="fomo-val">842</span>
            <span className="fomo-lbl">Comentarios 💬</span>
          </div>
          <div className="fomo-strip-sep" />
          <div className="fomo-strip-stat">
            <span className="fomo-val">4.1K</span>
            <span className="fomo-lbl">Compartidos ↗</span>
          </div>
        </div>

        {/* Video Viewport */}
        <div className="reel-modal-viewport tiktok-viewport">
          {isLoading && (
            <div className="reel-loader">
              <div className="reel-spinner tiktok-spinner" />
              <span>Cargando video viral de TikTok...</span>
            </div>
          )}
          <video
            id="fullscreen-reel-video"
            src="/assets/video/tiktok-viral-quilombo.mp4"
            poster="/assets/img/tiktok-cover.jpg"
            controls
            autoPlay
            playsInline
            onCanPlay={() => setIsLoading(false)}
            className="fullscreen-reel-video"
            style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
          />
        </div>

        {/* Bottom FOMO Live Reactions & Direct Conversion CTA */}
        <div className="tiktok-modal-footer">
          <div className="tiktok-footer-reaction-box" key={reactionIndex}>
            <div className="reaction-bubble-header">
              <span className="reaction-bubble-user">{REAL_REACTIONS[reactionIndex].user}</span>
              <span className="reaction-bubble-tag">{REAL_REACTIONS[reactionIndex].tag}</span>
            </div>
            <p className="reaction-bubble-text">&ldquo;{REAL_REACTIONS[reactionIndex].text}&rdquo;</p>
          </div>

          <button
            type="button"
            className="btn-modal-fomo-cta"
            onClick={handleGoToTickets}
          >
            <span>🔥 Apartar Preventa $10 (Quedan Pocas)</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
