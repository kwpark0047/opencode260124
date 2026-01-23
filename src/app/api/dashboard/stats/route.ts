import { NextResponse } from 'next/server';
import { businessRepository } from '@/lib/repositories/business.repository';

export async function GET() {
  try {
    const stats = await businessRepository.getStats();

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '통계 조회 실패',
      },
      { status: 500 }
    );
  }
}
