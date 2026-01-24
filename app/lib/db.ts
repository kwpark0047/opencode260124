import { PrismaClient } from '../../prisma/app/generated/prisma';
import { supabase } from '../supabase';

// 전역 Prisma 클라이언트 (개발 환경에서 핫 리로딩 방지)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
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
