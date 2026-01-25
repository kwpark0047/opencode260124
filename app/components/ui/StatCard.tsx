import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: number;
  color?: 'blue' | 'green' | 'yellow' | 'purple';
  icon?: string;
}

export function StatCard({ title, value, color = 'blue', icon }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className={clsx('rounded-lg p-6', colorClasses[color])}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="mt-2 text-3xl font-bold">{value.toLocaleString()}</p>
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    </div>
  );
}