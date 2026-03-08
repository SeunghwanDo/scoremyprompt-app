import Skeleton from '../components/Skeleton';

export default function HistoryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark">
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <Skeleton variant="text" lines={1} className="h-8 w-48 mb-2" />
        <Skeleton variant="text" lines={1} className="h-4 w-64 mb-8" />

        {/* Sort / Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Skeleton variant="rect" width={140} height={40} className="rounded-lg" />
          <Skeleton variant="rect" width={140} height={40} className="rounded-lg" />
        </div>

        {/* History items */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-lg p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <Skeleton variant="circle" width={48} height={48} className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton variant="text" lines={1} className="h-4 w-32" />
                    <Skeleton variant="text" lines={1} className="h-3 w-20" />
                  </div>
                  <Skeleton variant="text" lines={2} className="mb-3" />
                  <div className="flex gap-2">
                    {[...Array(6)].map((_, j) => (
                      <Skeleton key={j} variant="rect" width={40} height={6} className="rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
