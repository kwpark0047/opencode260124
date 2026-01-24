import { NextRequest, NextResponse } from 'next/server';
import { manualSync } from '.././workers/sync-worker';
import { syncLogger } from ../lib/logger';

export async function POST(request: NextRequest) {
  syncLogger.info('수동 동기화 API 호출');

  try {
    const body = await request.json();
    const { date } = body;

    const stats = await manualSync(date);

    return NextResponse.json({
      success: true,
      message: '동기화 완료',
      stats,
    });
  } catch (error) {
    syncLogger.error({ error }, '수동 동기화 API 실패');

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '동기화 실패',
      },
      { status: 500 }
    );
  }
}
