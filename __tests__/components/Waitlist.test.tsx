import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Waitlist from '@/app/components/Waitlist';

// Mock analytics
jest.mock('@/app/lib/analytics', () => ({
  trackWaitlistSignup: jest.fn(),
  trackNewsletterSignup: jest.fn(),
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Waitlist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders heading and subscribe form', () => {
    render(<Waitlist />);
    expect(screen.getByText('Get smarter with AI every week')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByText('Subscribe')).toBeInTheDocument();
  });

  it('shows error for empty email', async () => {
    render(<Waitlist />);
    fireEvent.click(screen.getByText('Subscribe'));
    expect(screen.getByText('Please enter your email address')).toBeInTheDocument();
  });

  it('shows error for invalid email', async () => {
    render(<Waitlist />);
    const input = screen.getByPlaceholderText('your@email.com');
    fireEvent.change(input, { target: { value: 'notanemail' } });
    fireEvent.click(screen.getByText('Subscribe'));
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('submits valid email and shows success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<Waitlist />);
    const input = screen.getByPlaceholderText('your@email.com');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Subscribe'));

    await waitFor(() => {
      expect(screen.getByText("You're in! 🎉")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/waitlist', expect.objectContaining({
      method: 'POST',
    }));
  });

  it('shows error on API failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Server error' }),
    });

    render(<Waitlist />);
    fireEvent.change(screen.getByPlaceholderText('your@email.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Subscribe'));

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  it('clears error when typing', () => {
    render(<Waitlist />);
    fireEvent.click(screen.getByText('Subscribe'));
    expect(screen.getByText('Please enter your email address')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('your@email.com'), {
      target: { value: 'a' },
    });
    expect(screen.queryByText('Please enter your email address')).not.toBeInTheDocument();
  });

  it('disables input and button while loading', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Waitlist />);
    fireEvent.change(screen.getByPlaceholderText('your@email.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Subscribe'));

    await waitFor(() => {
      expect(screen.getByText('Subscribing...')).toBeInTheDocument();
    });
  });

  it('renders trust indicators', () => {
    render(<Waitlist />);
    expect(screen.getByText('5K+')).toBeInTheDocument();
    expect(screen.getByText('subscribers')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('spam-free')).toBeInTheDocument();
  });

  it('renders privacy note', () => {
    render(<Waitlist />);
    expect(screen.getByText('No spam. Unsubscribe anytime.')).toBeInTheDocument();
  });
});
