'use client';

import React from 'react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import PlaylistDrawer from './PlaylistDrawer';

export default function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    progress,
    isMuted,
    volume,
    isShuffle,
    isMinimized,
    showAutoplayPrompt,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleMinimize,
    togglePlaylist,
    dismissAutoplayPrompt,
  } = useAudioPlayer();

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      {/* Floating Quilombo Music Player Dock */}
      <aside
        className={`quilombo-player-dock ${isPlaying ? 'music-active' : ''} ${
          isMinimized ? 'minimized' : ''
        }`}
        id="quilombo-music-player"
        aria-label="Reproductor de música oficial"
      >
        {/* Autoplay Activation Notice */}
        {showAutoplayPrompt && (
          <div
            className="player-autoplay-prompt visible"
            id="player-autoplay-prompt"
            onClick={dismissAutoplayPrompt}
          >
            <span className="prompt-pulse">🔊</span>
            <span className="prompt-text">
              <strong>¡Playlist Oficial del Lineup (14 canciones)!</strong> Haz clic aquí para activar el sonido
            </span>
            <span className="prompt-action">ACTIVAR ▶</span>
          </div>
        )}

        {/* Collapsible Playlist Drawer */}
        <PlaylistDrawer />

        {/* Main Player Bar */}
        <div className="player-main-bar">
          {/* Track Visual & Info */}
          <div className="player-track-wrap">
            <div className="player-art-box">
              <img
                src={currentTrack.cover}
                alt={`${currentTrack.title} - ${currentTrack.artist}`}
                className={`player-track-cover ${isPlaying ? 'spinning' : ''}`}
                id="player-track-cover"
              />
              <div className="player-disc-hole" />
            </div>
            <div className="player-track-details">
              <div className="player-track-topline">
                <span className="player-badge" id="player-track-badge">
                  {currentTrack.badge}
                </span>
                <div className="player-mini-eq">
                  <span className="peq-bar" />
                  <span className="peq-bar" />
                  <span className="peq-bar" />
                </div>
              </div>
              <h4 className="player-track-title" id="player-track-title">
                {currentTrack.title}
              </h4>
              <span className="player-track-artist" id="player-track-artist">
                {currentTrack.artist}
              </span>
            </div>
          </div>

          {/* Center Controls & Timeline */}
          <div className="player-center-controls">
            <div className="player-buttons-row">
              <button
                type="button"
                className={`btn-player-ctl ${isShuffle ? 'active' : ''}`}
                id="player-btn-shuffle"
                title="Modo aleatorio"
                aria-label="Modo aleatorio"
                onClick={toggleShuffle}
              >
                🔀
              </button>
              <button
                type="button"
                className="btn-player-ctl"
                id="player-btn-prev"
                title="Pista anterior"
                aria-label="Pista anterior"
                onClick={prevTrack}
              >
                ⏮
              </button>
              <button
                type="button"
                className={`btn-player-play ${isPlaying ? 'is-playing' : ''}`}
                id="player-btn-play"
                title={isPlaying ? 'Pausar música' : 'Reproducir música'}
                aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
                onClick={togglePlayPause}
              >
                <span id="player-play-icon">{isPlaying ? '⏸' : '▶'}</span>
              </button>
              <button
                type="button"
                className="btn-player-ctl"
                id="player-btn-next"
                title="Pista siguiente"
                aria-label="Pista siguiente"
                onClick={nextTrack}
              >
                ⏭
              </button>
              <button
                type="button"
                className="btn-player-ctl btn-playlist-toggle"
                id="player-btn-playlist"
                title="Ver lista de canciones"
                aria-label="Lista de canciones"
                onClick={togglePlaylist}
              >
                <span>☰</span>
                <span className="btn-playlist-label">Playlist</span>
              </button>
            </div>

            <div className="player-timeline-row">
              <span className="time-label" id="player-current-time">
                {formatTime(currentTime)}
              </span>
              <div className="timeline-bar-wrap">
                <input
                  type="range"
                  className="player-range-bar"
                  id="player-progress-bar"
                  min="0"
                  max="100"
                  value={progress}
                  aria-label="Progreso de la pista"
                  onChange={(e) => seek(parseFloat(e.target.value))}
                />
              </div>
              <span className="time-label" id="player-duration-time">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right Actions: Volume & Minimize */}
          <div className="player-right-actions">
            <div className="player-volume-wrap">
              <button
                type="button"
                className="btn-player-mute"
                id="player-btn-mute"
                title="Silenciar / Activar sonido"
                aria-label="Silenciar"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </button>
              <input
                type="range"
                className="player-volume-slider"
                id="player-volume-slider"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                aria-label="Control de volumen"
                onChange={(e) => setVolume(parseFloat(e.target.value))}
              />
            </div>

            <button
              type="button"
              className="btn-player-minimize"
              id="player-btn-minimize"
              title="Minimizar reproductor"
              aria-label="Minimizar"
              onClick={toggleMinimize}
            >
              ✕
            </button>
          </div>
        </div>
      </aside>

      {/* Minimized Floating Launcher Pill */}
      <button
        type="button"
        className={`player-mini-launcher ${isMinimized ? 'visible' : ''}`}
        id="player-mini-launcher"
        title="Abrir reproductor de música"
        aria-label="Abrir reproductor de música"
        onClick={toggleMinimize}
      >
        <span className="launcher-icon">📻</span>
        <span className="launcher-text">Quilombo Sound</span>
        <div className="launcher-eq">
          <span />
          <span />
          <span />
        </div>
      </button>
    </>
  );
}
