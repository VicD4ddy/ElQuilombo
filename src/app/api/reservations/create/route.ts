import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '../../../../lib/supabase';
import { TicketOrder } from '../../../../types/ticket';
import { MemeSticker } from '../../../../data/memes';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderData, selectedMeme } = body as {
      orderData: Omit<TicketOrder, 'ticketCode' | 'createdAt'>;
      selectedMeme: MemeSticker;
    };

    if (!orderData || !orderData.buyerName || !orderData.buyerDni || !orderData.buyerPhone) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios para procesar la reserva.' },
        { status: 400 }
      );
    }

    const client = supabaseAdmin || supabase;
    if (!isSupabaseConfigured || !client) {
      return NextResponse.json(
        { success: false, error: 'Supabase no está configurado en el servidor.' },
        { status: 503 }
      );
    }

    const normalizedDni = orderData.buyerDni.trim().toUpperCase();

    // 1. Verificar si ya existe una reserva previa con la misma cédula
    const { data: existing, error: searchError } = await client
      .from('reservations')
      .select('*')
      .eq('buyer_dni', normalizedDni)
      .maybeSingle();

    if (searchError) {
      console.warn('[API/Reservations] Error buscando duplicado de cédula:', searchError.message);
    }

    if (existing) {
      const isExistingCash = !existing.is_paid && (
        existing.tier_id === 'cash' ||
        existing.tier_id === 'efectivo' ||
        (typeof existing.payment_method === 'string' && existing.payment_method.toLowerCase().includes('efectivo'))
      );

      const existingOrder: TicketOrder = {
        tier: {
          id: existing.tier_id,
          name: existing.tier_name,
          priceUSD: Math.round(existing.total_usd / existing.quantity) || 15,
          features: [],
        },
        quantity: existing.quantity,
        buyerName: existing.buyer_name,
        buyerDni: existing.buyer_dni,
        buyerPhone: existing.buyer_phone,
        buyerEmail: existing.buyer_email,
        paymentMethod: existing.payment_method,
        favoriteArtist: existing.favorite_artist || '',
        referralSource: existing.referral_source || 'Otro',
        totalUSD: Number(existing.total_usd),
        totalRefBs: Number(existing.total_ref_bs).toLocaleString('es-VE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        ticketCode: existing.ticket_code,
        createdAt: existing.created_at,
        isPaid: Boolean(existing.is_paid),
        paymentStatus: existing.is_paid ? 'paid' : (isExistingCash ? 'cash' : 'pending'),
      };

      return NextResponse.json({
        success: true,
        isExisting: true,
        order: existingOrder,
        message: `¡Ya tenías una entrada registrada con tu cédula (${normalizedDni})! Aquí está tu boleto digital.`,
      });
    }

    // 2. Generar código de reserva único
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newTicketCode = `QLB-26-${randomCode}`;

    // Limpieza segura de montos en Bolívares
    const cleanedRefBs = typeof orderData.totalRefBs === 'string'
      ? parseFloat(orderData.totalRefBs.replace(/\./g, '').replace(',', '.'))
      : Number(orderData.totalRefBs);
    const parsedRefBs = isNaN(cleanedRefBs) ? 0 : cleanedRefBs;

    const newRecord = {
      ticket_code: newTicketCode,
      buyer_name: orderData.buyerName.trim(),
      buyer_dni: normalizedDni,
      buyer_phone: orderData.buyerPhone.trim(),
      buyer_email: orderData.buyerEmail ? orderData.buyerEmail.trim() : '',
      tier_id: orderData.tier?.id || 'general',
      tier_name: orderData.tier?.name || 'Pase General Oficial',
      quantity: orderData.quantity || 1,
      total_usd: orderData.totalUSD || 15,
      total_ref_bs: parsedRefBs,
      payment_method: orderData.paymentMethod || 'Pago Móvil',
      favorite_artist: orderData.favoriteArtist ? orderData.favoriteArtist.trim() : 'Milo J / Trueno',
      referral_source: orderData.referralSource || 'Otro',
      meme_sticker_used: selectedMeme?.id || 'meme-1',
      is_paid: false,
    };

    // 3. Insertar en Supabase
    let insertResult = await client
      .from('reservations')
      .insert([newRecord])
      .select()
      .single();

    // Reintento sin referral_source si la columna no existiera
    if (insertResult.error && insertResult.error.message?.includes('referral_source')) {
      console.warn('[API/Reservations] Reintentando insert sin columna referral_source...');
      const { referral_source, ...recordWithoutReferral } = newRecord;
      insertResult = await client
        .from('reservations')
        .insert([recordWithoutReferral])
        .select()
        .single();
    }

    if (insertResult.error) {
      console.error('[API/Reservations] Error al insertar en Supabase:', insertResult.error);
      throw insertResult.error;
    }

    const inserted = insertResult.data;

    const isCreatedCash = !inserted.is_paid && (
      inserted.tier_id === 'cash' ||
      inserted.tier_id === 'efectivo' ||
      (typeof inserted.payment_method === 'string' && inserted.payment_method.toLowerCase().includes('efectivo'))
    );

    const createdOrder: TicketOrder = {
      ...orderData,
      ticketCode: inserted.ticket_code,
      createdAt: inserted.created_at,
      isPaid: Boolean(inserted.is_paid),
      paymentStatus: inserted.is_paid ? 'paid' : (isCreatedCash ? 'cash' : 'pending'),
    };

    return NextResponse.json({
      success: true,
      isExisting: false,
      order: createdOrder,
      message: '¡Tu entrada ha sido apartada con éxito en El Quilombo!',
    });
  } catch (error: any) {
    console.error('[API/Reservations] Error crítico en creación de reserva:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error en el servidor de base de datos' },
      { status: 500 }
    );
  }
}
