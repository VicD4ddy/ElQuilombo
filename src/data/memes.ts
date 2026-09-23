export interface MemeSticker {
  id: string;
  name: string;
  emoji: string;
  imageUrl: string;
  tagline: string;
  badgeBg: string;
  borderColor: string;
  textColor: string;
  accentGlow: string;
  animationClass: string;
}

/**
 * Frases aleatorias para los memes del ticket:
 * Conserva todas las frases originales y agrega nuevas frases exclusivas de El Quilombo.
 */
export const QUILOMBO_MEME_PHRASES: string[] = [
  // Frases originales conservadas:
  'Hermosa noche para romperla en El Quilombo, ¿verdad?',
  'Tirando unos pasos prohibidos pal 9 de Octubre',
  'Manija total esperando el After Party en Rock & Riff',
  'Elijo creer: ya tengo mi pase asegurado pal Quilombo',
  'No me hablen, estoy concentrado pal Quilombo',
  'Hasta las 6:00 AM no me saca nadie de la pista',
  'Con coca y dos hielos bien fríos en La Viña',
  'Rara vez me pierdo una joda como esta',
  'Subite a La Scaloneta que nos vamos a Rock & Riff',
  'Salimos de gira: hoy no volvemos a casa',

  // Nuevas frases temáticas de El Quilombo:
  '¿Qué mirás bobo? Andá pa\' El Quilombo que ya empezó la previa 🇦🇷🔥',
  'Mi vieja: "¿A dónde vas tan elegante?" Yo: "Al Quilombo en Rock & Riff" 🕶️',
  'El que no haga quilombo el 9 de octubre no tiene aguante 🇦🇷⚡',
  'Avisale a tus amigos: este 9 de octubre se pica todo en La Viña 😈',
  'Yo fingiendo demencia hasta que abran las puertas de El Quilombo 🕺',
  'Tranqui, que en El Quilombo la noche recién empieza 🍾',
  'Llegó la preventa y yo ya tengo la pilcha lista pal 9 de Octubre 🧢',
  'Yo en la oficina todo el día / Yo en El Quilombo a las 3:00 AM 🔥',
  'Muchaaachos, ahora nos volvimo\' a ilusionar en Rock & Riff 🏆',
  'Dije que no iba a salir este viernes... pero abrieron El Quilombo 🤦‍♂️',
  '¡FAHHHHHH! Se prendió la noche más picante de toda Valencia 💜',
  'Cualquier joda normal ❌ / El Quilombo con trap, cumbia y after ✔️',
  'Viernes 09 de Octubre: prohibido quedarse sentado en Rock & Riff 🇦🇷',
  'El que tenga miedo a pasarla bien que no nazca: nos vemos en El Quilombo 🚀',
  'Aseguré mi entrada antes de que se agote la preventa, no me busquen 🎟️',
  'Prendiendo motores pal 09 de Octubre en Rock & Riff 🔥',
];

/**
 * Memes aleatorios basados en la carpeta recursos/Memes
 */
