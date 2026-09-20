export interface MemeSticker {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  badgeBg: string;
  borderColor: string;
  textColor: string;
}

export const MEME_STICKERS: MemeSticker[] = [
  {
    id: 'perrito-ia',
    name: 'Perrito Bailarín con IA',
    emoji: '🐶🕺',
    tagline: 'Tirando unos pasos prohibidos pal 9 de Octubre',
    badgeBg: 'linear-gradient(135deg, #ff007f 0%, #ffd600 100%)',
    borderColor: '#ffd600',
    textColor: '#06050a',
  },
  {
    id: 'carpincho-mate',
    name: 'Carpincho con Mate & Gafas',
    emoji: '🧉🕶️',
    tagline: 'Manija total esperando el After Party en Rock & Riff',
    badgeBg: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
    borderColor: '#00f0ff',
    textColor: '#ffffff',
  },
  {
    id: 'messi-muchachos',
    name: 'Muchachos • Modo Copa',
    emoji: '🏆🇦🇷',
    tagline: 'Elijo creer: ya tengo mi pase asegurado',
    badgeBg: 'linear-gradient(135deg, #38bdf8 0%, #ffffff 50%, #38bdf8 100%)',
    borderColor: '#ffd600',
    textColor: '#0284c7',
  },
  {
    id: 'duki-diablo',
    name: 'Duki Modo Diablo',
    emoji: '🔥😈',
    tagline: 'No me hablen, estoy concentrado pal Quilombo',
    badgeBg: 'linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)',
    borderColor: '#f87171',
    textColor: '#ffffff',
  },
  {
    id: 'gato-cumbiero',
    name: 'Michi Tirando Cumbia 420',
    emoji: '🐱💃',
    tagline: 'Hasta las 6:00 AM no me saca nadie de la pista',
    badgeBg: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    borderColor: '#f472b6',
    textColor: '#ffffff',
  },
  {
    id: 'fernet-viajero',
    name: 'Fernet 70/30 en Jarra',
    emoji: '🥃⚡',
    tagline: 'Con coca y dos hielos bien fríos en La Viña',
    badgeBg: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
    borderColor: '#34d399',
    textColor: '#ffffff',
  },
];

export function getRandomMemeSticker(): MemeSticker {
  const index = Math.floor(Math.random() * MEME_STICKERS.length);
  return MEME_STICKERS[index];
}
