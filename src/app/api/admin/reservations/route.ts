import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '../../../../lib/supabase';
import { OrganizerMetrics } from '../../../../types/settings';

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
    let pendingCount = 0;
    const artistCounts: Record<string, number> = {};

    for (const r of items) {
      const qty = Number(r.quantity) || 1;
      const usd = Number(r.total_usd) || 0;
      const bs = Number(r.total_ref_bs) || 0;

      totalTicketsCount += qty;
      totalRevenueUSD += usd;
      totalRevenueBs += bs;

      if (r.is_paid) {
        paidCount += 1;
      } else {
        pendingCount += 1;
      }

      if (r.favorite_artist && typeof r.favorite_artist === 'string') {
        const clean = r.favorite_artist.trim();
        if (clean.length > 1) {
          artistCounts[clean] = (artistCounts[clean] || 0) + 1;
        }
      }
    }

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
      pendingReservationsCount: pendingCount,
      maxCapacity,
      occupancyPercentage,
      topRequestedArtists,
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
    const { id, ticket_code, is_paid } = body;

    if (!id && !ticket_code) {
      return NextResponse.json({
        success: false,
        error: 'Missing reservation identifier (id or ticket_code)',
      }, { status: 400 });
    }

    let query = client.from('reservations').update({ is_paid: Boolean(is_paid) });

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
