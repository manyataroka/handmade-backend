/**
 * Standardized API response helpers for consistent Flutter client parsing.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  metadata?: PaginationMetadata;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function successResponse<T = any>(
  message: string,
  data?: T,
  metadata?: PaginationMetadata
): ApiResponse<T> {
  return {
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(metadata && { metadata }),
  };
}

export function errorResponse(
  message: string,
  statusCode: number = 500,
  error?: any
): ApiResponse {
  return {
    success: false,
    message,
    ...(error && { error: process.env.NODE_ENV === 'development' ? error : undefined }),
  };
}

export function paginationMetadata(
  total: number,
  page: number,
  limit: number
): PaginationMetadata {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

