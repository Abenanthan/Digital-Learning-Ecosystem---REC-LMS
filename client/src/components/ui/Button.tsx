import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ─── Variant & Size Maps ────────────────────────────────────────────────────────

const variants = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm shadow-primary-600/25',
  secondary:
    'bg-dark-600 text-white hover:bg-dark-500 active:bg-dark-400',
  outline:
    'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100',
  ghost:
    'text-dark-300 hover:bg-dark-50 hover:text-dark-600 active:bg-dark-100',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm shadow-red-600/25',
} as const;

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-lg gap-2.5',
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ─── Component ──────────────────────────────────────────────────────────────────

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'focus-ring disabled:opacity-50 disabled:pointer-events-none',
          // Variant & size
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <svg
            className="animate-spin -ml-1 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}

        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
