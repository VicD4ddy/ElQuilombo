import { TicketTier } from '../types/ticket';

export const REF_EXCHANGE_RATE = 42.5;

export const TICKET_TIERS: Record<'general' | 'vip', TicketTier> = {
  general: {
    id: 'general',
    name: 'Pase General (Preventa 1)',
    priceUSD: 10,
    badge: 'Early Bird',
    description: 'Acceso general al evento + sticker pack exclusivo + trago de bienvenida',
    features: [
      'Acceso general a Óleo Gastrobar',
      '1 Trago de bienvenida de cortesía',
      'Sticker Pack oficial de El Quilombo',
      'Acceso a dinámicas y sorpresas',
    ],
  },
  vip: {
    id: 'vip',
    name: 'Pase VIP Quilombo',
    priceUSD: 20,
    badge: 'Más Popular',
    description: 'Acceso express sin cola + zona VIP preferencial + 2 tragos / copa temática + acceso al After',
    features: [
      'Entrada Express sin cola',
      'Acceso a Zona VIP frente a tarima',
      '2 Tragos oficiales o vaso coleccionable',
      'Acceso exclusivo al After Party oficial',
      'Merchandising edición limitada',
    ],
  },
};
