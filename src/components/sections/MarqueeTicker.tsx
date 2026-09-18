import React from 'react';

export default function MarqueeTicker() {
  const items = [
    'MILO J',
    'TRUENO',
    'DUKI',
    'BIZARRAP',
    'NICKI NICOLE',
    'TIAGO PZK',
    'MARÍA BECERRA',
    'WOS',
    'YSY A',
    'DILLOM',
  ];

  return (
    <div className="marquee-container" aria-hidden="true">
      <div className="marquee-track">
        {items.map((artist, idx) => (
          <span key={`m1-${idx}`} className="marquee-item">
            <span className="bolt">⚡</span> {artist}
          </span>
        ))}
        <span className="marquee-item">
          <span className="highlight">🌙 AFTER PARTY OFICIAL</span>
        </span>
        <span className="marquee-item">
          <span className="bolt">⚡</span> CUMBIA 420 & CLÁSICOS ARGENTOS
        </span>

        {/* Repeat for seamless infinite scroll */}
        {items.map((artist, idx) => (
          <span key={`m2-${idx}`} className="marquee-item">
            <span className="bolt">⚡</span> {artist}
          </span>
        ))}
        <span className="marquee-item">
          <span className="highlight">🌙 AFTER PARTY OFICIAL</span>
        </span>
      </div>
    </div>
  );
}
