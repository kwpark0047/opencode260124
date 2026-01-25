import { NextRequest, NextResponse } from 'next/server';
import { businessRepository } from '@/app/lib/repositories/business.repository';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const business = await businessRepository.getById(params.id);

    if (!business) {
      return NextResponse.json(
        { error: '소상공인을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json(business);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '소상공인 조회 실패',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { recordStatus } = body;

    if (recordStatus) {
      const business = await businessRepository.getById(params.id);
      if (!business) {
        return NextResponse.json(
          { error: '소상공인을 찾을 수 없습니다' },
          { status: 404 }
        );
      }

      if (recordStatus === 'verified') {
        await businessRepository.markAsVerified(business.bizesId);
      } else if (recordStatus === 'synced') {
        await businessRepository.markAsSynced(business.bizesId);
      }

      const updatedBusiness = await businessRepository.getById(params.id);
      return NextResponse.json(updatedBusiness);
    }

    return NextResponse.json(
      { error: '유효하지 않은 요청' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '소상공인 업데이트 실패',
      },
      { status: 500 }
    );
  }
}
