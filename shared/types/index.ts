// ============================================
// Shared Types - REC Digital Learning Ecosystem
// ============================================

// ---- Enums ----
export enum Role {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
}

// ---- User ----
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatar: string | null;
  bio: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends Omit<User, 'createdAt' | 'updatedAt'> {
  enrolledCourses?: number;
  completedCourses?: number;
}

// ---- Auth ----
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
}

// ---- Course ----
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  price: number;
  isPublished: boolean;
  categoryId: string | null;
  instructorId: string;
  instructor?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
  category?: Category;
  chapters?: Chapter[];
  enrollments?: Enrollment[];
  _count?: {
    chapters: number;
    enrollments: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  categoryId?: string;
  price?: number;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  isPublished?: boolean;
  thumbnail?: string;
}

// ---- Category ----
export interface Category {
  id: string;
  name: string;
  slug: string;
}

// ---- Chapter ----
export interface Chapter {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChapterRequest {
  title: string;
  description?: string;
  videoUrl?: string;
  isFree?: boolean;
}

// ---- Enrollment ----
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
}

// ---- Progress ----
export interface Progress {
  id: string;
  userId: string;
  chapterId: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- API Response ----
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ---- Attachment ----
export interface Attachment {
  id: string;
  name: string;
  url: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}
