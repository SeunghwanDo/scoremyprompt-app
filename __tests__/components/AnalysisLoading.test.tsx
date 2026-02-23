/**
 * Component Tests: AnalysisLoading
 */
import { render, screen } from '@testing-library/react';
import AnalysisLoading from '@/app/components/AnalysisLoading';

describe('AnalysisLoading Component', () => {
  it('renders the first step on mount', () => {
    render(<AnalysisLoading />);
    expect(screen.getByText('Reading your prompt...')).toBeInTheDocument();
  });

  it('renders all 4 step labels', () => {
    render(<AnalysisLoading />);
    expect(screen.getByText('Reading your prompt...')).toBeInTheDocument();
    expect(screen.getByText('Analyzing 6 dimensions...')).toBeInTheDocument();
    expect(screen.getByText('Calculating PROMPT Score...')).toBeInTheDocument();
    expect(screen.getByText('Generating feedback...')).toBeInTheDocument();
  });

  it('renders a tip from the TIPS array', () => {
    render(<AnalysisLoading />);
    // One of the tips should be rendered
    const tipContainer = screen.getByText(/Did you know|Pro tip|Fun fact|Tip:/);
    expect(tipContainer).toBeInTheDocument();
  });

  it('renders skeleton circle and bars', () => {
    const { container } = render(<AnalysisLoading />);
    // Should have a skeleton circle
    const circle = container.querySelector('.h-20.w-20.rounded-full');
    expect(circle).toBeInTheDocument();
    // Should have skeleton bars
    const bars = container.querySelectorAll('.h-3.bg-slate-700');
    expect(bars.length).toBe(6);
  });
});
