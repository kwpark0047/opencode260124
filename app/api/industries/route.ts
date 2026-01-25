import { businessRepository } from '@/app/lib/repositories/business.repository';
import { handleApiCall } from '@/app/lib/api/handlers';

export async function GET() {
  return handleApiCall(
    () => businessRepository.getDistinctBusinessCodes(),
    '업종 목록 조회 실패'
  );
}
