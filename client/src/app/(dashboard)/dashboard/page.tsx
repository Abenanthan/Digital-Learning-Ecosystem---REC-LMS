'use client';

import { BookOpen, CheckCircle, Clock, Award } from 'lucide-react';

const stats = [
  {
    label: 'Enrolled Courses',
    value: '0',
    icon: BookOpen,
    gradient: 'from-blue-500 to-indigo-600',
    bgGlow: 'bg-blue-500/10',
  },
  {
    label: 'Completed',
    value: '0',
    icon: CheckCircle,
    gradient: 'from-emerald-500 to-teal-600',
    bgGlow: 'bg-emerald-500/10',
  },
  {
    label: 'In Progress',
    value: '0',
    icon: Clock,
    gradient: 'from-amber-500 to-orange-600',
    bgGlow: 'bg-amber-500/10',
  },
  {
    label: 'Certificates',
    value: '0',
    icon: Award,
    gradient: 'from-purple-500 to-pink-600',
    bgGlow: 'bg-purple-500/10',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Welcome back! 👋
        </h1>
        <p className="mt-1 text-gray-400">
          Here&apos;s an overview of your learning progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-dark-800/50 p-6 backdrop-blur transition-all duration-300 hover:border-white/10 hover:bg-dark-800"
          >
            {/* Glow */}
            <div
              className={`pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full ${stat.bgGlow} blur-2xl transition-opacity group-hover:opacity-100 opacity-50`}
            />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <div
                className={`rounded-xl bg-gradient-to-br ${stat.gradient} p-3 shadow-lg`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Courses */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Continue Learning</h2>
        <div className="rounded-2xl border border-white/5 bg-dark-800/30 p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-300">No courses yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start exploring courses to begin your learning journey.
          </p>
          <a
            href="/courses"
            className="mt-4 inline-flex rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500"
          >
            Browse Courses
          </a>
        </div>
      </div>
    </div>
  );
}
