import { NextResponse } from 'next/server';

export const revalidate = 900; // Cache for 15 minutes in ISR

const DEFAULT_STATS = {
  views: '140.0K',
  likes: '28.8K',
  comments: '842',
  shares: '4.1K',
  raw: {
    views: 140043,
    likes: 28853,
    comments: 842,
    shares: 4157,
  },
  isLive: false,
};

function formatCompact(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
}

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const videoUrl = 'https://www.tiktok.com/@belleamar_/video/7677661590254046482';
    const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`, {
      signal: controller.signal,
      next: { revalidate: 900 },
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`TikWM returned HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data && data.code === 0 && data.data) {
      const { play_count, digg_count, comment_count, share_count } = data.data;

      const liveStats = {
        views: formatCompact(play_count || DEFAULT_STATS.raw.views),
        likes: formatCompact(digg_count || DEFAULT_STATS.raw.likes),
        comments: (comment_count || DEFAULT_STATS.raw.comments).toString(),
        shares: formatCompact(share_count || DEFAULT_STATS.raw.shares),
        raw: {
          views: play_count || DEFAULT_STATS.raw.views,
          likes: digg_count || DEFAULT_STATS.raw.likes,
          comments: comment_count || DEFAULT_STATS.raw.comments,
          shares: share_count || DEFAULT_STATS.raw.shares,
        },
        lastUpdated: new Date().toISOString(),
        isLive: true,
      };

      return NextResponse.json(liveStats, {
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
        },
      });
    }

    throw new Error(data?.msg || 'Invalid TikTok API response');
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn('[TikTok Stats API] Falling back to baseline stats:', error?.message || error);

    return NextResponse.json(DEFAULT_STATS, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300',
      },
    });
  }
}
