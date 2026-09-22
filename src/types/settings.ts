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

export interface PaymentMethodMetric {
  method: string;
  paidUSD: number;
  paidBs: number;
  paidTickets: number;
  paidOrders: number;
  pendingUSD: number;
  pendingBs: number;
  pendingTickets: number;
  pendingOrders: number;
  totalUSD: number;
  totalTickets: number;
  totalOrders: number;
}

export interface OrganizerMetrics {
  totalReservations: number;
  totalTicketsCount: number;
  totalRevenueUSD: number;
  totalRevenueBs: number;
  paidReservationsCount: number;
  pendingReservationsCount: number;
  paidTicketsCount?: number;
  paidRevenueUSD?: number;
  paidRevenueBs?: number;
  pendingRevenueUSD?: number;
  pendingRevenueBs?: number;
  maxCapacity: number;
  occupancyPercentage: number;
  topRequestedArtists: { name: string; count: number }[];
  paymentMethods?: PaymentMethodMetric[];
}

export const DEFAULT_EVENT_SETTINGS: EventSettings = {
  eventDate: '09 OCT • 8:00 PM',
  venueName: 'Rock & Riff',
  venueAddress: 'Rock & Riff (antiguo Oleo Gastrobar) - Urb. La Viña, Valencia, Carabobo',
  officialWhatsapp: '58412882460',
  organizerPin: '5401385',
  priceGeneral: 10,
  priceVip: 20,
  maxCapacity: 350,
  ticketSubtitle: 'ARGENTO PARTY',
  ticketDoorInstructions: 'Mostrá este código por WhatsApp o en la entrada de Rock & Riff',
  customTracks: [],
};
