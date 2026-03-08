import React from 'react';
import { render, screen } from '@testing-library/react';
import PercentileBar from '@/app/components/PercentileBar';

describe('PercentileBar', () => {
  const defaultProps = {
    score: 85,
    average: 55,
    excellent: 80,
    percentile: 90,
  };

  it('renders percentile ranking text', () => {
    render(<PercentileBar {...defaultProps} />);
    expect(screen.getByText('Percentile Ranking')).toBeInTheDocument();
    expect(screen.getByText('Top 90%')).toBeInTheDocument();
  });

  it('renders progressbar with correct aria attributes', () => {
    render(<PercentileBar {...defaultProps} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '90');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders average and excellent markers with labels', () => {
    render(<PercentileBar {...defaultProps} />);
    expect(screen.getByText('Avg (55)')).toBeInTheDocument();
    expect(screen.getByText('Excellent (80)')).toBeInTheDocument();
  });

  it('clamps score between 0 and 100', () => {
    const { container } = render(
      <PercentileBar score={150} average={55} excellent={80} percentile={99} />
    );
    // Score fill should be capped at 100%
    const fill = container.querySelector('.bg-gradient-to-r') as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });

  it('handles zero score', () => {
    const { container } = render(
      <PercentileBar score={0} average={55} excellent={80} percentile={1} />
    );
    expect(screen.getByText('Top 1%')).toBeInTheDocument();
    const fill = container.querySelector('.bg-gradient-to-r') as HTMLElement;
    expect(fill.style.width).toBe('0%');
  });

  it('has accessible label', () => {
    render(<PercentileBar {...defaultProps} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-label', 'Top 10% among professionals');
  });
});
