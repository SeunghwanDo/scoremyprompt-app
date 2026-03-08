import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

const mockSetLocale = jest.fn();

jest.mock('@/app/i18n/provider', () => ({
  useLocale: () => ({ locale: 'en', setLocale: mockSetLocale }),
}));

jest.mock('@/app/i18n/config', () => ({
  SUPPORTED_LOCALES: ['en', 'ko'],
  LOCALE_NAMES: { en: 'English', ko: '한국어' },
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all supported locales', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('한국어')).toBeInTheDocument();
  });

  it('highlights current locale', () => {
    render(<LanguageSwitcher />);
    const enButton = screen.getByText('English');
    expect(enButton).toHaveClass('text-white');
    expect(enButton).toHaveAttribute('aria-current', 'true');
  });

  it('shows non-active locale as dimmed', () => {
    render(<LanguageSwitcher />);
    const koButton = screen.getByText('한국어');
    expect(koButton).toHaveClass('text-gray-500');
    expect(koButton).not.toHaveAttribute('aria-current');
  });

  it('calls setLocale when clicking a language', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByText('한국어'));
    expect(mockSetLocale).toHaveBeenCalledWith('ko');
  });

  it('has proper aria-labels', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByLabelText('Switch to English')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to 한국어')).toBeInTheDocument();
  });

  it('shows separator between locales', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('/')).toBeInTheDocument();
  });
});
