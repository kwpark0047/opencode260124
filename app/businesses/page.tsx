'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

interface Business {
  id: string;
  bizesId: string;
  name: string;
  roadNameAddress: string | null;
  lotNumberAddress: string | null;
  businessName: string | null;
  status: 'pending' | 'active' | 'inactive' | 'dissolved' | 'pending_renewal';
  recordStatus: 'new' | 'synced' | 'verified';
  createdAt: string;
  updatedAt: string;
  lastSyncedAt: string;
  latitude: string | null;
  longitude: string | null;
  businessCode: string | null;
  indsLclsCd: string | null;
  indsLclsNm: string | null;
  indsMclsCd: string | null;
  indsMclsNm: string | null;
  indsSclsCd: string | null;
  indsSclsNm: string | null;
  dataSource: string;
}

interface SearchParams {
  search?: string;
  status?: 'pending' | 'active' | 'inactive' | 'dissolved' | 'pending_renewal';
  recordStatus?: 'new' | 'synced' | 'verified';
  businessCode?: string;
  page?: number;
}

const businesses: any[] = [
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
  },
  {
    id: '3',
    bizesId: 'TEST003',
    name: '테스트 상가 3',
    roadNameAddress: '서울시 마포구 마포대로 789',
    lotNumberAddress: '서울시 마포구 공덕동 789-10',
    phone: '02-555-7777',
    businessName: '의류',
    status: 'inactive',
    recordStatus: 'verified',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSyncedAt: new Date().toISOString(),
    latitude: '37.5663',
    longitude: '126.9019',
    businessCode: '98765',
    indsLclsCd: 'G',
    indsLclsNm: '도소매',
    indsMclsCd: 'G12',
    indsMclsNm: '의류',
    indsSclsCd: 'G12A',
    indsSclsNm: '일반의류',
    dataSource: 'test'
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  dissolved: 'bg-red-100 text-red-800',
};

const getStatusText = (status: string): string => {
  const statusText: Record<string, string> = {
    pending: '대기',
    active: '영업중',
    inactive: '휴업',
    dissolved: '폐업',
  };
  return statusText[status] || status;
};

function BusinessTable({ businesses }: { businesses: Business[] }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              상호명
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              주소
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              업종
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              상태
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              등록일
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              상세
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {businesses.map((business) => (
            <tr key={business.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center">
                  {business.recordStatus === 'new' && <span className="mr-2 text-blue-600">🆕</span>}
                  <div className="text-sm font-medium text-gray-900">
                    {business.name}
                  </div>
                  <div className="text-xs text-gray-500 ml-2">{business.bizesId}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {business.roadNameAddress || business.lotNumberAddress || '-'}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold">
                  {business.businessName || '-'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[business.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                  {getStatusText(business.status)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(business.createdAt).toLocaleDateString('ko-KR')}
              </td>
              <td className="px-6 py-4">
                <Link
                  href={`/businesses/${business.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  상세
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BusinessesPage() {
  const [filteredBusinesses, setFilteredBusinesses] = useState(businesses);
  const [searchParams, setSearchParams] = useState<SearchParams>({ page: 1 });

  const handleSearch = useCallback(() => {
    let filtered = [...businesses];

    if (searchParams.search) {
      const searchLower = searchParams.search.toLowerCase();
      filtered = filtered.filter(b => 
        b.name && b.name.toLowerCase().includes(searchLower) ||
        b.roadNameAddress && b.roadNameAddress.toLowerCase().includes(searchLower) ||
        b.businessName && b.businessName.toLowerCase().includes(searchLower)
      );
    }

    if (searchParams.status) {
      filtered = filtered.filter(b => b.status === searchParams.status);
    }

    if (searchParams.recordStatus) {
      filtered = filtered.filter(b => b.recordStatus === searchParams.recordStatus);
    }

    if (searchParams.businessCode) {
      filtered = filtered.filter(b => b.businessCode === searchParams.businessCode);
    }

    setFilteredBusinesses(filtered);
  }, [searchParams]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            소상공인 목록
          </h1>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="mb-6 rounded-lg bg-white p-6 shadow">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                검색
              </label>
              <input
                type="text"
                value={searchParams.search || ''}
                onChange={(e) => setSearchParams({ ...searchParams, search: e.target.value })}
                placeholder="상호명, 주소, 업종"
                className="w-full rounded-md border-gray-300 px-4 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                영업 상태
              </label>
              <select
                value={searchParams.status || ''}
                onChange={(e) => setSearchParams({ ...searchParams, status: e.target.value as any })}
                className="w-full rounded-md border-gray-300 px-4 py-2 text-sm"
              >
                <option value="">전체</option>
                <option value="pending">대기</option>
                <option value="active">영업중</option>
                <option value="inactive">휴업</option>
                <option value="dissolved">폐업</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                검색
              </button>
            </div>
          </div>
        </form>

        {filteredBusinesses.length === 0 ? (
          <div className="py-12 text-center text-gray-600">
            검색 결과가 없습니다.
          </div>
        ) : (
          <BusinessTable businesses={filteredBusinesses} />
        )}
      </main>
    </div>
  );
}