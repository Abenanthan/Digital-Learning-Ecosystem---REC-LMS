'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-dark-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:ml-64">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
