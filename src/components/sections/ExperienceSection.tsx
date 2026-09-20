import React from 'react';

export default function ExperienceSection() {
  const experiences = [
    {
      icon: '🎤',
      title: 'Artistas en Vivo (feat. Cloudboi)',
      desc: 'Show en vivo con Cloudboi y talentos invitados en tarima, junto a la selección musical de los 12 gigantes del trap argentino.',
    },
    {
      icon: '🌙',
      title: 'After Party Oficial Confirmado',
      desc: 'Al terminar la fiesta central, la pista sigue encendida hasta las 3:00 AM con after oficial para no parar de cantar y saltar.',
    },
    {
      icon: '🏆',
      title: 'Dinámicas con Premios & Stickers',
      desc: 'Competencias de outfits urbanos, dinámicas virales con audio FAHHHH y sorpresas temáticas para los más manijas de Valencia.',
    },
    {
      icon: '🍸',
      title: 'Coctelería & Bar Rock & Riff',
      desc: 'Carta especial con tragos icónicos, fernet con cola, cervezas frías y la mejor barra en Rock & Riff (Antiguo Óleo Gastrobar, La Viña).',
    },
  ];

  return (
    <section className="section" id="experiencia">
      <div className="container">
        <div className="section-header">
          <span className="section-pill">La Noche Más Esperada</span>
          <h2 className="section-title">
            LA EXPERIENCIA <span className="text-gradient">EL QUILOMBO</span>
          </h2>
          <p className="section-subtitle">
            No es solo una fiesta, es un punto de encuentro para toda la comunidad que vibra con la música urbana y la cultura de barrio.
          </p>
        </div>

        <div className="experience-grid">
          {experiences.map((exp, idx) => (
            <div key={idx} className="exp-card">
              <div className="exp-icon">{exp.icon}</div>
              <h3 className="exp-title">{exp.title}</h3>
              <p className="exp-desc">{exp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
