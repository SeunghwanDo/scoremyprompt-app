import Skeleton from '../components/Skeleton';

export default function BulkLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark">
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <Skeleton variant="text" lines={1} className="h-8 w-56 mx-auto mb-4" />
        <Skeleton variant="text" lines={1} className="h-4 w-80 mx-auto mb-12" />

        {/* Prompt input area */}
        <div className="bg-surface border border-border rounded-lg p-6 mb-6">
          <Skeleton variant="text" lines={1} className="h-5 w-24 mb-4" />
          <Skeleton variant="rect" height={200} className="rounded-lg mb-4" />
          <div className="flex justify-between items-center">
            <Skeleton variant="text" lines={1} className="h-3 w-32" />
            <Skeleton variant="rect" width={160} height={44} className="rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
