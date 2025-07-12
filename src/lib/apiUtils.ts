import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data?.message || error.message || "API request failed",
      status: error.response?.status,
      code: error.code,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message || "An unexpected error occurred",
    };
  }
  
  return {
    message: "An unknown error occurred",
  };
}

export function isApiError(error: unknown): error is AxiosError {
  return error instanceof AxiosError;
}

export function shouldRetryRequest(error: AxiosError): boolean {
  // Don't retry 4xx errors (client errors)
  if (error.response?.status && error.response.status >= 400 && error.response.status < 500) {
    return false;
  }
  
  // Retry 5xx errors (server errors) and network errors
  return true;
}

export function getErrorMessage(error: unknown): string {
  const apiError = handleApiError(error);
  
  // Custom error messages based on status codes
  switch (apiError.status) {
    case 404:
      return "Resource not found. Please try again later.";
    case 401:
      return "Authentication required. Please log in again.";
    case 403:
      return "Access denied. You don't have permission to perform this action.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return apiError.message;
  }
}

/**
 * Generate local image URL for questions
 * @param questionNumber - The question number (1-9)
 * @returns Local API URL for the question image
 */
export function getQuestionImageUrl(questionNumber: number): string {
  // For server-side rendering, use relative URL
  return `/api/image?filename=question-${questionNumber}.webp`;
}

/**
 * Check if we should use local images instead of external CDN
 * @returns boolean indicating if local images should be used
 */
export function shouldUseLocalImages(): boolean {
  // For now, always use external images to avoid issues
  // We can enable local images later when needed
  return false;
} 