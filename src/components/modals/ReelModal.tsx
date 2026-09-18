'use client';

import React, { useEffect, useState } from 'react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

interface ReelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReelModal({ isOpen, onClose }: ReelModalProps) {
  const { pauseAudio } = useAudioPlayer();
  const [isLoading, setIsLoading] = useState(true);
  const reelEmbedUrl = 'https://www.instagram.com/reel/Db4UmR8OuaR/embed/';

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

  if (!isOpen) return null;

  return (
    <div
      className="reel-fullscreen-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Reel Oficial de El Quilombo"
    >
      <div className="reel-modal-backdrop" onClick={onClose} />
      <div className="reel-modal-container">
        <div className="reel-modal-header">
          <div className="reel-modal-brand">
            <span className="reel-brand-dot" />
            <span className="reel-brand-title">EL QUILOMBO • REEL OFICIAL</span>
          </div>
          <div className="reel-modal-actions">
            <a
              href="https://www.instagram.com/reel/Db4UmR8OuaR/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-reel-external"
              title="Ver en Instagram"
            >
              <span>Instagram ↗</span>
            </a>
            <button
              type="button"
              className="btn-reel-modal-close"
              onClick={onClose}
              aria-label="Cerrar reproductor de reel"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="reel-modal-viewport">
          {isLoading && (
            <div className="reel-loader">
              <div className="reel-spinner" />
              <span>Cargando Reel de Instagram...</span>
            </div>
          )}
          <iframe
            id="fullscreen-reel-iframe"
            src={reelEmbedUrl}
            frameBorder="0"
            scrolling="no"
            allowTransparency={true}
            allowFullScreen={true}
            title="Instagram Reel El Quilombo"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}
