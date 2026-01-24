import Navbar from '@/components/Navbar';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            어드민 대시보드
          </h1>
          <p className="text-gray-600">
            시스템 관리 및 데이터 동기화
          </p>
        </div>

        <AdminDashboard />
      </main>
    </div>
  );
}

async function AdminDashboard() {
  const statsRes = await fetch(
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/dashboard/stats`,
    { cache: 'no-store' }
  );
  const stats = await statsRes.json();

  const syncStateRes = await fetch(
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/sync/status`,
    { cache: 'no-store' }
  );
  const syncStateData = await syncStateRes.json();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <StatsCard title="전체 소상공인" value={stats.total} icon="🏪" />
      <StatsCard title="신규 등록" value={stats.newRecords} icon="🆕" />
      <StatsCard title="영업 중" value={stats.active} icon="✅" />
      <StatsCard title="오늘 신규" value={stats.newToday} icon="📅" />

      <SyncStatusCard syncState={syncStateData} />
      <SchedulerStatusCard schedulerStatus={syncStateData} />

      <ManualSyncCard />
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value.toLocaleString()}
          </p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

function SyncStatusCard({ syncState }: { syncState: { syncStatus: any; lastSyncedAt: any; errorMessage: any; } }) {
  const statusColors = {
    idle: 'bg-gray-100 text-gray-800',
    running: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        동기화 상태
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">상태</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            statusColors[syncState.syncStatus as keyof typeof statusColors] ||
            'bg-gray-100 text-gray-800'
          }`}>
            {syncState.syncStatus}
          </span>
        </div>
        {syncState.lastSyncedAt && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">마지막 동기화</span>
            <span className="text-sm font-medium text-gray-900">
              {new Date(syncState.lastSyncedAt).toLocaleString('ko-KR')}
            </span>
          </div>
        )}
        {syncState.errorMessage && (
          <div className="text-sm text-red-600">
            에러: {syncState.errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}

function SchedulerStatusCard({ schedulerStatus }: { schedulerStatus: { running: boolean; } }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        스케줄러 상태
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">실행 중</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            schedulerStatus.running
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {schedulerStatus.running ? '실행 중' : '중지'}
          </span>
        </div>
      </div>
    </div>
  );
}

function ManualSyncCard() {
  async function handleManualSync() {
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success) {
        alert('동기화가 시작되었습니다.');
        window.location.reload();
      } else {
        alert(`동기화 실패: ${data.message}`);
      }
    } catch (error) {
      alert(`동기화 실패: ${error}`);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        수동 동기화
      </h3>
      <p className="mb-4 text-sm text-gray-600">
        버튼을 클릭하여 공공데이터포털에서 데이터를 동기화합니다.
      </p>
      <button
        onClick={handleManualSync}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        동기화 시작
      </button>
    </div>
  );
}
