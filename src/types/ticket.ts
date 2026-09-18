export interface TicketTier {
  id: 'general' | 'vip';
  name: string;
  priceUSD: number;
  badge: string;
  description: string;
  features: string[];
}

export interface TicketOrder {
  tier: TicketTier;
  quantity: number;
  buyerName: string;
  buyerDni: string;
  buyerPhone: string;
  buyerEmail: string;
  paymentMethod: string;
  favoriteArtist: string;
  totalUSD: number;
  totalRefBs: string;
  ticketCode: string;
  createdAt?: string;
}
