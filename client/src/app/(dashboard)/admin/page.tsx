import { ShieldCheck, Users, BookOpen, BarChart3 } from 'lucide-react';

const adminStats = [
  { label: 'Users', value: '0', icon: Users },
  { label: 'Courses', value: '0', icon: BookOpen },
  { label: 'Reports', value: '0', icon: BarChart3 },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 inline-flex rounded-lg bg-primary-600/10 p-2 text-primary-400">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-gray-400">Manage users, courses, and platform activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {adminStats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-white/5 bg-dark-800/50 p-5">
            <stat.icon className="mb-4 h-5 w-5 text-primary-400" />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
