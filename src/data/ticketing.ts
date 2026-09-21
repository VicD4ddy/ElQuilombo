import { TicketTier } from '../types/ticket';

export const OFFICIAL_WHATSAPP_NUMBER = '584265401385';
export const ORGANIZERS_NAME = 'Los Organizadores';
export const ORGANIZERS_PHONE = '584265401385';
export const ORGANIZERS_PHONE_FORMATTED = '+58 426-5401385';

// Compatibilidad
export const BELLE_AMAR_NAME = ORGANIZERS_NAME;
export const BELLE_AMAR_PHONE = ORGANIZERS_PHONE;
export const BELLE_AMAR_PHONE_FORMATTED = ORGANIZERS_PHONE_FORMATTED;

// Fallback de referencia en caso de fallo temporal de la API BCV
export const REF_EXCHANGE_RATE = 847.44;

export const TICKET_TIERS: Record<'general' | 'vip', TicketTier> = {
  general: {
    id: 'general',
    name: 'Pase Preventa Oficial',
    priceUSD: 10,
    badge: 'Ahorro $5 (Limitadas)',
    description: 'Acceso general al evento en Rock & Riff + sticker pack exclusivo + trago de bienvenida',
    features: [
      'Acceso general a Rock & Riff',
      'Precio especial de preventa $10 (En puerta: $15)',
      '1 Trago de bienvenida de cortesía',
      'Sticker Pack oficial de El Quilombo',
      'Acceso confirmado a dinámicas y After Party',
    ],
  },
  vip: {
    id: 'vip',
    name: 'Pase VIP (Segundo Piso)',
    priceUSD: 20,
    badge: 'A Confirmar',
    description: 'Acceso express + zona preferencial segundo piso (Sujeto a confirmación técnica)',
    features: [
      'Entrada Express sin cola',
      'Zona preferencial segundo piso (sujeto a aforo)',
      '2 Tragos oficiales o vaso coleccionable',
      'Acceso exclusivo al After Party extendido',
    ],
  },
};
