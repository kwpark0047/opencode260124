import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
const businesses = [
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

export default function BusinessDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const business = businesses.find(b => b.id === params.id);

  if (!business) {
    notFound();
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            소상공인 상세 정보
          </h1>
          <Link
            href="/businesses"
            className="text-blue-600 hover:text-blue-900"
          >
            ← 목록으로
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">상호명</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{business.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">상가업소번호</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{business.bizesId}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">상세 정보</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">도로명주소</dt>
                <dd className="mt-1 text-sm text-gray-900">{business.roadNameAddress || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">지번주소</dt>
                <dd className="mt-1 text-sm text-gray-900">{business.lotNumberAddress || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">전화번호</dt>
                <dd className="mt-1 text-sm text-gray-900">{business.phone || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">업종명</dt>
                <dd className="mt-1 text-sm text-gray-900">{business.businessName || '-'}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">상태 정보</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">영업 상태</dt>
                <dd className="mt-1">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[business.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                    {getStatusText(business.status)}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">기록 상태</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${business.recordStatus === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {business.recordStatus === 'new' ? '신규' : business.recordStatus}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}