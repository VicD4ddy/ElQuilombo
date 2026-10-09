'use client';

import React, { useRef } from 'react';
import { ARTISTS } from '../../data/artists';
import Tilt3DCard from '../effects/Tilt3DCard';
import ScrollReveal3D from '../effects/ScrollReveal3D';

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
    <section className="section" id="lineup" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <ScrollReveal3D direction="up">
          <div className="section-header">
            <span className="section-pill">Talento &amp; Sonido</span>
            <h2 className="section-title">
              LA PLAYLIST QUE <span className="text-gradient">VA A DETONAR</span>
            </h2>
            <p className="section-subtitle">
              Lo más pesado del trap, hip-hop, R&amp;B y cumbia villera de la escena argentina sonando en la pista de Rock &amp; Riff.
            </p>
          </div>
        </ScrollReveal3D>

        {/* Swipeable Carousel */}
        <div className="artists-carousel-wrapper" id="artists-carousel-wrapper">
          <div className="carousel-nav-bar">
            <div className="carousel-hint">
              <span className="swipe-hand">👈 Desliza para explorar</span>
            </div>
            <div className="carousel-nav-btns">
              <button
                type="button"
                className="btn-carousel-nav btn-3d-tactile"
                id="btn-artists-prev"
                aria-label="Artistas anteriores"
                onClick={() => scroll('prev')}
              >
                ‹
              </button>
              <button
                type="button"
                className="btn-carousel-nav btn-3d-tactile"
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
                    <Tilt3DCard maxTilt={12} scale={1.03} glare={true} glareOpacity={0.25} style={{ height: '100%' }}>
                      <div className="artist-photo-box special-after-box" style={{ height: '100%' }}>
                        <div className="special-after-glow" />
                        <span className="artist-genre-pill special-badge-pill" style={{ transform: 'translateZ(30px)' }}>⚡ NOCHE ARGENTA</span>
                        <div className="special-after-content" style={{ transform: 'translateZ(20px)' }}>
                          <span className="special-icon">🌙</span>
                          <h3 className="artist-name">{artist.name}</h3>
                          <p className="special-desc">{artist.hits}</p>
                        </div>
                      </div>
                    </Tilt3DCard>
                  </article>
                );
              }

              return (
                <article key={artist.id} className="artist-card-slide">
                  <Tilt3DCard maxTilt={10} scale={1.03} glare={true} glareOpacity={0.2} style={{ height: '100%', borderRadius: '16px', overflow: 'hidden' }}>
                    <div className="artist-photo-box">
                      <img
                        src={artist.photo}
                        alt={`${artist.name} en El Quilombo`}
                        loading="lazy"
                        style={{ transform: 'translateZ(10px)' }}
                      />
                      <div className="artist-photo-overlay" />
                      <span className="artist-genre-pill" style={{ transform: 'translateZ(35px)' }}>{artist.style}</span>
                    </div>
                    <div className="artist-info-bar" style={{ transform: 'translateZ(20px)' }}>
                      <h3 className="artist-name">{artist.name}</h3>
                    </div>
                  </Tilt3DCard>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
