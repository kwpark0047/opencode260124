import { PrismaClient } from '../generated/prisma/client';

const mockBusinesses = [
  {
    id: '1',
    bizesId: 'TEST001',
    name: '테스트 상가 1',
    roadNameAddress: '서울시 강남구 테헤란로 123',
    lotNumberAddress: '서울시 강남구 역삼동 123-45',
    phone: '02-123-4567',
    businessName: '카페',
    status: 'active',
    recordStatus: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSyncedAt: new Date().toISOString(),
    latitude: '37.5172',
    longitude: '127.0473',
    businessCode: '12345',
    indsLclsCd: 'I',
    indsLclsNm: '음식',
    indsMclsCd: 'I12',
    indsMclsNm: '커피',
    indsSclsCd: 'I12A',
    indsSclsNm: '카페',
    dataSource: 'test'
  },
  {
    id: '2', 
    bizesId: 'TEST002',
    name: '테스트 상가 2',
    roadNameAddress: '서울시 서초구 강남대로 456',
    lotNumberAddress: '서울시 서초구 서초동 456-78',
    phone: '02-987-6543',
    businessName: '식당',
    status: 'pending',
    recordStatus: 'synced',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSyncedAt: new Date().toISOString(),
    latitude: '37.4847',
    longitude: '127.0323',
    businessCode: '54321',
    indsLclsCd: 'I',
    indsLclsNm: '음식',
    indsMclsCd: 'I11',
    indsMclsNm: '한식',
    indsSclsCd: 'I11A',
    indsSclsNm: '일반한식',
    dataSource: 'test'
  }
];

class MockBusinessRepository {
  async createMany(data: any[]) {
    return { count: data.length };
  }

  async search(options: any = {}) {
    const { search, status, recordStatus, businessCode, page = 1, limit = 20 } = options;
    let filtered = [...mockBusinesses];

    if (search) {
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.roadNameAddress?.toLowerCase().includes(search.toLowerCase()) ||
        b.businessName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter(b => b.status === status);
    }

    if (recordStatus) {
      filtered = filtered.filter(b => b.recordStatus === recordStatus);
    }

    if (businessCode) {
      filtered = filtered.filter(b => b.businessCode === businessCode);
    }

    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      items: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }

  async findByBizesId(bizesId: string) {
    return mockBusinesses.find(b => b.bizesId === bizesId) || null;
  }

  async getById(id: string) {
    return mockBusinesses.find(b => b.id === id) || null;
  }

  async upsertMany(data: any[]) {
    return data.map(item => ({ ...item, id: item.bizesId }));
  }

  async markAsVerified(bizesId: string) {
    const business = mockBusinesses.find(b => b.bizesId === bizesId);
    if (business) {
      business.recordStatus = 'verified';
    }
    return business;
  }

  async markAsSynced(bizesId: string) {
    const business = mockBusinesses.find(b => b.bizesId === bizesId);
    if (business) {
      business.recordStatus = 'synced';
    }
    return business;
  }

  async getStats() {
    return {
      total: mockBusinesses.length,
      newToday: 1,
      newRecords: mockBusinesses.filter(b => b.recordStatus === 'new').length,
      active: mockBusinesses.filter(b => b.status === 'active').length,
      inactive: mockBusinesses.filter(b => b.status === 'inactive').length,
    };
  }

  async getDistinctBusinessCodes() {
    const codes = mockBusinesses
      .filter(b => b.businessCode)
      .map(b => ({ businessCode: b.businessCode, businessName: b.businessName }));
    return Array.from(new Set(codes.map(c => c.businessCode)))
      .map(code => codes.find(c => c.businessCode === code));
  }
}

class MockSyncStateRepository {
  async getSyncState() {
    return {
      id: '1',
      dataSource: 'public-data-portal',
      lastSyncedAt: new Date(),
      syncStatus: 'idle',
      errorMessage: null,
      syncCount: 0,
      totalSynced: 0,
      newRecordsCount: 0,
    };
  }
}

export const db = {
  business: {
    createMany: (data: any) => Promise.resolve({ count: data.data?.length || 0 }),
    findMany: (options: any) => Promise.resolve([]),
    findUnique: (options: any) => Promise.resolve(null),
    findFirst: (options: any) => Promise.resolve(null),
    count: (options: any) => Promise.resolve(0),
    upsert: (data: any) => Promise.resolve({ id: 'mock' }),
    update: (data: any) => Promise.resolve({ id: 'mock' }),
    create: (data: any) => Promise.resolve({ id: 'mock' }),
  },
  syncState: {
    findUnique: (options: any) => Promise.resolve(null),
    update: (data: any) => Promise.resolve({ id: 'mock' }),
    create: (data: any) => Promise.resolve({ id: 'mock' }),
  },
  auditLog: {
    create: (data: any) => Promise.resolve({ id: 'mock' }),
    findMany: (options: any) => Promise.resolve([]),
  },
  admin: {
    findUnique: (options: any) => Promise.resolve(null),
  },
  $connect: () => Promise.resolve(),
  $disconnect: () => Promise.resolve(),
};

export const mockBusinessRepository = new MockBusinessRepository();
export const mockSyncStateRepository = new MockSyncStateRepository();
export async function testConnection() {
  console.log('Using mock database - connection test skipped');
  return true;
}

export async function disconnectDatabase() {
  console.log('Mock database - disconnect skipped');
}

export default db;