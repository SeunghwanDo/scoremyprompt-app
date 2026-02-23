interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
  animate?: boolean;
}

export default function Skeleton({
  variant = 'rect',
  width,
  height,
  className = '',
  lines = 1,
  animate = true,
}: SkeletonProps) {
  const baseClass = `bg-slate-700/50 rounded ${animate ? 'animate-pulse' : ''} ${className}`;

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'text') {
    return (
      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClass} h-4`}
            style={{
              ...style,
              width: i === lines - 1 && lines > 1 ? '75%' : style.width || '100%',
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circle') {
    const size = width || height || 48;
    return (
      <div
        className={`${baseClass} rounded-full`}
        style={{
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
        }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-surface border border-border rounded-lg p-6 ${className}`}>
        <Skeleton variant="text" lines={1} className="mb-3 h-5 w-1/3" animate={animate} />
        <Skeleton variant="text" lines={3} animate={animate} />
      </div>
    );
  }

  // rect (default)
  return <div className={baseClass} style={style} />;
}
