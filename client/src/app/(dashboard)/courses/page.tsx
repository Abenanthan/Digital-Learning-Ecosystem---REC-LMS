'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';

// Placeholder course data for the scaffold
const placeholderCourses = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    instructor: 'Dr. Sarah Johnson',
    category: 'Web Development',
    price: 0,
    chapters: 12,
    enrollments: 45,
    thumbnail: null,
  },
  {
    id: '2',
    title: 'Python for Data Science',
    instructor: 'Prof. Michael Chen',
    category: 'Data Science',
    price: 29.99,
    chapters: 18,
    enrollments: 120,
    thumbnail: null,
  },
  {
    id: '3',
    title: 'React Native Masterclass',
    instructor: 'Jane Williams',
    category: 'Mobile Development',
    price: 49.99,
    chapters: 24,
    enrollments: 89,
    thumbnail: null,
  },
];

const categories = ['All', 'Web Development', 'Data Science', 'Mobile Development'];

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCourses = placeholderCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Explore Courses</h1>
        <p className="mt-1 text-gray-400">Discover courses tailored to your interests.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-dark-800 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-400" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                  : 'text-gray-400 hover:bg-dark-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group overflow-hidden rounded-2xl border border-white/5 bg-dark-800/50 transition-all duration-300 hover:border-white/10 hover:bg-dark-800 hover:shadow-xl hover:shadow-black/20"
            >
              {/* Thumbnail */}
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-primary-900/40 to-dark-700">
                <BookOpen className="h-12 w-12 text-primary-500/50 transition-transform group-hover:scale-110" />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-md bg-primary-500/10 px-2 py-0.5 text-xs font-medium text-primary-400">
                    {course.category}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </span>
                </div>

                <h3 className="mb-1 text-base font-semibold text-white line-clamp-2 group-hover:text-primary-400 transition-colors">
                  {course.title}
                </h3>
                <p className="mb-3 text-sm text-gray-500">{course.instructor}</p>

                <div className="flex items-center justify-between border-t border-white/5 pt-3 text-xs text-gray-500">
                  <span>{course.chapters} chapters</span>
                  <span>{course.enrollments} enrolled</span>
                </div>

                {/* Progress bar placeholder */}
                <div className="mt-3 h-1.5 w-full rounded-full bg-dark-600">
                  <div className="h-full w-0 rounded-full bg-gradient-to-r from-primary-500 to-purple-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-dark-800/30 p-16 text-center">
          <Search className="mx-auto mb-4 h-12 w-12 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-300">No courses found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              page === 1
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                : 'text-gray-400 hover:bg-dark-700 hover:text-white'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
