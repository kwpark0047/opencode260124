import { Prisma } from '../generated/prisma/client';
import { supabase } from '@/app/lib/supabase';

// 전역 Prisma 클라이언트 (개발 환경에서 핫 리로딩 방지)
declare global {
  var __prisma: Prisma.PrismaClient | undefined;
}

export const db = globalThis.__prisma || new Prisma.PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = db;
}

// 데이터베이스 연결 테스트
export async function testConnection() {
  try {
    await db.$connect();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// 그레이스풀 셧다운
export async function disconnectDatabase() {
  await db.$disconnect();
}

export default db;

// Export supabase for convenience
export { supabase }
