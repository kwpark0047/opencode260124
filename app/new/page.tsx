import Navbar from '../components/Navbar';
import { BusinessTableRow } from '../components/business/BusinessTableRow';
import { createApiUrl } from '../lib/constants';

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

export default function NewBusinessesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            신규 등록 소상공인
          </h1>
          <p className="text-gray-600">
            최근에 등록된 신규 소상공인 목록입니다.
          </p>
        </div>

        <NewBusinessesList />
      </main>
    </div>
  );
}

async function NewBusinessesList() {
  const res = await fetch(createApiUrl('/api/businesses?recordStatus=new&limit=50'), {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('신규 소상공인 목록을 불러오는데 실패했습니다.');
  }
  
  const data = await res.json();

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-50">
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
          {data.items && data.items.length > 0 ? (
            data.items.map((business: Business) => (
              <BusinessTableRow 
                key={business.id} 
                business={business} 
                showNewBadge={true} 
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-12 text-center text-gray-500"
              >
                신규 등록된 소상공인이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
