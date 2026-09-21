import React from 'react';

export default function MarqueeTicker() {
  const items = [
    'MILO J (MAIN)',
    'TRUENO',
    'DUKI',
    'CA7RIEL & PACO',
    'WOS',
    'DILLOM',
    'LIT KILLAH',
    'KHEA',
    'MARÍA BECERRA',
    'VIERNES 09 OCT • ROCK N\' RIFF',
    '🌙 AFTER PARTY CONFIRMADO',
  ];

  return (
    <div className="marquee-container" aria-hidden="true">
      <div className="marquee-track">
        {items.map((artist, idx) => (
          <span key={`m1-${idx}`} className="marquee-item">
            <span className="bolt">⚡</span> {artist}
          </span>
        ))}

        {/* Repeat for seamless infinite scroll */}
        {items.map((artist, idx) => (
          <span key={`m2-${idx}`} className="marquee-item">
            <span className="bolt">⚡</span> {artist}
          </span>
        ))}
      </div>
    </div>
  );
}
