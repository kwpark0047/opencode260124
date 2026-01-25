import Link from 'next/link';
import { clsx } from 'clsx';

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

interface BusinessTableRowProps {
  business: Business;
  showNewBadge?: boolean;
}

export function BusinessTableRow({ business, showNewBadge = false }: BusinessTableRowProps) {
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
    <tr className="hover:bg-gray-50">
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center">
          {showNewBadge && <span className="mr-2 text-blue-600">🆕</span>}
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
        <span className={clsx(
          'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
          statusColors[business.status as keyof typeof statusColors] ||
          'bg-gray-100 text-gray-800'
        )}>
          {business.businessName || '-'}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={clsx(
          'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
          statusColors[business.status as keyof typeof statusColors] ||
          'bg-gray-100 text-gray-800'
        )}>
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
  );
}