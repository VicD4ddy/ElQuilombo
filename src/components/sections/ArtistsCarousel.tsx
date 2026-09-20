'use client';

import React, { useRef } from 'react';
import { ARTISTS } from '../../data/artists';

export default function ArtistsCarousel() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: 'prev' | 'next') => {
    if (!trackRef.current) return;
    const firstSlide = trackRef.current.querySelector('.artist-card-slide') as HTMLElement;
    const step = firstSlide ? firstSlide.offsetWidth + 20 : trackRef.current.clientWidth * 0.75;
    trackRef.current.scrollBy({
      left: direction === 'next' ? step : -step,
      behavior: 'smooth',
    });
  };

  return (
    <section className="section" id="lineup">
      <div className="container">
        <div className="section-header">
          <span className="section-pill">Talento & Sonido</span>
          <h2 className="section-title">
            LOS ARTISTAS QUE <span className="text-gradient">VAN A DETONAR</span>
          </h2>
          <p className="section-subtitle">
            Lo más pesado del trap, hip-hop, R&B y cumbia villera de la escena argentina sonando en la pista de Rock & Riff (Antiguo Óleo).
          </p>
        </div>

        {/* Swipeable Carousel */}
        <div className="artists-carousel-wrapper" id="artists-carousel-wrapper">
          <div className="carousel-nav-bar">
            <div className="carousel-hint">
              <span className="swipe-hand">👈 Desliza para explorar</span>
            </div>
            <div className="carousel-nav-btns">
              <button
                type="button"
                className="btn-carousel-nav"
                id="btn-artists-prev"
                aria-label="Artistas anteriores"
                onClick={() => scroll('prev')}
              >
                ‹
              </button>
              <button
                type="button"
                className="btn-carousel-nav"
                id="btn-artists-next"
                aria-label="Artistas siguientes"
                onClick={() => scroll('next')}
              >
                ›
              </button>
            </div>
          </div>

          <div
            className="artists-carousel-track"
            id="artists-carousel-track"
            ref={trackRef}
            tabIndex={0}
            aria-label="Carrusel de artistas de El Quilombo"
          >
            {ARTISTS.map((artist) => {
              if (artist.isSpecial) {
                return (
                  <article key={artist.id} className="artist-card-slide special-after-card">
                    <div className="artist-photo-box special-after-box">
                      <div className="special-after-glow" />
                      <span className="artist-genre-pill special-badge-pill">⚡ NOCHE ARGENTA</span>
                      <div className="special-after-content">
                        <span className="special-icon">🌙</span>
                        <h3 className="artist-name">{artist.name}</h3>
                        <p className="special-desc">{artist.hits}</p>
                      </div>
                    </div>
                  </article>
                );
              }

              return (
                <article key={artist.id} className="artist-card-slide">
                  <div className="artist-photo-box">
                    <img
                      src={artist.photo}
                      alt={`${artist.name} en El Quilombo`}
                      loading="lazy"
                    />
                    <div className="artist-photo-overlay" />
                    <span className="artist-genre-pill">{artist.style}</span>
                  </div>
                  <div className="artist-info-bar">
                    <h3 className="artist-name">{artist.name}</h3>
                    <p className="artist-hit">{artist.hits}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
