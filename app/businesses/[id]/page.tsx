import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function BusinessDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <BusinessDetail id={params.id} />
      </main>
    </div>
  );
}

async function BusinessDetail({ id }: { id: string }) {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/businesses/${id}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    return <div>소상공인을 찾을 수 없습니다.</div>;
  }

  const business = await res.json();

  if (!business) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              기본 정보
            </h2>

            <dl className="space-y-3">
              <DetailRow label="상호명" value={business.name} />
              <DetailRow label="상가업소번호" value={business.bizesId} />
              <DetailRow
                label="주소"
                value={business.roadNameAddress || business.lotNumberAddress || '-'}
              />
              <DetailRow label="연락처" value={business.phone || '-'} />
            </dl>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              업종 정보
            </h2>

            <dl className="space-y-3">
              <DetailRow label="업종" value={business.businessName || '-'} />
              <DetailRow label="대분류" value={business.indsLclsNm || '-'} />
              <DetailRow label="중분류" value={business.indsMclsNm || '-'} />
              <DetailRow label="소분류" value={business.indsSclsNm || '-'} />
            </dl>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          상태 정보
        </h2>

        <dl className="grid gap-3 lg:grid-cols-2">
          <DetailRow
            label="영업 상태"
            value={<StatusBadge status={business.status} />}
          />
          <DetailRow
            label="레코드 상태"
            value={<RecordStatusBadge status={business.recordStatus} />}
          />
          <DetailRow
            label="등록일"
            value={new Date(business.createdAt).toLocaleString('ko-KR')}
          />
          <DetailRow
            label="마지막 동기화"
            value={
              business.lastSyncedAt
                ? new Date(business.lastSyncedAt).toLocaleString('ko-KR')
                : '-'
            }
          />
        </dl>

        {business.latitude && business.longitude && (
          <div className="mt-6">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              위치 정보
            </h3>
            <div className="text-sm text-gray-600">
              위도: {Number(business.latitude).toFixed(6)} / 경도:{' '}
              {Number(business.longitude).toFixed(6)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex border-b border-gray-100 py-3 last:border-0">
      <dt className="w-32 flex-shrink-0 text-sm font-medium text-gray-500">
        {label}
      </dt>
      <dd className="ml-4 flex-grow text-sm text-gray-900">
        {value}
      </dd>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    dissolved: 'bg-red-100 text-red-800',
  };

  const text: Record<string, string> = {
    pending: '대기',
    active: '영업중',
    inactive: '휴업',
    dissolved: '폐업',
  };

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
      colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }`}>
      {text[status] || status}
    </span>
  );
}

function RecordStatusBadge({ status }: { status: string }) {
  const colors = {
    new: 'bg-blue-100 text-blue-800',
    synced: 'bg-gray-100 text-gray-800',
    verified: 'bg-purple-100 text-purple-800',
  };

  const text: Record<string, string> = {
    new: '신규',
    synced: '동기화됨',
    verified: '검증됨',
  };

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
      colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }`}>
      {text[status] || status}
    </span>
  );
}

function BackButton() {
  return (
    <Link
      href="/businesses"
      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      ← 목록으로 돌아가기
    </Link>
  );
}
