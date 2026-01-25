import { businessRepository } from '@/app/lib/repositories/business.repository';
import { handleApiCall } from '@/app/lib/api/handlers';

export async function GET() {
  return handleApiCall(
    () => businessRepository.getStats(),
    '통계 조회 실패'
  );
}
