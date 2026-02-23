import Skeleton from '../components/Skeleton';

export default function ResultLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark">
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          {/* Score circle skeleton */}
          <Skeleton variant="circle" width={220} height={220} className="mx-auto mb-6" />
          <Skeleton variant="text" lines={1} className="h-6 w-48 mx-auto mb-2" />
          <Skeleton variant="text" lines={1} className="h-4 w-32 mx-auto" />
        </div>
        {/* Dimension bars skeleton */}
        <div className="bg-surface border border-border rounded-lg p-6 mb-8">
          <Skeleton variant="text" lines={1} className="h-5 w-40 mb-6" />
          <div className="space-y-5">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <Skeleton variant="text" lines={1} className="h-4 w-24" />
                  <Skeleton variant="text" lines={1} className="h-4 w-12" />
                </div>
                <Skeleton variant="rect" height={8} className="rounded-full" />
              </div>
            ))}
          </div>
        </div>
        {/* Feedback skeleton */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <Skeleton variant="text" lines={1} className="h-5 w-36 mb-4" />
          <Skeleton variant="text" lines={4} />
        </div>
      </div>
    </div>
  );
}
