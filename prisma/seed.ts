import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

// Prisma 7.x에서는 환경변수를 자동으로 읽음
const prisma = new PrismaClient({} as any);

async function main() {
  console.log('시드 데이터 생성 시작...');

  // 기본 어드민 유저 생성
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: hashedPassword,
      name: '관리자',
      email: 'admin@example.com',
    },
  });

  console.log('어드민 유저 생성 완료:', admin.username);
  console.log('비밀번호: admin123 (로그인 후 변경하세요)');
}

main()
  .catch((e) => {
    console.error('시드 데이터 생성 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
