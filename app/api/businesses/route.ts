import { NextRequest } from 'next/server';
import { businessRepository } from '@/app/lib/repositories/business.repository';
import { handleApiCall } from '@/app/lib/api/handlers';

type BusinessStatus = 'pending' | 'active' | 'inactive' | 'dissolved' | 'pending_renewal';
type RecordStatus = 'new' | 'synced' | 'verified';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') as BusinessStatus | undefined;
  const recordStatus = searchParams.get('recordStatus') as RecordStatus | undefined;
  const businessCode = searchParams.get('businessCode') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  return handleApiCall(
    async () => businessRepository.search({
      search,
      status,
      recordStatus,
      businessCode,
      page,
      limit,
    }),
    '소상공인 목록 조회 실패'
  );
}
