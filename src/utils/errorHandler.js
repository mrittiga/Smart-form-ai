/**
 * Error Handler Utility
 * Centralized error handling and logging
 */

export class AppError extends Error {
  constructor(message, code = 'ERROR', statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

// Error types
export const ERROR_TYPES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

// Parse API error
export const parseApiError = (error) => {
  if (!error) {
    return {
      type: ERROR_TYPES.UNKNOWN_ERROR,
      message: 'An unknown error occurred',
      statusCode: 500,
    };
  }

  // Handle response error
  if (error.response) {
    const { status, data } = error.response;

    return {
      type: getErrorType(status),
      message: data?.error || data?.message || 'Request failed',
      statusCode: status,
      details: data,
    };
  }

  // Handle request error
  if (error.request) {
    return {
      type: ERROR_TYPES.NETWORK_ERROR,
      message: 'No response from server. Please check your connection.',
      statusCode: 0,
    };
  }

  // Handle other errors
  return {
    type: ERROR_TYPES.UNKNOWN_ERROR,
    message: error.message || 'An unexpected error occurred',
    statusCode: 500,
  };
};

// Get error type from status code
const getErrorType = (status) => {
  switch (status) {
    case 400:
    case 422:
      return ERROR_TYPES.VALIDATION_ERROR;
    case 401:
    case 403:
      return ERROR_TYPES.AUTH_ERROR;
    case 404:
      return ERROR_TYPES.NOT_FOUND;
    case 500:
    case 502:
    case 503:
      return ERROR_TYPES.SERVER_ERROR;
    default:
      return ERROR_TYPES.UNKNOWN_ERROR;
  }
};

// Log error
export const logError = (error, context = '') => {
  const parsed = parseApiError(error);

  console.error(
    `[${parsed.type}] ${context || 'Error'}:`,
    {
      message: parsed.message,
      statusCode: parsed.statusCode,
      details: parsed.details,
    }
  );

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // sendToErrorTrackingService(error, context);
  }
};

// Get user-friendly error message
export const getUserFriendlyMessage = (error) => {
  const parsed = parseApiError(error);

  switch (parsed.type) {
    case ERROR_TYPES.VALIDATION_ERROR:
      return parsed.message || 'Please check your input and try again';

    case ERROR_TYPES.AUTH_ERROR:
      return 'You need to log in again';

    case ERROR_TYPES.NOT_FOUND:
      return 'The resource you are looking for does not exist';

    case ERROR_TYPES.NETWORK_ERROR:
      return 'Network error. Please check your connection and try again';

    case ERROR_TYPES.SERVER_ERROR:
      return 'Server error. Please try again later';

    default:
      return 'An unexpected error occurred. Please try again';
  }
};

// Handle fetch error
export const handleFetchError = (error, fallbackMessage = 'Failed to load data') => {
  logError(error, fallbackMessage);
  return {
    error: true,
    message: getUserFriendlyMessage(error),
    parsed: parseApiError(error),
  };
};

// Retry failed request
export const retryRequest = async (
  requestFn,
  maxRetries = 3,
  delay = 1000
) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
};

export default {
  AppError,
  ERROR_TYPES,
  parseApiError,
  logError,
  getUserFriendlyMessage,
  handleFetchError,
  retryRequest,
};
