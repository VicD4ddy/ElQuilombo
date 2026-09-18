import { NextResponse } from 'next/server';
import { getEventSettings, saveEventSettings } from '../../../../lib/settings';

export async function GET() {
  try {
    const settings = await getEventSettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch settings',
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = await saveEventSettings(body);
    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to save settings',
    }, { status: 500 });
  }
}
