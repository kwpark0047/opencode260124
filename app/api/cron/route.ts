import { startScheduler } from '@/app/lib/scheduler';
import { syncLogger } from '@/app/lib/logger';

const SCHEDULE = process.env.SYNC_SCHEDULE || '0 2 * * *';

startScheduler(SCHEDULE);

syncLogger.info({ schedule: SCHEDULE }, '동기화 스케줄러 시작됨');

export const runtime = 'nodejs';
