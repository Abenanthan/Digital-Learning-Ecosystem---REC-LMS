export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface CourseDTO {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  teacherId: string;
  teacherName: string;
  lessonCount: number;
  materialCount: number;
  createdAt: string;
}

export interface LessonDTO {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number;
  position: number;
  courseId: string;
}

export interface MaterialDTO {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  courseId: string;
  lessonId: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserDTO;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface VideoUploadResponse {
  videoUrl: string;
  duration: number;
}

export interface MaterialUploadResponse {
  fileUrl: string;
  fileType: string;
}

export interface ThumbnailUploadResponse {
  thumbnailUrl: string;
}
