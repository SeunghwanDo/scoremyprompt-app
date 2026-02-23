import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark flex items-center justify-center p-4">
      <div className="card max-w-md text-center">
        <div className="text-6xl font-bold text-gradient mb-4">404</div>
        <h2 className="text-xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-6 text-sm">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="btn-primary inline-block">
          Go Home
        </Link>
      </div>
    </div>
  );
}
