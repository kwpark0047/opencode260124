import { Navbar } from '@/components/Navbar';

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
  const res = await fetch(
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/businesses?recordStatus=new&limit=50`,
    { cache: 'no-store' }
  );
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
              등록일
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              상세
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.items && data.items.length > 0 ? (
            data.items.map((business: any) => (
              <tr key={business.id} className="hover:bg-blue-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <span className="mr-2 text-blue-600">🆕</span>
                    <div className="text-sm font-medium text-gray-900">
                      {business.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {business.roadNameAddress || business.lotNumberAddress || '-'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                    {business.businessName || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(business.createdAt).toLocaleDateString('ko-KR')}
                </td>
                <td className="px-6 py-4">
                  <a
                    href={`/businesses/${business.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    상세
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
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
