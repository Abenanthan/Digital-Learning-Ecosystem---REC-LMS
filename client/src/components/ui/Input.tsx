import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ─── Variant Styles ─────────────────────────────────────────────────────────────

const inputVariants = {
  default:
    'border border-gray-300 bg-white focus:border-primary-500',
  filled:
    'border border-transparent bg-gray-100 focus:bg-white focus:border-primary-500',
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: keyof typeof inputVariants;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      wrapperClassName,
      label,
      error,
      helperText,
      variant = 'default',
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || props.name;

    return (
      <div className={cn('w-full', wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}

        {/* Input wrapper with optional icons */}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base
              'w-full rounded-lg px-4 py-2.5 text-sm text-gray-900',
              'placeholder:text-gray-400',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              // Variant
              inputVariants[variant],
              // Error state
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              // Icons padding
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              // Disabled
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {!error && helperText && (
          <p className="mt-1.5 text-sm text-gray-400">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
