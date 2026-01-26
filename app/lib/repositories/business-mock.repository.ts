import { dbLogger } from '@/app/lib/logger';
import { mockBusinessRepository } from '@/app/lib/db';
export interface CreateBusinessInput {
  bizesId: string;
  name: string;
  roadNameAddress: string | null;
  lotNumberAddress: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  businessCode: string | null;
  businessName: string | null;
  indsLclsCd: string | null;
  indsLclsNm: string | null;
  indsMclsCd: string | null;
  indsMclsNm: string | null;
  indsSclsCd: string | null;
  indsSclsNm: string | null;
  status: 'pending' | 'active' | 'inactive' | 'dissolved' | 'pending_renewal';
  recordStatus: 'new' | 'synced' | 'verified';
  dataSource: string;
}

export interface SearchOptions {
  search?: string;
  status?: 'pending' | 'active' | 'inactive' | 'dissolved' | 'pending_renewal';
  recordStatus?: 'new' | 'synced' | 'verified';
  businessCode?: string;
  page?: number;
  limit?: number;
}

export class BusinessRepository {
  async createMany(data: CreateBusinessInput[]) {
    dbLogger.info({ count: data.length }, '소상공인 대량 생성 시작');
    const result = await mockBusinessRepository.createMany(data);
    dbLogger.info({ created: result.count }, '소상공인 대량 생성 완료');
    return result;
  }

  async upsertMany(data: CreateBusinessInput[]) {
    dbLogger.info({ count: data.length }, '소상공인 대량 upsert 시작');
    const results = await mockBusinessRepository.upsertMany(data);
    dbLogger.info({ processed: results.length }, '소상공인 대량 upsert 완료');
    return results;
  }

  async findByBizesId(bizesId: string) {
    return await mockBusinessRepository.findByBizesId(bizesId);
  }

  async search(options: SearchOptions) {
    const { search, status, recordStatus, businessCode, page = 1, limit = 20 } = options;

    const result = await mockBusinessRepository.search({
      search,
      status,
      recordStatus,
      businessCode,
      page,
      limit,
    });

    return result;
  }

  async findNewBusinesses(limit: number = 50) {
    const allBusinesses = await mockBusinessRepository.search({ limit });
    return allBusinesses.items.filter(b => b.recordStatus === 'new');
  }

  async markAsVerified(bizesId: string) {
    dbLogger.info({ bizesId }, '소상공인 검증 처리');
    return await mockBusinessRepository.markAsVerified(bizesId);
  }

  async markAsSynced(bizesId: string) {
    dbLogger.info({ bizesId }, '소상공인 동기화 처리');
    return await mockBusinessRepository.markAsSynced(bizesId);
  }

  async getStats() {
    return await mockBusinessRepository.getStats();
  }

  async getById(id: string) {
    return await mockBusinessRepository.getById(id);
  }

  async getDistinctBusinessCodes() {
    return await mockBusinessRepository.getDistinctBusinessCodes();
  }
}

export const businessRepository = new BusinessRepository();