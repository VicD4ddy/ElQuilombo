'use client';

import React from 'react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

const ARTIST_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'milo', label: 'Milo J' },
  { id: 'duki', label: 'Duki' },
  { id: 'trueno', label: 'Trueno' },
  { id: 'bizarrap', label: 'Bizarrap' },
  { id: 'wos', label: 'WOS' },
  { id: 'ysy-a', label: 'YSY A' },
  { id: 'dillom', label: 'Dillom' },
  { id: 'nicki', label: 'Nicki Nicole' },
  { id: 'tiago', label: 'Tiago PZK' },
  { id: 'maria-becerra', label: 'María Becerra' },
];

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
          <span>PLAYLIST OFICIAL • LINEUP EL QUILOMBO ({tracks.length} TEMAS)</span>
        </div>
        <div
          className="playlist-filter-pills"
          style={{
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            paddingBottom: '2px',
            scrollbarWidth: 'none',
          }}
        >
          {ARTIST_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`player-filter-pill ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
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
