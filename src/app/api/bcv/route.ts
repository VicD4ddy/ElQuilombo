import { NextResponse } from 'next/server';
import { REF_EXCHANGE_RATE } from '../../../data/ticketing';

export const revalidate = 1800; // Cache for 30 minutes in ISR / Next.js Data Cache

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
      signal: controller.signal,
      next: { revalidate: 1800 },
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`DolarAPI returned HTTP ${response.status}`);
    }

    const data = await response.json();

    const rate = typeof data.promedio === 'number' && data.promedio > 0
      ? data.promedio
      : REF_EXCHANGE_RATE;

    return NextResponse.json({
      success: true,
      rate,
      currency: data.moneda || 'USD',
      source: 'BCV (Banco Central de Venezuela)',
      lastUpdated: data.fechaActualizacion || new Date().toISOString(),
      isLive: true,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      }
    });
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn('[BCV API] Error fetching live BCV exchange rate:', error?.message || error);

    // Graceful fallback to static reference rate
    return NextResponse.json({
      success: true,
      rate: REF_EXCHANGE_RATE,
      currency: 'USD',
      source: 'BCV (Referencia de respaldo)',
      lastUpdated: new Date().toISOString(),
      isLive: false,
    }, {
      status: 200, // Return 200 so frontend can safely use fallback without throwing
      headers: {
        'Cache-Control': 'no-cache',
      }
    });
  }
}
