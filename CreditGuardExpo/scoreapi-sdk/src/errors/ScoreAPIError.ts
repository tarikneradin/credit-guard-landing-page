/**
 * Custom error class for ScoreAPI SDK
 */

export class ScoreAPIError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly details?: any;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', statusCode?: number, details?: any) {
    super(message);
    this.name = 'ScoreAPIError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ScoreAPIError);
    }
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

/**
 * Pre-defined error codes
 */
export const ErrorCodes = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_REQUIRED: 'TOKEN_REQUIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_REFRESH_FAILED: 'TOKEN_REFRESH_FAILED',

  // User errors
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  USER_ENROLLMENT_FAILED: 'USER_ENROLLMENT_FAILED',
  USER_THIN_FILE: 'USER_THIN_FILE',

  // Identity verification errors
  IDENTITY_VERIFICATION_FAILED: 'IDENTITY_VERIFICATION_FAILED',
  DIT_VERIFICATION_FAILED: 'DIT_VERIFICATION_FAILED',
  SMFA_VERIFICATION_FAILED: 'SMFA_VERIFICATION_FAILED',

  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_PARAMETER: 'INVALID_PARAMETER',

  // Server errors
  SERVER_ERROR: 'SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

  // Unknown
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

/**
 * Helper to create error from HTTP response
 */
export function createErrorFromResponse(error: any): ScoreAPIError {
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || data?.error || error.message || 'An error occurred';
    const code = data?.code || mapStatusToErrorCode(status);
    return new ScoreAPIError(message, code, status, data);
  } else if (error.request) {
    return new ScoreAPIError(
      'No response received from server',
      ErrorCodes.NETWORK_ERROR,
      undefined,
      error.request
    );
  } else {
    return new ScoreAPIError(
      error.message || 'Unknown error occurred',
      ErrorCodes.UNKNOWN_ERROR
    );
  }
}

/**
 * Map HTTP status codes to error codes
 */
function mapStatusToErrorCode(status: number): string {
  switch (status) {
    case 401:
      return ErrorCodes.UNAUTHORIZED;
    case 404:
      return ErrorCodes.USER_NOT_FOUND;
    case 400:
      return ErrorCodes.VALIDATION_ERROR;
    case 408:
      return ErrorCodes.TIMEOUT_ERROR;
    case 500:
    case 502:
    case 503:
      return ErrorCodes.SERVER_ERROR;
    case 504:
      return ErrorCodes.TIMEOUT_ERROR;
    default:
      return ErrorCodes.UNKNOWN_ERROR;
  }
}
