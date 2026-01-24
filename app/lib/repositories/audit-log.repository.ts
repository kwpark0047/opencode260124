import { db } from './db';
import { dbLogger } from './logger';

export interface AuditLogInput {
  businessId: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE';
  previousData?: any;
  newData?: any;
  userId?: string;
  changedBy?: string;
}

export class AuditLogRepository {
  async log(input: AuditLogInput) {
    dbLogger.info(
      { businessId: input.businessId, action: input.action },
      '감사 로그 기록'
    );

    return db.auditLog.create({
      data: input,
    });
  }

  async getBusinessLogs(businessId: string, limit: number = 50) {
    return db.auditLog.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' as const },
      take: limit,
      include: {
        admin: {
          select: { username: true, name: true },
        },
      },
    });
  }

  async getRecentLogs(limit: number = 100) {
    return db.auditLog.findMany({
      orderBy: { createdAt: 'desc' as const },
      take: limit,
      include: {
        business: {
          select: { name: true, bizesId: true },
        },
        admin: {
          select: { username: true, name: true },
        },
      },
    });
  }
}

export const auditLogRepository = new AuditLogRepository();
