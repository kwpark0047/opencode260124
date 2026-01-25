import { NextResponse } from 'next/server';
import { businessRepository } from '@/app/lib/repositories/business.repository';

export async function GET() {
  try {
    const businessCodes = await businessRepository.getDistinctBusinessCodes();

    return NextResponse.json(businessCodes);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '업종 목록 조회 실패',
      },
      { status: 500 }
    );
  }
}
