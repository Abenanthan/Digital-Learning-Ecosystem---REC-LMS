'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Navigation Links ──────────────────────────────────────────────────────────

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/progress', label: 'Progress', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

// ─── Component ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200',
          'flex flex-col transition-all duration-300 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-64',
        )}
      >
        {/* ── Brand ───────────────────────────────────────────────────────── */}
        <div className="flex items-center h-16 px-4 border-b border-gray-100 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-600 text-white shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
                REC LMS
              </span>
            )}
          </Link>
        </div>

        {/* ── Navigation ──────────────────────────────────────────────────── */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                  'transition-colors duration-200',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  collapsed && 'justify-center',
                )}
                title={collapsed ? link.label : undefined}
              >
                <Icon className={cn('w-5 h-5 shrink-0', isActive && 'text-primary-600')} />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* ── Collapse Toggle ─────────────────────────────────────────────── */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex items-center justify-center w-full py-2 rounded-lg',
              'text-gray-400 hover:text-gray-600 hover:bg-gray-50',
              'transition-colors duration-200',
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
