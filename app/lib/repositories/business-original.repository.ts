import { db } from '@/app/lib/db';
import { dbLogger } from '@/app/lib/logger';
import { PrismaClient, BusinessStatus, RecordStatus } from '@prisma/client';

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
  status: BusinessStatus;
  recordStatus: RecordStatus;
  dataSource: string;
}

export interface SearchOptions {
  search?: string;
  status?: BusinessStatus;
  recordStatus?: RecordStatus;
  businessCode?: string;
  page?: number;
  limit?: number;
}

export class BusinessRepository {
  async createMany(data: CreateBusinessInput[]) {
    dbLogger.info({ count: data.length }, '소상공인 대량 생성 시작');

    const result = await db.business.createMany({
      data: data.map(d => ({
        ...d,
        lastSyncedAt: new Date(),
      })),
      skipDuplicates: true,
    });

    dbLogger.info({ created: result.count }, '소상공인 대량 생성 완료');
    return result;
  }

  async upsertMany(data: CreateBusinessInput[]) {
    dbLogger.info({ count: data.length }, '소상공인 대량 upsert 시작');

    const results = [];
    for (const item of data) {
      const result = await db.business.upsert({
        where: { bizesId: item.bizesId },
        update: {
          name: item.name,
          roadNameAddress: item.roadNameAddress,
          lotNumberAddress: item.lotNumberAddress,
          phone: item.phone,
          latitude: item.latitude,
          longitude: item.longitude,
          businessCode: item.businessCode,
          businessName: item.businessName,
          indsLclsCd: item.indsLclsCd,
          indsLclsNm: item.indsLclsNm,
          indsMclsCd: item.indsMclsCd,
          indsMclsNm: item.indsMclsNm,
          indsSclsCd: item.indsSclsCd,
          indsSclsNm: item.indsSclsNm,
          status: item.status,
          recordStatus: item.recordStatus,
          lastSyncedAt: new Date(),
          updatedAt: new Date(),
        },
        create: {
          ...item,
          lastSyncedAt: new Date(),
        },
      });
      results.push(result);
    }

    dbLogger.info({ processed: results.length }, '소상공인 대량 upsert 완료');
    return results;
  }

  async findByBizesId(bizesId: string) {
    return db.business.findUnique({
      where: { bizesId },
    });
  }

  async search(options: SearchOptions) {
    const { search, status, recordStatus, businessCode, page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { roadNameAddress: { contains: search, mode: 'insensitive' } },
        { lotNumberAddress: { contains: search, mode: 'insensitive' } },
        { businessName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (recordStatus) {
      where.recordStatus = recordStatus;
    }

    if (businessCode) {
      where.businessCode = businessCode;
    }

    const [items, total] = await Promise.all([
      db.business.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' as const },
      }),
      db.business.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findNewBusinesses(limit: number = 50) {
    return db.business.findMany({
      where: { recordStatus: RecordStatus.new },
      orderBy: { createdAt: 'desc' as const },
      take: limit,
    });
  }

  async markAsVerified(bizesId: string) {
    return db.business.update({
      where: { bizesId },
      data: { recordStatus: RecordStatus.verified },
    });
  }

  async markAsSynced(bizesId: string) {
    return db.business.update({
      where: { bizesId },
      data: { recordStatus: RecordStatus.synced },
    });
  }

  async getStats() {
    const [
      total,
      newToday,
      newRecords,
      active,
      inactive,
    ] = await Promise.all([
      db.business.count(),
      db.business.count({
        where: {
          recordStatus: RecordStatus.new,
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      db.business.count({ where: { recordStatus: RecordStatus.new } }),
      db.business.count({ where: { status: BusinessStatus.active } }),
      db.business.count({ where: { status: BusinessStatus.inactive } }),
    ]);

    return { total, newToday, newRecords, active, inactive };
  }

  async getById(id: string) {
    return db.business.findUnique({
      where: { id },
    });
  }

  async getDistinctBusinessCodes() {
    const businesses = await db.business.findMany({
      select: { businessCode: true, businessName: true },
      where: { businessCode: { not: null } },
      distinct: ['businessCode'],
      orderBy: { businessCode: 'asc' },
    });

    return businesses.filter(b => b.businessCode !== null);
  }
}

export const businessRepository = new BusinessRepository();
