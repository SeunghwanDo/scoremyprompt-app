import Skeleton from '../components/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* Header skeleton */}
        <Skeleton variant="text" lines={1} className="h-8 w-48 mb-8" />
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-lg p-6">
              <Skeleton variant="text" lines={1} className="h-4 w-20 mb-3" />
              <Skeleton variant="text" lines={1} className="h-8 w-16" />
            </div>
          ))}
        </div>
        {/* Chart skeleton */}
        <div className="bg-surface border border-border rounded-lg p-6 mb-8">
          <Skeleton variant="text" lines={1} className="h-5 w-32 mb-6" />
          <Skeleton variant="rect" height={200} className="rounded-lg" />
        </div>
        {/* List skeleton */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <Skeleton variant="text" lines={1} className="h-5 w-40 mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton variant="circle" width={40} height={40} />
                <div className="flex-1">
                  <Skeleton variant="text" lines={1} className="h-4 w-3/4 mb-2" />
                  <Skeleton variant="text" lines={1} className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
