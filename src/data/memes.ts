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

export const MEME_STICKERS: MemeSticker[] = [
  {
    id: 'perrito-ia',
    name: 'Perrito Bailarín con IA',
    emoji: '🐶🕺',
    imageUrl: '/assets/img/memes/perrito-ia.jpg',
    tagline: 'Tirando unos pasos prohibidos pal 9 de Octubre',
    badgeBg: 'linear-gradient(135deg, #ff007f 0%, #ffd600 100%)',
    borderColor: '#ffd600',
    textColor: '#06050a',
    accentGlow: 'rgba(255, 214, 0, 0.45)',
    animationClass: 'sticker-anim-bounce',
  },
  {
    id: 'carpincho-mate',
    name: 'Carpincho con Mate & Gafas',
    emoji: '🧉🕶️',
    imageUrl: '/assets/img/memes/carpincho-mate.jpg',
    tagline: 'Manija total esperando el After Party en Rock & Riff',
    badgeBg: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
    borderColor: '#00f0ff',
    textColor: '#ffffff',
    accentGlow: 'rgba(0, 240, 255, 0.45)',
    animationClass: 'sticker-anim-wobble',
  },
  {
    id: 'messi-muchachos',
    name: 'Messi • ¿Qué Mirás Bobo?',
    emoji: '🏆🇦🇷',
    imageUrl: '/assets/img/memes/messi-muchachos.jpg',
    tagline: 'Elijo creer: ya tengo mi pase asegurado pal Quilombo',
    badgeBg: 'linear-gradient(135deg, #38bdf8 0%, #ffffff 50%, #38bdf8 100%)',
    borderColor: '#ffd600',
    textColor: '#0284c7',
    accentGlow: 'rgba(56, 189, 248, 0.5)',
    animationClass: 'sticker-anim-glow',
  },
  {
    id: 'duki-diablo',
    name: 'Duki Modo Diablo',
    emoji: '🔥😈',
    imageUrl: '/assets/img/memes/duki-diablo.jpg',
    tagline: 'No me hablen, estoy concentrado pal Quilombo',
    badgeBg: 'linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)',
    borderColor: '#f87171',
    textColor: '#ffffff',
    accentGlow: 'rgba(239, 68, 68, 0.5)',
    animationClass: 'sticker-anim-pulse',
  },
  {
    id: 'gato-cumbiero',
    name: 'Michi Turro Cumbiero',
    emoji: '🐱💃',
    imageUrl: '/assets/img/memes/gato-cumbiero.jpg',
    tagline: 'Hasta las 6:00 AM no me saca nadie de la pista',
    badgeBg: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    borderColor: '#f472b6',
    textColor: '#ffffff',
    accentGlow: 'rgba(236, 72, 153, 0.45)',
    animationClass: 'sticker-anim-bounce',
  },
  {
    id: 'fernet-viajero',
    name: 'Fernet 70/30 en Jarra',
    emoji: '🥃⚡',
    imageUrl: '/assets/img/memes/fernet-viajero.jpg',
    tagline: 'Con coca y dos hielos bien fríos en La Viña',
    badgeBg: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
    borderColor: '#34d399',
    textColor: '#ffffff',
    accentGlow: 'rgba(52, 211, 153, 0.45)',
    animationClass: 'sticker-anim-spin',
  },
  {
    id: 'francella-manana',
    name: 'Guille • Hermosa Noche',
    emoji: '🕶️☕',
    imageUrl: '/assets/img/memes/francella-manana.jpg',
    tagline: 'Hermosa noche para romperla en El Quilombo, ¿verdad?',
    badgeBg: 'linear-gradient(135deg, #f59e0b 0%, #78350f 100%)',
    borderColor: '#fbbf24',
    textColor: '#ffffff',
    accentGlow: 'rgba(245, 158, 11, 0.45)',
    animationClass: 'sticker-anim-wobble',
  },
  {
    id: 'milo-gravedad',
    name: 'Milo J en Gravedad Cero',
    emoji: '🚀🎤',
    imageUrl: '/assets/img/memes/milo-gravedad.jpg',
    tagline: 'Rara vez me pierdo una joda como esta',
    badgeBg: 'linear-gradient(135deg, #8b17f5 0%, #3b82f6 100%)',
    borderColor: '#a855f7',
    textColor: '#ffffff',
    accentGlow: 'rgba(139, 23, 245, 0.5)',
    animationClass: 'sticker-anim-float',
  },
  {
    id: 'la-scaloneta',
    name: 'Bondi Quilombero',
    emoji: '🚌🇦🇷',
    imageUrl: '/assets/img/memes/la-scaloneta.jpg',
    tagline: 'Subite a La Scaloneta que nos vamos a Rock & Riff',
    badgeBg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    borderColor: '#38bdf8',
    textColor: '#ffffff',
    accentGlow: 'rgba(2, 132, 199, 0.5)',
    animationClass: 'sticker-anim-bounce',
  },
  {
    id: 'bano-maria',
    name: 'Ca7riel & Paco • Baño María',
    emoji: '🛁🍾',
    imageUrl: '/assets/img/memes/bano-maria.jpg',
    tagline: 'Salimos de gira: hoy no volvemos a casa',
    badgeBg: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    borderColor: '#f472b6',
    textColor: '#ffffff',
    accentGlow: 'rgba(236, 72, 153, 0.5)',
    animationClass: 'sticker-anim-pulse',
  },
];

export function getRandomMemeSticker(excludeId?: string): MemeSticker {
  const available = excludeId
    ? MEME_STICKERS.filter((m) => m.id !== excludeId)
    : MEME_STICKERS;
  const index = Math.floor(Math.random() * available.length);
  return available[index] || MEME_STICKERS[0];
}

export function getMemeStickerById(id: string): MemeSticker {
  return MEME_STICKERS.find((m) => m.id === id) || MEME_STICKERS[0];
}