export const MEMES: MemeSticker[] = [
  {
    id: 'meme-messi-copa',
    name: 'Messi • La Copa es Nuestra',
    emoji: '🏆🇦🇷',
    imageUrl: '/assets/img/memes/meme-messi-copa.jpg',
    tagline: 'Elijo creer: ya tengo mi pase asegurado pal Quilombo',
    badgeBg: 'linear-gradient(135deg, #38bdf8 0%, #ffffff 50%, #38bdf8 100%)',
    borderColor: '#38bdf8',
    textColor: '#ffffff',
    accentGlow: 'rgba(56, 189, 248, 0.5)',
    animationClass: 'sticker-anim-glow',
  },
  {
    id: 'meme-messi-barca',
    name: 'Messi Festejando',
    emoji: '🐐🔥',
    imageUrl: '/assets/img/memes/meme-messi-barca.gif',
    tagline: 'Muchaaachos, ahora nos volvimo\' a ilusionar en Rock & Riff',
    badgeBg: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    borderColor: '#a855f7',
    textColor: '#ffffff',
    accentGlow: 'rgba(168, 85, 247, 0.5)',
    animationClass: 'sticker-anim-bounce',
  },
  {
    id: 'meme-messi-paris',
    name: 'Messi • Modo Fiesta',
    emoji: '⚡🇦🇷',
    imageUrl: '/assets/img/memes/meme-messi-paris.avif',
    tagline: '¿Qué mirás bobo? Andá pa\' El Quilombo que ya empezó la previa 🇦🇷🔥',
    badgeBg: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
    borderColor: '#38bdf8',
    textColor: '#ffffff',
    accentGlow: 'rgba(2, 132, 199, 0.5)',
    animationClass: 'sticker-anim-pulse',
  },
  {
    id: 'meme-drake',
    name: 'Drake Quilombero',
    emoji: '🕺😎',
    imageUrl: '/assets/img/memes/meme-drake.webp',
    tagline: 'Dije que no iba a salir... pero abrieron las entradas de El Quilombo',
    badgeBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    borderColor: '#fbbf24',
    textColor: '#ffffff',
    accentGlow: 'rgba(245, 158, 11, 0.5)',
    animationClass: 'sticker-anim-wobble',
  },
  {
    id: 'meme-distracted-bf',
    name: 'Novio Distraído',
    emoji: '👀🔥',
    imageUrl: '/assets/img/memes/meme-distracted-bf.jpg',
    tagline: 'Cualquier fiesta normal ❌ / El Quilombo en Rock & Riff ✔️',
    badgeBg: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
    borderColor: '#f87171',
    textColor: '#ffffff',
    accentGlow: 'rgba(239, 68, 68, 0.5)',
    animationClass: 'sticker-anim-pulse',
  },
  {
    id: 'meme-spiderman',
    name: 'Spiderman Señalando',
    emoji: '🕷️👉',
    imageUrl: '/assets/img/memes/meme-spiderman.jpg',
    tagline: 'Avisale a tus amigos: este 9 de octubre se pica todo en La Viña 😈',
    badgeBg: 'linear-gradient(135deg, #dc2626 0%, #2563eb 100%)',
    borderColor: '#60a5fa',
    textColor: '#ffffff',
    accentGlow: 'rgba(37, 99, 235, 0.5)',
    animationClass: 'sticker-anim-bounce',
  },
  {
    id: 'meme-yaoming',
    name: 'Yao Ming Clásico',
    emoji: '😂✌️',
    imageUrl: '/assets/img/memes/meme-yaoming.jpg',
    tagline: '¿Dormir temprano el viernes? Jajaja, nos vemos en El Quilombo',
    badgeBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderColor: '#34d399',
    textColor: '#ffffff',
    accentGlow: 'rgba(16, 185, 129, 0.5)',
    animationClass: 'sticker-anim-spin',
  },
  {
    id: 'meme-perro-llamas',
    name: 'This is Fine • En Llamas',
    emoji: '☕🔥',
    imageUrl: '/assets/img/memes/meme-perro-llamas.avif',
    tagline: 'Hermosa noche para romperla en El Quilombo, ¿verdad?',
    badgeBg: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    borderColor: '#fb923c',
    textColor: '#ffffff',
    accentGlow: 'rgba(249, 115, 22, 0.5)',
    animationClass: 'sticker-anim-wobble',
  },
  {
    id: 'meme-gato-mesa',
    name: 'Gato en la Mesa',
    emoji: '🐱🍸',
    imageUrl: '/assets/img/memes/meme-gato-mesa.jpg',
    tagline: 'Mi vieja: "¿A dónde vas tan elegante?" Yo: "Al Quilombo en Rock & Riff" 🕶️',
    badgeBg: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    borderColor: '#c084fc',
    textColor: '#ffffff',
    accentGlow: 'rgba(139, 92, 246, 0.5)',
    animationClass: 'sticker-anim-float',
  },
  {
    id: 'meme-marmota-grito',
    name: 'Marmota Gritando',
    emoji: '🗣️📢',
    imageUrl: '/assets/img/memes/meme-marmota-grito.avif',
    tagline: '¡FAHHHHHH! Se prendió la noche más picante de Valencia 💜',
    badgeBg: 'linear-gradient(135deg, #eab308 0%, #ea580c 100%)',
    borderColor: '#facc15',
    textColor: '#ffffff',
    accentGlow: 'rgba(234, 179, 8, 0.5)',
    animationClass: 'sticker-anim-bounce',
  },
  {
    id: 'meme-gato-vibrante',
    name: 'Michi Turro Cumbiero',
    emoji: '🐱💃',
    imageUrl: '/assets/img/memes/meme-gato-vibrante.avif',
    tagline: 'Hasta las 6:00 AM no me saca nadie de la pista en Rock & Riff',
    badgeBg: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
    borderColor: '#f472b6',
    textColor: '#ffffff',
    accentGlow: 'rgba(236, 72, 153, 0.5)',
    animationClass: 'sticker-anim-bounce',
  },
  {
    id: 'meme-lolcat',
    name: 'Lolcat Cumbiero',
    emoji: '😹🎵',
    imageUrl: '/assets/img/memes/meme-lolcat.webp',
    tagline: 'Tirando unos pasos prohibidos pal 9 de Octubre en Rock & Riff',
    badgeBg: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    borderColor: '#22d3ee',
    textColor: '#ffffff',
    accentGlow: 'rgba(6, 182, 212, 0.5)',
    animationClass: 'sticker-anim-wobble',
  },
  {
    id: 'meme-perro-anteojos',
    name: 'Perrito con Flow',
    emoji: '🐶🕶️',
    imageUrl: '/assets/img/memes/meme-perro-anteojos.jpg',
    tagline: 'Manija total esperando el After Party en El Quilombo',
    badgeBg: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    borderColor: '#2dd4bf',
    textColor: '#ffffff',
    accentGlow: 'rgba(20, 184, 166, 0.5)',
    animationClass: 'sticker-anim-float',
  },
  {
    id: 'meme-como-me-siento',
    name: 'Cómo Me Siento Hoy',
    emoji: '🧠✨',
    imageUrl: '/assets/img/memes/meme-como-me-siento.avif',
    tagline: 'Yo fingiendo demencia hasta que abran las puertas de El Quilombo 🕺',
    badgeBg: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    borderColor: '#818cf8',
    textColor: '#ffffff',
    accentGlow: 'rgba(99, 102, 241, 0.5)',
    animationClass: 'sticker-anim-pulse',
  },
  {
    id: 'meme-suspendido-fisica',
    name: 'Gato Sorprendido',
    emoji: '🙀⚡',
    imageUrl: '/assets/img/memes/meme-suspendido-fisica.webp',
    tagline: 'El que no haga quilombo el 9 de octubre no tiene aguante 🇦🇷⚡',
    badgeBg: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
    borderColor: '#fb7185',
    textColor: '#ffffff',
    accentGlow: 'rgba(244, 63, 94, 0.5)',
    animationClass: 'sticker-anim-bounce',
  },
];

// Alias para compatibilidad con código existente
export const MEME_STICKERS: MemeSticker[] = MEMES;

/**
 * Obtiene un meme aleatorio de la lista y le asigna una frase aleatoria
 * combinando las frases clásicas y las nuevas frases del Quilombo.
 */
export function getRandomMemeSticker(excludeId?: string): MemeSticker {
  const available = excludeId
    ? MEMES.filter((m) => m.id !== excludeId)
    : MEMES;
  const memeIndex = Math.floor(Math.random() * available.length);
  const baseMeme = available[memeIndex] || MEMES[0];

  // Asigna una frase aleatoria de la lista ampliada de frases del Quilombo
  const phraseIndex = Math.floor(Math.random() * QUILOMBO_MEME_PHRASES.length);
  const randomTagline = QUILOMBO_MEME_PHRASES[phraseIndex] || baseMeme.tagline;

  return {
    ...baseMeme,
    tagline: randomTagline,
  };
}

export function getMemeStickerById(id: string): MemeSticker {
  const found = MEMES.find((m) => m.id === id);
  if (found) return found;

  // Fallback si la reserva antigua tenía un ID antiguo
  return MEMES[0];
}
