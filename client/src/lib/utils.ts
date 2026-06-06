import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ─── Class Name Utility ────────────────────────────────────────────────────────
// Combines clsx (conditional class joining) with tailwind-merge (deduplication
// of conflicting Tailwind classes). Use this everywhere instead of raw clsx.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Price Formatter ────────────────────────────────────────────────────────────
// Formats a numeric price into Indian Rupee (INR) currency string.
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

// ─── Date Formatter ─────────────────────────────────────────────────────────────
// Formats an ISO date string into a human-readable medium-length date.
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

// ─── Truncate Text ──────────────────────────────────────────────────────────────
// Truncates a string to the given max length, appending '…' if truncated.
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

// ─── Slug Generator ─────────────────────────────────────────────────────────────
// Converts a title string to a URL-safe slug.
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
