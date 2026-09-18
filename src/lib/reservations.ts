import { supabase, isSupabaseConfigured } from './supabase';
import { TicketOrder } from '../types/ticket';
import { MemeSticker } from '../data/memes';

export interface ReservationRecord {
  id?: string;
  ticket_code: string;
  buyer_name: string;
  buyer_dni: string;
  buyer_phone: string;
  buyer_email: string;
  tier_id: string;
  tier_name: string;
  quantity: number;
  total_usd: number;
  total_ref_bs: number;
  payment_method: string;
  favorite_artist: string;
  meme_sticker_used?: string;
  is_paid: boolean;
  created_at?: string;
}

export interface ReservationResult {
  success: boolean;
  isExisting: boolean;
  order: TicketOrder;
  message?: string;
}

export async function processReservation(
  orderData: Omit<TicketOrder, 'ticketCode' | 'createdAt'>,
  selectedMeme: MemeSticker
): Promise<ReservationResult> {
  const normalizedDni = orderData.buyerDni.trim().toUpperCase();

  // If Supabase is not configured, fallback to client-side order
  if (!isSupabaseConfigured || !supabase) {
    const fallbackCode = `QLB-26-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      success: true,
      isExisting: false,
      order: {
        ...orderData,
        ticketCode: fallbackCode,
        createdAt: new Date().toISOString(),
      },
    };
  }

  try {
    // 1. Check if buyer_dni already exists to avoid duplicates
    const { data: existing, error: searchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('buyer_dni', normalizedDni)
      .maybeSingle();

    if (searchError) {
      console.warn('Error checking existing reservation:', searchError.message);
    }

    if (existing) {
      // Return existing reservation to user
      const existingOrder: TicketOrder = {
        tier: {
          id: existing.tier_id,
          name: existing.tier_name,
          priceUSD: Math.round(existing.total_usd / existing.quantity),
          features: [],
        },
        quantity: existing.quantity,
        buyerName: existing.buyer_name,
        buyerDni: existing.buyer_dni,
        buyerPhone: existing.buyer_phone,
        buyerEmail: existing.buyer_email,
        paymentMethod: existing.payment_method,
        favoriteArtist: existing.favorite_artist || '',
        totalUSD: Number(existing.total_usd),
        totalRefBs: Number(existing.total_ref_bs).toFixed(2),
        ticketCode: existing.ticket_code,
        createdAt: existing.created_at,
      };

      return {
        success: true,
        isExisting: true,
        order: existingOrder,
        message: `¡Ya tenías una preventa registrada con tu cédula (${normalizedDni})! Aquí está tu boleto digital.`,
      };
    }

    // 2. Generate new unique ticket code
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newTicketCode = `QLB-26-${randomCode}`;

    const newRecord: ReservationRecord = {
      ticket_code: newTicketCode,
      buyer_name: orderData.buyerName,
      buyer_dni: normalizedDni,
      buyer_phone: orderData.buyerPhone,
      buyer_email: orderData.buyerEmail,
      tier_id: orderData.tier.id,
      tier_name: orderData.tier.name,
      quantity: orderData.quantity,
      total_usd: orderData.totalUSD,
      total_ref_bs: parseFloat(orderData.totalRefBs),
      payment_method: orderData.paymentMethod,
      favorite_artist: orderData.favoriteArtist,
      meme_sticker_used: selectedMeme.id,
      is_paid: false,
    };

    const { data: inserted, error: insertError } = await supabase
      .from('reservations')
      .insert([newRecord])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    const createdOrder: TicketOrder = {
      ...orderData,
      ticketCode: inserted.ticket_code,
      createdAt: inserted.created_at,
    };

    return {
      success: true,
      isExisting: false,
      order: createdOrder,
      message: '¡Tu preventa ha sido apartada con éxito en El Quilombo!',
    };
  } catch (err: any) {
    console.error('Supabase reservation error:', err);
    // Fallback gracefully so user can still get a ticket & WhatsApp link
    const fallbackCode = `QLB-26-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      success: true,
      isExisting: false,
      order: {
        ...orderData,
        ticketCode: fallbackCode,
        createdAt: new Date().toISOString(),
      },
      message: 'Reserva generada localmente.',
    };
  }
}
