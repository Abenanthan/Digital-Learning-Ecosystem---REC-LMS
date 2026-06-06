import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'REC Digital Learning Ecosystem',
    template: '%s | REC LMS',
  },
  description:
    'A comprehensive digital learning management system for REC — empowering students and educators with interactive courses, progress tracking, and collaborative learning.',
  keywords: ['LMS', 'learning', 'education', 'courses', 'REC', 'digital learning'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased dark:bg-dark-900 dark:text-gray-100">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1A1B1E',
              color: '#fff',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#4c6ef5', secondary: '#fff' } },
            error: { iconTheme: { primary: '#fa5252', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
