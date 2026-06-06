import { BookOpen, FilePlus2, Users } from 'lucide-react';

const teacherActions = [
  { label: 'Published Courses', value: '0', icon: BookOpen },
  { label: 'Learners', value: '0', icon: Users },
  { label: 'Draft Lessons', value: '0', icon: FilePlus2 },
];

export default function TeacherPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 inline-flex rounded-lg bg-primary-600/10 p-2 text-primary-400">
          <BookOpen className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Teacher Dashboard</h1>
        <p className="mt-1 text-gray-400">Create lessons and track learner engagement.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {teacherActions.map((item) => (
          <div key={item.label} className="rounded-lg border border-white/5 bg-dark-800/50 p-5">
            <item.icon className="mb-4 h-5 w-5 text-primary-400" />
            <p className="text-2xl font-bold text-white">{item.value}</p>
            <p className="mt-1 text-sm text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
