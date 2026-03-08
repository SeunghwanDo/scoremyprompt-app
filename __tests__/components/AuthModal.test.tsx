import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthModal from '@/app/components/AuthModal';

// Mock auth functions
const mockSignInWithMagicLink = jest.fn();
const mockSignInWithGoogle = jest.fn();
jest.mock('@/app/lib/auth', () => ({
  signInWithMagicLink: (...args: unknown[]) => mockSignInWithMagicLink(...args),
  signInWithGoogle: (...args: unknown[]) => mockSignInWithGoogle(...args),
}));

// Mock AuthProvider
jest.mock('@/app/components/AuthProvider', () => ({
  useAuth: () => ({ supabase: {} }),
}));

// Mock Modal to just render children
jest.mock('@/app/components/Modal', () => {
  return function MockModal({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
    return isOpen ? <div data-testid="modal">{children}</div> : null;
  };
});

describe('AuthModal', () => {
  const defaultProps = { isOpen: true, onClose: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when open', () => {
    render(<AuthModal {...defaultProps} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<AuthModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('shows custom message when provided', () => {
    render(<AuthModal {...defaultProps} message="Sign in to save results" />);
    expect(screen.getByText('Sign in to save results')).toBeInTheDocument();
  });

  it('validates empty email', async () => {
    render(<AuthModal {...defaultProps} />);
    const form = screen.getByRole('form') || screen.getByTestId('modal').querySelector('form');
    if (form) fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText(/enter your email/i)).toBeInTheDocument();
    });
  });

  it('validates invalid email format', async () => {
    render(<AuthModal {...defaultProps} />);
    const input = screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i);
    fireEvent.change(input, { target: { value: 'not-an-email' } });
    const form = input.closest('form');
    if (form) fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('calls signInWithMagicLink on valid email submit', async () => {
    mockSignInWithMagicLink.mockResolvedValueOnce({ error: null });
    render(<AuthModal {...defaultProps} />);
    const input = screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    const form = input.closest('form');
    if (form) fireEvent.submit(form);
    await waitFor(() => {
      expect(mockSignInWithMagicLink).toHaveBeenCalledWith(expect.anything(), 'test@example.com');
    });
  });

  it('shows success message after magic link sent', async () => {
    mockSignInWithMagicLink.mockResolvedValueOnce({ error: null });
    render(<AuthModal {...defaultProps} />);
    const input = screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    const form = input.closest('form');
    if (form) fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText(/check your email/i)).toBeInTheDocument();
    });
  });

  it('shows error from signInWithMagicLink', async () => {
    mockSignInWithMagicLink.mockResolvedValueOnce({ error: 'Rate limit exceeded' });
    render(<AuthModal {...defaultProps} />);
    const input = screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    const form = input.closest('form');
    if (form) fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText('Rate limit exceeded')).toBeInTheDocument();
    });
  });

  it('has accessible email input with label', () => {
    render(<AuthModal {...defaultProps} />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
  });
});
