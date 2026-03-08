/**
 * Component Tests: Footer
 */
import { render, screen } from '@testing-library/react';
import Footer from '@/app/components/Footer';

describe('Footer Component', () => {
  it('renders copyright text with current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    expect(screen.getByText(/ScoreMyPrompt/)).toBeInTheDocument();
  });

  it('renders privacy and terms links', () => {
    render(<Footer />);
    const privacyLink = screen.getByRole('link', { name: /privacy/i });
    const termsLink = screen.getByRole('link', { name: /terms/i });
    expect(privacyLink).toHaveAttribute('href', '/privacy');
    expect(termsLink).toHaveAttribute('href', '/terms');
  });

  it('renders social media links with correct aria-labels', () => {
    render(<Footer />);
    expect(screen.getByLabelText('Follow us on X')).toHaveAttribute('href', 'https://x.com/scoremyprompt');
    expect(screen.getByLabelText('Follow us on LinkedIn')).toHaveAttribute('href', 'https://linkedin.com/company/scoremyprompt');
    expect(screen.getByLabelText('Subscribe on YouTube')).toHaveAttribute('href', 'https://youtube.com/@scoremyprompt');
    expect(screen.getByLabelText('Follow us on Bluesky')).toHaveAttribute('href', 'https://bsky.app/profile/scoremyprompt.com');
  });

  it('opens social links in new tab', () => {
    render(<Footer />);
    const externalLinks = screen.getAllByRole('link').filter(
      (link) => link.getAttribute('target') === '_blank'
    );
    expect(externalLinks.length).toBe(4);
    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders responsive layout classes', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('border-t', 'border-border');
  });
});
