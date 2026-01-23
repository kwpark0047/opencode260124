import { NextRequest, NextResponse } from 'next/server';
import { businessRepository } from '@/lib/repositories/business.repository';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') as any || undefined;
  const recordStatus = searchParams.get('recordStatus') as any || undefined;
  const businessCode = searchParams.get('businessCode') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const result = await businessRepository.search({
      search,
      status,
      recordStatus,
      businessCode,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '소상공인 목록 조회 실패',
      },
      { status: 500 }
    );
  }
}
