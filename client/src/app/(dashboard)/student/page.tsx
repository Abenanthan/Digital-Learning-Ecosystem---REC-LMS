import { Award, BookOpen, Clock } from 'lucide-react';

const studentStats = [
  { label: 'Enrolled Courses', value: '0', icon: BookOpen },
  { label: 'Hours Learned', value: '0', icon: Clock },
  { label: 'Certificates', value: '0', icon: Award },
];

export default function StudentPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 inline-flex rounded-lg bg-primary-600/10 p-2 text-primary-400">
          <BookOpen className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Student Dashboard</h1>
        <p className="mt-1 text-gray-400">Continue courses and review your learning progress.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {studentStats.map((stat) => (
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
