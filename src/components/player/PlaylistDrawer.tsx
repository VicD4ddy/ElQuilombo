'use client';

import React from 'react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

export default function PlaylistDrawer() {
  const {
    tracks,
    currentIndex,
    isPlaying,
    isPlaylistOpen,
    activeFilter,
    playTrack,
    setActiveFilter,
  } = useAudioPlayer();

  const filteredTracks = tracks.filter((track) => {
    if (activeFilter === 'all') return true;
    return track.category.includes(activeFilter);
  });

  return (
    <div className={`player-playlist-drawer ${isPlaylistOpen ? 'open' : ''}`} id="player-playlist-drawer">
      <div className="playlist-header">
        <div className="playlist-header-title">
          <span className="bolt">⚡</span>
          <span>PLAYLIST OFICIAL • MILO J, DUKI & TRUENO</span>
        </div>
        <div className="playlist-filter-pills">
          <button
            type="button"
            className={`player-filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Todos
          </button>
          <button
            type="button"
            className={`player-filter-pill ${activeFilter === 'milo' ? 'active' : ''}`}
            onClick={() => setActiveFilter('milo')}
          >
            Milo J
          </button>
          <button
            type="button"
            className={`player-filter-pill ${activeFilter === 'duki' ? 'active' : ''}`}
            onClick={() => setActiveFilter('duki')}
          >
            Duki
          </button>
          <button
            type="button"
            className={`player-filter-pill ${activeFilter === 'trueno' ? 'active' : ''}`}
            onClick={() => setActiveFilter('trueno')}
          >
            Trueno
          </button>
        </div>
      </div>

      <div className="player-playlist-items" id="player-playlist-items">
        {filteredTracks.map((track) => {
          const globalIndex = tracks.findIndex((t) => t.id === track.id);
          const isCurrent = globalIndex === currentIndex;

          return (
            <div
              key={track.id}
              className={`player-playlist-item ${isCurrent ? 'active' : ''}`}
              onClick={() => playTrack(globalIndex)}
            >
              <div className="playlist-item-art">
                <img src={track.cover} alt={track.title} />
                <div className="playlist-item-play-icon">
                  {isCurrent && isPlaying ? '⏸' : '▶'}
                </div>
              </div>
              <div className="playlist-item-info">
                <div className="playlist-item-title">{track.title}</div>
                <div className="playlist-item-artist">{track.artist}</div>
              </div>
              <div className="playlist-item-tag">{track.badge.split(' ')[0]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
