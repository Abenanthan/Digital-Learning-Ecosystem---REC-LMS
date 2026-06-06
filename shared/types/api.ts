// ============================================
// API Types - Request/Response contracts
// ============================================

/** Query parameters for listing/searching */
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CourseFilterParams extends PaginationParams {
  categoryId?: string;
  instructorId?: string;
  isPublished?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

/** Standard error response */
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  stack?: string;
}
