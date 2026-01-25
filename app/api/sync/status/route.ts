import { NextResponse } from 'next/server';
import { syncStateRepository } from '@/app/lib/repositories/sync-state.repository';
import { getSchedulerStatus } from '@/app/lib/scheduler';

export async function GET() {
  try {
    const syncState = await syncStateRepository.getSyncState();
    const schedulerStatus = getSchedulerStatus();

    return NextResponse.json({
      syncState,
      schedulerStatus,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '상태 조회 실패',
      },
      { status: 500 }
    );
  }
}
