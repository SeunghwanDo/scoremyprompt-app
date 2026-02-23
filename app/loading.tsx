import Skeleton from './components/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark">
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        {/* Hero skeleton */}
        <div className="text-center mb-12">
          <Skeleton variant="text" lines={1} className="h-10 w-2/3 mx-auto mb-4" />
          <Skeleton variant="text" lines={1} className="h-5 w-1/2 mx-auto" />
        </div>
        {/* Form skeleton */}
        <div className="max-w-2xl mx-auto">
          <Skeleton variant="rect" height={48} className="rounded-lg mb-4" />
          <Skeleton variant="rect" height={160} className="rounded-lg mb-4" />
          <Skeleton variant="rect" height={52} className="rounded-xl" />
        </div>
      </div>
    </div>
  );
}
