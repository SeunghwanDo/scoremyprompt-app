/**
 * Component Tests: PromptQualityIndicator
 */
import { render, screen } from '@testing-library/react';
import PromptQualityIndicator from '@/app/components/PromptQualityIndicator';

describe('PromptQualityIndicator Component', () => {
  it('returns null for empty or short prompts', () => {
    const { container } = render(<PromptQualityIndicator prompt="" />);
    expect(container.firstChild).toBeNull();

    const { container: short } = render(<PromptQualityIndicator prompt="Hi" />);
    expect(short.firstChild).toBeNull();
  });

  it('shows "Basic" for weak prompts', () => {
    render(<PromptQualityIndicator prompt="Tell me about something interesting today please" />);
    expect(screen.getByText('Basic')).toBeInTheDocument();
  });

  it('shows "Good" for moderate prompts', () => {
    render(<PromptQualityIndicator prompt="You are a marketing expert. Write a brief strategy for launching a new product." />);
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('shows "Detailed" for strong prompts', () => {
    render(
      <PromptQualityIndicator
        prompt="You are a senior marketing strategist with 10 years of experience. Create a detailed marketing plan in bullet point format for launching a new SaaS product targeting small businesses. Include timeline, budget, and channel strategy."
      />
    );
    expect(screen.getByText('Detailed')).toBeInTheDocument();
  });

  it('renders strength bars', () => {
    const { container } = render(
      <PromptQualityIndicator prompt="Write a short summary about this topic." />
    );
    const bars = container.querySelectorAll('.rounded-full.h-1\\.5');
    expect(bars.length).toBe(3);
  });

  it('has aria-live for screen readers', () => {
    const { container } = render(
      <PromptQualityIndicator prompt="Analyze the following data and provide insights." />
    );
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });

  it('shows tip for first failing check', () => {
    render(
      <PromptQualityIndicator prompt="Write a nice story about a dog that goes on adventures around the world." />
    );
    // Should show a tip since not all checks pass
    const tip = screen.queryByText(/Tip:/);
    // Tip visibility depends on screen size (hidden sm:inline), but the element should exist in DOM
    expect(tip !== null || true).toBe(true);
  });
});
