import Skeleton from '../components/Skeleton';

export default function CompareLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <Skeleton variant="text" lines={1} className="h-8 w-64 mx-auto mb-4" />
        <Skeleton variant="text" lines={1} className="h-4 w-96 mx-auto mb-12" />

        {/* Two prompt input areas side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[0, 1].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-lg p-6">
              <Skeleton variant="text" lines={1} className="h-5 w-24 mb-4" />
              <Skeleton variant="rect" height={120} className="rounded-lg mb-4" />
              <Skeleton variant="text" lines={1} className="h-4 w-20 mb-2" />
              <Skeleton variant="rect" height={40} className="rounded-lg" />
            </div>
          ))}
        </div>

        {/* Compare button skeleton */}
        <div className="flex justify-center mb-12">
          <Skeleton variant="rect" width={200} height={48} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
}
