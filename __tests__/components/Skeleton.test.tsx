import React from 'react';
import { render } from '@testing-library/react';
import Skeleton from '@/app/components/Skeleton';

describe('Skeleton', () => {
  it('renders rect variant by default', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('animate-pulse');
    expect(el.className).toContain('rounded');
  });

  it('applies width and height as pixels when numbers', () => {
    const { container } = render(<Skeleton width={200} height={40} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('40px');
  });

  it('applies width and height as strings', () => {
    const { container } = render(<Skeleton width="50%" height="2rem" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('50%');
    expect(el.style.height).toBe('2rem');
  });

  it('renders text variant with correct number of lines', () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    const lines = container.querySelectorAll('.h-4');
    expect(lines).toHaveLength(3);
  });

  it('last line of multi-line text is 75% width', () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    const lines = container.querySelectorAll('.h-4');
    const lastLine = lines[2] as HTMLElement;
    expect(lastLine.style.width).toBe('75%');
  });

  it('renders circle variant with round shape', () => {
    const { container } = render(<Skeleton variant="circle" width={64} />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('rounded-full');
    expect(el.style.width).toBe('64px');
    expect(el.style.height).toBe('64px');
  });

  it('circle defaults to 48px when no size provided', () => {
    const { container } = render(<Skeleton variant="circle" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('48px');
  });

  it('renders card variant with nested skeletons', () => {
    const { container } = render(<Skeleton variant="card" />);
    expect(container.querySelector('.bg-surface')).toBeInTheDocument();
    // Should contain nested text skeletons
    const lines = container.querySelectorAll('.h-4');
    expect(lines.length).toBeGreaterThan(0);
  });

  it('disables animation when animate=false', () => {
    const { container } = render(<Skeleton animate={false} />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).not.toContain('animate-pulse');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="my-custom" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('my-custom');
  });
});
