'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { BusinessTableRow } from '../components/business/BusinessTableRow';

interface Business {
  id: string;
  bizesId: string;
  name: string;
  roadNameAddress: string | null;
  lotNumberAddress: string | null;
  businessName: string | null;
  status: string;
  recordStatus: string;
  createdAt: string;
}

type BusinessStatus = 'pending' | 'active' | 'inactive' | 'dissolved' | 'pending_renewal';
type RecordStatus = 'new' | 'synced' | 'verified';

interface SearchParams {
  search?: string;
  status?: BusinessStatus;
  recordStatus?: RecordStatus;
  businessCode?: string;
  page?: number;
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({ page: 1 });
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchParams.search) params.set('search', searchParams.search);
      if (searchParams.status) params.set('status', searchParams.status);
      if (searchParams.recordStatus) params.set('recordStatus', searchParams.recordStatus);
      if (searchParams.businessCode) params.set('businessCode', searchParams.businessCode);
      params.set('page', String(searchParams.page || 1));
      params.set('limit', '20');

      const res = await fetch(`/api/businesses?${params}`);
      if (!res.ok) throw new Error('API 요청 실패');
      const data = await res.json();
      setBusinesses(data.items || []);
    } catch (error) {
      console.error('소상공인 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchParams({ ...searchParams, page: 1 });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            소상공인 목록
          </h1>
        </div>

        <SearchForm onSearch={handleSearch} />

        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600">로딩 중...</p>
          </div>
        ) : (
          <>
            <BusinessTable businesses={businesses} />
            {businesses.length === 0 && (
              <div className="py-12 text-center text-gray-600">
                검색 결과가 없습니다.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function SearchForm({ onSearch }: { onSearch: (e: React.FormEvent) => void }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  return (
    <form onSubmit={onSearch} className="mb-6 rounded-lg bg-white p-6 shadow">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            검색
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="상호명, 주소, 업종"
            className="w-full rounded-md border-gray-300 px-4 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            영업 상태
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
  );
}

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
            <BusinessTableRow key={business.id} business={business} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
