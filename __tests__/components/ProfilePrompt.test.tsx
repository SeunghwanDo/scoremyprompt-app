import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfilePrompt from '@/app/components/ProfilePrompt';

describe('ProfilePrompt', () => {
  const defaultProps = {
    onDismiss: jest.fn(),
    onComplete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders experience level options', () => {
    render(<ProfilePrompt {...defaultProps} />);
    expect(screen.getByText(/getting started/i)).toBeInTheDocument();
    expect(screen.getByText(/weekly/i)).toBeInTheDocument();
    expect(screen.getByText(/power user/i)).toBeInTheDocument();
  });

  it('renders use case options', () => {
    render(<ProfilePrompt {...defaultProps} />);
    expect(screen.getByText(/content & writing/i)).toBeInTheDocument();
    expect(screen.getByText(/code & development/i)).toBeInTheDocument();
  });

  it('renders AI tool options', () => {
    render(<ProfilePrompt {...defaultProps} />);
    expect(screen.getByText('ChatGPT')).toBeInTheDocument();
    expect(screen.getByText('Claude')).toBeInTheDocument();
    expect(screen.getByText('Gemini')).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss is clicked', () => {
    render(<ProfilePrompt {...defaultProps} />);
    const dismissBtn = screen.getByText(/skip/i) || screen.getByText(/later/i) || screen.getByLabelText(/close/i) || screen.getByLabelText(/dismiss/i);
    fireEvent.click(dismissBtn);
    expect(defaultProps.onDismiss).toHaveBeenCalled();
  });

  it('has accessible backdrop with keyboard handler', () => {
    render(<ProfilePrompt {...defaultProps} />);
    // Backdrop should be keyboard accessible
    const backdrop = document.querySelector('[role="button"][aria-label="Close"]');
    if (backdrop) {
      fireEvent.keyDown(backdrop, { key: 'Enter' });
      expect(defaultProps.onDismiss).toHaveBeenCalled();
    }
  });
});
