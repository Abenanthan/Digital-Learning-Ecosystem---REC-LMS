// ============================================
// Shared Constants
// ============================================

export const APP_NAME = 'REC Digital Learning Ecosystem';
export const APP_SHORT_NAME = 'REC LMS';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;

// File upload
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Password rules
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
export const PASSWORD_REQUIREMENTS = 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.';

// Course
export const COURSE_TITLE_MIN_LENGTH = 3;
export const COURSE_TITLE_MAX_LENGTH = 200;
export const COURSE_DESCRIPTION_MAX_LENGTH = 5000;
