'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

// ─── Component ──────────────────────────────────────────────────────────────────

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-6">
        {/* ── Search Bar ───────────────────────────────────────────────────── */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search courses, lessons..."
              className={cn(
                'w-full pl-10 pr-4 py-2 rounded-lg text-sm',
                'bg-gray-100 border border-transparent',
                'placeholder:text-gray-400 text-gray-900',
                'focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
                'transition-colors duration-200 outline-none',
              )}
            />
          </div>
        </div>

        {/* ── Right Section ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            className={cn(
              'relative p-2 rounded-lg text-gray-500',
              'hover:bg-gray-100 hover:text-gray-700',
              'transition-colors duration-200',
            )}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {/* Notification badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User avatar dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn(
                'flex items-center gap-2 p-1.5 rounded-lg',
                'hover:bg-gray-100 transition-colors duration-200',
              )}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
                {userInitial}
              </div>
              {user && (
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user.name}
                </span>
              )}
            </button>

            {/* ── Dropdown Menu ───────────────────────────────────────────── */}
            {dropdownOpen && (
              <div
                className={cn(
                  'absolute right-0 mt-2 w-56 rounded-xl bg-white border border-gray-200',
                  'shadow-lg shadow-gray-200/50 py-1',
                  'animate-in fade-in slide-in-from-top-2 duration-200',
                )}
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </div>

                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
