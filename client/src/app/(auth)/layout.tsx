import { GraduationCap } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-900 px-4 py-12">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary-600/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Branding */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex rounded-2xl bg-primary-600/10 p-3">
            <GraduationCap className="h-10 w-10 text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">REC Digital Learning</h1>
          <p className="mt-1 text-sm text-gray-500">Ecosystem</p>
        </div>

        {/* Auth form card */}
        <div className="rounded-2xl border border-white/5 bg-dark-800/60 p-8 shadow-2xl backdrop-blur-xl">
          {children}
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          © 2024 REC Digital Learning Ecosystem. All rights reserved.
        </p>
      </div>
    </div>
  );
}
