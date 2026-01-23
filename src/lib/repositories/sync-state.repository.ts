import { db } from './db';
import { syncLogger } from '../logger';

export interface SyncStateUpdate {
  syncStatus?: 'idle' | 'running' | 'success' | 'failed';
  errorMessage?: string | null;
  lastBusinessId?: string;
  newRecordsCount?: number;
  totalSynced?: number;
}

export class SyncStateRepository {
  async getSyncState(dataSource: string = 'public-data-portal') {
    return db.syncState.findUnique({
      where: { dataSource },
    });
  }

  async createSyncState(dataSource: string = 'public-data-portal') {
    return db.syncState.create({
      data: {
        dataSource,
        lastSyncedAt: new Date(),
        syncStatus: 'idle',
      },
    });
  }

  async updateSyncState(
    dataSource: string = 'public-data-portal',
    update: SyncStateUpdate
  ) {
    const existing = await db.syncState.findUnique({ where: { dataSource } });

    if (!existing) {
      return this.createSyncState(dataSource);
    }

    const result = await db.syncState.update({
      where: { dataSource },
      data: {
        ...update,
        updatedAt: new Date(),
        ...(update.totalSynced !== undefined && { syncCount: { increment: 1 } }),
      },
    });

    syncLogger.info({ dataSource, update }, '동기화 상태 업데이트');
    return result;
  }

  async setRunning(dataSource: string = 'public-data-portal') {
    return this.updateSyncState(dataSource, {
      syncStatus: 'running',
      errorMessage: null,
    });
  }

  async setSuccess(
    dataSource: string = 'public-data-portal',
    options: { lastBusinessId?: string; newRecordsCount?: number; totalSynced?: number }
  ) {
    return this.updateSyncState(dataSource, {
      syncStatus: 'success',
      errorMessage: null,
      lastSyncedAt: new Date(),
      ...options,
    });
  }

  async setFailed(
    dataSource: string = 'public-data-portal',
    errorMessage: string
  ) {
    syncLogger.error({ dataSource, errorMessage }, '동기화 실패');

    return this.updateSyncState(dataSource, {
      syncStatus: 'failed',
      errorMessage,
    });
  }

  async setIdle(dataSource: string = 'public-data-portal') {
    return this.updateSyncState(dataSource, {
      syncStatus: 'idle',
      errorMessage: null,
    });
  }
}

export const syncStateRepository = new SyncStateRepository();
