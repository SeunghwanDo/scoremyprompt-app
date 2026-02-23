'use client';

import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

// ─── Shared Types ───
interface BaseFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
}

// ─── Input ───
interface InputProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = '', ...props }, ref) => {
    const fieldId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = error && fieldId ? `${fieldId}-error` : undefined;
    const helperId = helperText && fieldId ? `${fieldId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

    return (
      <div>
        {label && (
          <label htmlFor={fieldId} className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={fieldId}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          className={`input-field ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-red-400 mt-1" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-gray-400 mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ─── Select ───
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends BaseFieldProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  options: SelectOption[];
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, id, className = '', ...props }, ref) => {
    const fieldId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = error && fieldId ? `${fieldId}-error` : undefined;
    const describedBy = errorId || undefined;

    return (
      <div>
        {label && (
          <label htmlFor={fieldId} className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={fieldId}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          className={`input-field ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} className="text-sm text-red-400 mt-1" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-400 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

// ─── Textarea ───
interface TextareaProps extends BaseFieldProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  showCharCount?: boolean;
  className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, showCharCount = false, maxLength, id, className = '', value, ...props }, ref) => {
    const fieldId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = error && fieldId ? `${fieldId}-error` : undefined;
    const describedBy = errorId || undefined;
    const charCount = typeof value === 'string' ? value.length : 0;
    const isNearLimit = maxLength ? charCount > maxLength * 0.9 : false;

    return (
      <div>
        {label && (
          <label htmlFor={fieldId} className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={fieldId}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          maxLength={maxLength}
          value={value}
          className={`input-field resize-none ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
          {...props}
        />
        <div className="flex justify-between mt-1">
          <div>
            {error && (
              <p id={errorId} className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p className="text-sm text-gray-400">{helperText}</p>
            )}
          </div>
          {showCharCount && maxLength && (
            <p className={`text-xs ${isNearLimit ? 'text-amber-400' : 'text-gray-400'}`}>
              {charCount} / {maxLength.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
