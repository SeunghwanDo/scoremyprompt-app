import React from 'react';
import { render, screen } from '@testing-library/react';
import { Input, Select, Textarea } from '@/app/components/FormElements';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('generates id from label', () => {
    render(<Input label="First Name" />);
    const input = screen.getByLabelText('First Name');
    expect(input.id).toBe('first-name');
  });

  it('shows error message with role="alert"', () => {
    render(<Input label="Email" error="Required field" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required field');
  });

  it('sets aria-invalid when error is present', () => {
    render(<Input label="Email" error="Invalid" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows helper text when no error', () => {
    render(<Input label="Name" helperText="Enter your full name" />);
    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(<Input label="Name" helperText="Helper" error="Error" />);
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('applies disabled styling', () => {
    render(<Input label="Disabled" disabled />);
    expect(screen.getByLabelText('Disabled')).toBeDisabled();
  });
});

describe('Select', () => {
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
  ];

  it('renders label and options', () => {
    render(<Select label="Choice" options={options} />);
    expect(screen.getByLabelText('Choice')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('shows error with role="alert"', () => {
    render(<Select label="Choice" options={options} error="Pick one" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Pick one');
  });

  it('sets aria-invalid on error', () => {
    render(<Select label="Choice" options={options} error="Error" />);
    expect(screen.getByLabelText('Choice')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows helper text', () => {
    render(<Select label="Pick" options={options} helperText="Choose one" />);
    expect(screen.getByText('Choose one')).toBeInTheDocument();
  });
});

describe('Textarea', () => {
  it('renders with label', () => {
    render(<Textarea label="Message" />);
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('shows char count when showCharCount and maxLength set', () => {
    render(<Textarea label="Bio" showCharCount maxLength={100} value="Hello" />);
    expect(screen.getByText('5 / 100')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Textarea label="Notes" error="Too short" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Too short');
  });

  it('applies near-limit styling when approaching maxLength', () => {
    const longText = 'a'.repeat(95);
    const { container } = render(
      <Textarea label="Bio" showCharCount maxLength={100} value={longText} />
    );
    // 95/100 = 95% > 90% threshold => amber color
    expect(container.querySelector('.text-amber-400')).toBeInTheDocument();
  });

  it('does not show char count without showCharCount', () => {
    render(<Textarea label="Bio" maxLength={100} value="Hello" />);
    expect(screen.queryByText(/\/ 100/)).not.toBeInTheDocument();
  });
});
