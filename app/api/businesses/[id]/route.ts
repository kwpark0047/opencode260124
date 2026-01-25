import { NextRequest } from 'next/server';
import { businessRepository } from '@/app/lib/repositories/business.repository';
import { handleApiCall, createNotFoundResponse, createBadRequestResponse } from '@/app/lib/api/handlers';

type RecordStatus = 'new' | 'synced' | 'verified';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleApiCall(
    async () => {
      const business = await businessRepository.getById(params.id);
      if (!business) {
        throw new Error('소상공인을 찾을 수 없습니다');
      }
      return business;
    },
    '소상공인 조회 실패'
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { recordStatus } = body;

    if (!recordStatus) {
      return createBadRequestResponse('recordStatus가 필요합니다');
    }

    return handleApiCall(
      async () => {
        const business = await businessRepository.getById(params.id);
        if (!business) {
          throw new Error('소상공인을 찾을 수 없습니다');
        }

        if (recordStatus === 'verified') {
          await businessRepository.markAsVerified(business.bizesId);
        } else if (recordStatus === 'synced') {
          await businessRepository.markAsSynced(business.bizesId);
        } else {
          throw new Error('유효하지 않은 recordStatus 값입니다');
        }

        return await businessRepository.getById(params.id);
      },
      '소상공인 업데이트 실패'
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return createBadRequestResponse('잘못된 JSON 형식입니다');
    }
    return handleApiCall(() => { throw error; }, '소상공인 업데이트 실패');
  }
}
