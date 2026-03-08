/**
 * Component Tests: EmptyState
 */
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from '@/app/components/EmptyState';

describe('EmptyState Component', () => {
  it('renders title', () => {
    render(<EmptyState title="No results" />);
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="Empty" description="Nothing to show here" />);
    expect(screen.getByText('Nothing to show here')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="Empty" />);
    const desc = container.querySelector('p.text-gray-400');
    expect(desc).not.toBeInTheDocument();
  });

  it('renders action button with onClick', () => {
    const handleClick = jest.fn();
    render(
      <EmptyState
        title="No data"
        action={{ label: 'Get Started', onClick: handleClick }}
      />
    );
    const button = screen.getByRole('button', { name: /Get Started/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders action link with href', () => {
    render(
      <EmptyState
        title="No data"
        action={{ label: 'Score a Prompt', href: '/' }}
      />
    );
    const link = screen.getByRole('link', { name: /Score a Prompt/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders social proof text', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.getByText(/5,000\+/)).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    render(
      <EmptyState
        title="Custom"
        icon={<span data-testid="custom-icon">🎯</span>}
      />
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders default icon when no icon provided', () => {
    const { container } = render(<EmptyState title="Default" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<EmptyState title="Test" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
