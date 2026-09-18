import { Track } from './track';

export interface EventSettings {
  id?: string;
  eventDate: string;
  venueName: string;
  venueAddress: string;
  officialWhatsapp: string;
  organizerPin: string;
  priceGeneral: number;
  priceVip: number;
  maxCapacity: number;
  ticketSubtitle: string;
  ticketDoorInstructions: string;
  customTracks: Track[];
  updatedAt?: string;
}

export interface OrganizerMetrics {
  totalReservations: number;
  totalTicketsCount: number;
  totalRevenueUSD: number;
  totalRevenueBs: number;
  paidReservationsCount: number;
  pendingReservationsCount: number;
  maxCapacity: number;
  occupancyPercentage: number;
  topRequestedArtists: { name: string; count: number }[];
}

export const DEFAULT_EVENT_SETTINGS: EventSettings = {
  eventDate: '03 OCT • 9:00 PM',
  venueName: 'Óleo Gastrobar (La Viña)',
  venueAddress: 'Valencia, Carabobo - Venezuela',
  officialWhatsapp: '58412882460',
  organizerPin: '1984',
  priceGeneral: 10,
  priceVip: 20,
  maxCapacity: 350,
  ticketSubtitle: 'FIESTA ARGENTINA',
  ticketDoorInstructions: 'Mostrá este código por WhatsApp o en la entrada de Óleo Gastrobar',
  customTracks: [],
};
