import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '../../../../lib/supabase';
import { OrganizerMetrics, PaymentMethodMetric } from '../../../../types/settings';

export async function GET() {
  const client = supabaseAdmin || supabase;
  if (!isSupabaseConfigured || !client) {
    return NextResponse.json({
      success: false,
      error: 'Supabase is not configured',
      reservations: [],
      metrics: null,
    }, { status: 500 });
  }

  try {
    const { data: reservations, error } = await client
      .from('reservations')
      .select('*')
      .neq('tier_id', 'deleted')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const items = reservations || [];

    // Calculate live organizer metrics
    let totalTicketsCount = 0;
    let totalRevenueUSD = 0;
    let totalRevenueBs = 0;

    let paidCount = 0;
    let paidTicketsCount = 0;
    let paidRevenueUSD = 0;
    let paidRevenueBs = 0;

    let cashCount = 0;
    let cashTicketsCount = 0;
    let cashRevenueUSD = 0;
    let cashRevenueBs = 0;

    let pendingCount = 0;
    let pendingRevenueUSD = 0;
    let pendingRevenueBs = 0;
    const artistCounts: Record<string, number> = {};

    const STANDARD_METHODS = [
      'Pago Móvil',
      'Zelle',
      'Binance Pay (USDT)',
      'Efectivo en Rock & Riff',
    ];

    const methodStats: Record<string, PaymentMethodMetric> = {};

    for (const m of STANDARD_METHODS) {
      methodStats[m] = {
        method: m,
        paidUSD: 0,
        paidBs: 0,
        paidTickets: 0,
        paidOrders: 0,
        cashUSD: 0,
        cashBs: 0,
        cashTickets: 0,
        cashOrders: 0,
        pendingUSD: 0,
        pendingBs: 0,
        pendingTickets: 0,
        pendingOrders: 0,
        totalUSD: 0,
        totalTickets: 0,
        totalOrders: 0,
      };
    }

    for (const r of items) {
      const qty = Number(r.quantity) || 1;
      const usd = Number(r.total_usd) || 0;
      const bs = Number(r.total_ref_bs) || 0;
      const methodRaw = (r.payment_method && typeof r.payment_method === 'string' && r.payment_method.trim())
        ? r.payment_method.trim()
        : 'Efectivo en Rock & Riff';

      const isCash = !r.is_paid && (
        r.tier_id === 'cash' ||
        r.tier_id === 'efectivo' ||
        (typeof r.payment_method === 'string' && r.payment_method.toLowerCase().includes('efectivo'))
      );
      r.payment_status = r.is_paid ? 'paid' : (isCash ? 'cash' : 'pending');

      totalTicketsCount += qty;
      totalRevenueUSD += usd;
      totalRevenueBs += bs;

      if (!methodStats[methodRaw]) {
        methodStats[methodRaw] = {
          method: methodRaw,
          paidUSD: 0,
          paidBs: 0,
          paidTickets: 0,
          paidOrders: 0,
          cashUSD: 0,
          cashBs: 0,
          cashTickets: 0,
          cashOrders: 0,
          pendingUSD: 0,
          pendingBs: 0,
          pendingTickets: 0,
          pendingOrders: 0,
          totalUSD: 0,
          totalTickets: 0,
          totalOrders: 0,
        };
      }

      const m = methodStats[methodRaw];
      m.totalOrders += 1;
      m.totalTickets += qty;
      m.totalUSD += usd;

      if (r.is_paid) {
        paidCount += 1;
        paidTicketsCount += qty;
        paidRevenueUSD += usd;
        paidRevenueBs += bs;

        m.paidOrders += 1;
        m.paidTickets += qty;
        m.paidUSD += usd;
        m.paidBs += bs;
      } else if (isCash) {
        cashCount += 1;
        cashTicketsCount += qty;
        cashRevenueUSD += usd;
        cashRevenueBs += bs;

        m.cashOrders = (m.cashOrders || 0) + 1;
        m.cashTickets = (m.cashTickets || 0) + qty;
        m.cashUSD = (m.cashUSD || 0) + usd;
        m.cashBs = (m.cashBs || 0) + bs;
      } else {
        pendingCount += 1;
        pendingRevenueUSD += usd;
        pendingRevenueBs += bs;

        m.pendingOrders += 1;
        m.pendingTickets += qty;
        m.pendingUSD += usd;
        m.pendingBs += bs;
      }

      if (r.favorite_artist && typeof r.favorite_artist === 'string') {
        const clean = r.favorite_artist.trim();
        if (clean.length > 1) {
          artistCounts[clean] = (artistCounts[clean] || 0) + 1;
        }
      }
    }

    const paymentMethods = Object.values(methodStats).sort((a, b) => {
      const aIndex = STANDARD_METHODS.indexOf(a.method);
      const bIndex = STANDARD_METHODS.indexOf(b.method);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return b.paidUSD - a.paidUSD;
    });

    const topRequestedArtists = Object.entries(artistCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const maxCapacity = 350;
    const occupancyPercentage = Math.min(Math.round((totalTicketsCount / maxCapacity) * 100), 100);

    const metrics: OrganizerMetrics = {
      totalReservations: items.length,
      totalTicketsCount,
      totalRevenueUSD,
      totalRevenueBs,
      paidReservationsCount: paidCount,
      cashReservationsCount: cashCount,
      pendingReservationsCount: pendingCount,
      paidTicketsCount,
      paidRevenueUSD,
      paidRevenueBs,
      cashTicketsCount,
      cashRevenueUSD,
      cashRevenueBs,
      pendingRevenueUSD,
      pendingRevenueBs,
      maxCapacity,
      occupancyPercentage,
      topRequestedArtists,
      paymentMethods,
    };

    return NextResponse.json({
      success: true,
      reservations: items,
      metrics,
    });
  } catch (error: any) {
    console.error('[Admin Reservations API] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch reservations',
      reservations: [],
    }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const client = supabaseAdmin || supabase;
  if (!isSupabaseConfigured || !client) {
    return NextResponse.json({
      success: false,
      error: 'Supabase is not configured',
    }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id, ticket_code, is_paid, payment_status, payment_method, quantity, total_usd, total_ref_bs } = body;

    if (!id && !ticket_code) {
      return NextResponse.json({
        success: false,
        error: 'Missing reservation identifier (id or ticket_code)',
      }, { status: 400 });
    }

    const updates: Record<string, any> = {};

    if (typeof payment_status === 'string') {
      if (payment_status === 'paid') {
        updates.is_paid = true;
        updates.tier_id = 'general';
      } else if (payment_status === 'cash') {
        updates.is_paid = false;
        updates.tier_id = 'cash';
      } else if (payment_status === 'pending') {
        updates.is_paid = false;
        updates.tier_id = 'general';
      }
    } else if (typeof is_paid !== 'undefined') {
      updates.is_paid = Boolean(is_paid);
      if (updates.is_paid) {
        updates.tier_id = 'general';
      }
    }

    if (typeof payment_method === 'string') {
      updates.payment_method = payment_method.trim();
    }
    if (typeof quantity !== 'undefined') {
      const q = Math.max(1, Math.min(100, parseInt(String(quantity), 10) || 1));
      updates.quantity = q;
    }
    if (typeof total_usd !== 'undefined') {
      updates.total_usd = Number(total_usd);
    }
    if (typeof total_ref_bs !== 'undefined') {
      updates.total_ref_bs = Number(total_ref_bs);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No fields to update',
      }, { status: 400 });
    }

    let query = client.from('reservations').update(updates);

    if (id) {
      query = query.eq('id', id);
    } else if (ticket_code) {
      query = query.eq('ticket_code', ticket_code);
    }

    const { data, error } = await query.select().single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error(
          'No se pudo actualizar la reserva en Supabase (0 filas afectadas). Esto ocurre porque falta la política RLS de UPDATE en la tabla reservations en Supabase. Ejecuta el script SQL en el SQL Editor de Supabase.'
        );
      }
      throw error;
    }

    if (data) {
      const isCash = !data.is_paid && (data.tier_id === 'cash' || data.tier_id === 'efectivo');
      data.payment_status = data.is_paid ? 'paid' : (isCash ? 'cash' : 'pending');
    }

    return NextResponse.json({
      success: true,
      updated: data,
    });

  } catch (error: any) {
    console.error('[Admin Update Reservation] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update reservation',
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const client = supabaseAdmin || supabase;
  if (!isSupabaseConfigured || !client) {
    return NextResponse.json({
      success: false,
      error: 'Supabase is not configured',
    }, { status: 500 });
  }

  try {
    let id: string | null = null;
    let ticket_code: string | null = null;

    // Check query params first
    const url = new URL(request.url);
    id = url.searchParams.get('id');
    ticket_code = url.searchParams.get('ticket_code');

    // If not in query params, try json body
    if (!id && !ticket_code) {
      try {
        const body = await request.json();
        id = body.id || null;
        ticket_code = body.ticket_code || null;
      } catch (e) {
        // No json body
      }
    }

    if (!id && !ticket_code) {
      return NextResponse.json({
        success: false,
        error: 'Missing reservation identifier (id or ticket_code)',
      }, { status: 400 });
    }

    // 1. Try real hard delete first
    let query = client.from('reservations').delete();

    if (id) {
      query = query.eq('id', id);
    } else if (ticket_code) {
      query = query.eq('ticket_code', ticket_code);
    }

    const { data, error } = await query.select();

    if (!error && data && data.length > 0) {
      return NextResponse.json({
        success: true,
        deleted: data[0],
        message: `Reserva #${data[0]?.ticket_code || ticket_code} eliminada exitosamente.`,
      });
    }

    // 2. Fallback: If hard delete returned 0 rows because RLS DELETE policy is missing,
    // gracefully mark as deleted and release unique constraints on DNI/ticket_code so the user is never blocked
    let findQuery = client.from('reservations').select('*');
    if (id) {
      findQuery = findQuery.eq('id', id);
    } else if (ticket_code) {
      findQuery = findQuery.eq('ticket_code', ticket_code);
    }
    const { data: found } = await findQuery.maybeSingle();

    if (found) {
      const suffix = Date.now().toString(36);
      const cleanDni = `DEL_${suffix}_${found.buyer_dni}`.slice(0, 32);
      const cleanCode = `DEL_${suffix}_${found.ticket_code}`.slice(0, 32);

      const { data: updated, error: updateError } = await client
        .from('reservations')
        .update({
          tier_id: 'deleted',
          buyer_dni: cleanDni,
          ticket_code: cleanCode,
        })
        .eq('id', found.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      return NextResponse.json({
        success: true,
        deleted: updated,
        message: `Reserva #${found.ticket_code} eliminada exitosamente.`,
      });
    }

    return NextResponse.json({
      success: false,
      error: 'No se encontró la reserva para eliminar.',
    }, { status: 404 });
  } catch (error: any) {
    console.error('[Admin Delete Reservation] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete reservation',
    }, { status: 500 });
  }
}


