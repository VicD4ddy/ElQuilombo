import React from 'react';

export default function ExperienceSection() {
  const experiences = [
    {
      icon: '🎤',
      title: 'Artistas en Vivo & DJs',
      desc: 'Show en vivo con artistas invitados y setlist especial curado por DJs para no parar de cantar y saltar en toda la noche.',
    },
    {
      icon: '🌙',
      title: 'After Party Oficial',
      desc: 'Al terminar la fiesta central, la pista sigue encendida con los mejores tracks de trap y cumbia villera hasta que salga el sol.',
    },
    {
      icon: '🏆',
      title: 'Dinámicas con Premios',
      desc: 'Competencias de freestyle express, concursos de outfits y sorpresas temáticas con tragos y pases VIP para los más manijas.',
    },
    {
      icon: '🍸',
      title: 'Coctelería & Bar Óleo',
      desc: 'Carta especial con tragos icónicos, fernet con cola, cervezas bien frías y la mejor gastronomía en La Viña, Valencia.',
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
