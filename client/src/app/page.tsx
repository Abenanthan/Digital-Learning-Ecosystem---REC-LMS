import Link from 'next/link';
import { BookOpen, Users, BarChart3, ArrowRight, GraduationCap, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Expert Instructors',
    description:
      'Learn from industry professionals and experienced educators who bring real-world expertise to every course.',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: BookOpen,
    title: 'Interactive Learning',
    description:
      'Engage with rich multimedia content, hands-on exercises, and collaborative projects that bring concepts to life.',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    description:
      'Monitor your learning journey with detailed analytics, completion tracking, and personalized recommendations.',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-dark-900">
      {/* ---- Navigation ---- */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-dark-900/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary-500" />
            <span className="text-lg font-bold text-white">REC LMS</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500 hover:shadow-primary-500/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ---- Hero Section ---- */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-16">
        {/* Ambient glow effects */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-[400px] w-[600px] rounded-full bg-purple-600/10 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-sm text-primary-400">
            <Sparkles className="h-4 w-4" />
            <span>Empowering education at REC</span>
          </div>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Digital Learning{' '}
            <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ecosystem
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
            A comprehensive platform designed for students, educators, and institutions.
            Discover courses, track progress, and unlock your full potential.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary-600/25 transition-all hover:bg-primary-500 hover:shadow-2xl hover:shadow-primary-500/30"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/courses"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:border-white/20 hover:bg-white/10"
            >
              Browse Courses
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/5 pt-8">
            {[
              { value: '500+', label: 'Active Students' },
              { value: '50+', label: 'Expert Courses' },
              { value: '95%', label: 'Success Rate' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Features Section ---- */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                succeed
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              Our platform provides the tools and resources for an exceptional learning experience.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-dark-800/50 p-8 backdrop-blur transition-all duration-300 hover:border-white/10 hover:bg-dark-800"
              >
                {/* Glow on hover */}
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`}
                />

                <div
                  className={`mb-5 inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 shadow-lg`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="leading-relaxed text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA Section ---- */}
      <section className="px-6 py-24">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-primary-900/50 to-dark-800 p-12 text-center sm:p-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary-600/20 blur-[80px]" />
          <h2 className="relative mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ready to start learning?
          </h2>
          <p className="relative mb-8 text-lg text-gray-400">
            Join hundreds of students already transforming their careers on our platform.
          </p>
          <Link
            href="/register"
            className="relative inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary-600/25 transition-all hover:bg-primary-500"
          >
            Create Free Account
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <GraduationCap className="h-5 w-5" />
            <span className="text-sm">© 2024 REC Digital Learning Ecosystem</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="transition-colors hover:text-gray-300">Privacy</Link>
            <Link href="#" className="transition-colors hover:text-gray-300">Terms</Link>
            <Link href="#" className="transition-colors hover:text-gray-300">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
