export enum ErrorType {
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: unknown;
  timestamp: string;
}

export const handleError = (error: unknown, type: ErrorType = ErrorType.UNKNOWN_ERROR): AppError => {
  const message = error instanceof Error ? error.message : String(error);
  
  const appError: AppError = {
    type,
    message,
    details: error,
    timestamp: new Date().toISOString(),
  };

  // Log error for debugging
  console.error(`[${appError.type}] ${appError.timestamp}: ${appError.message}`, appError.details);

  return appError;
};

export class CustomError extends Error {
  type: ErrorType;
  details?: unknown;

  constructor(message: string, type: ErrorType = ErrorType.UNKNOWN_ERROR, details?: unknown) {
    super(message);
    this.name = 'CustomError';
    this.type = type;
    this.details = details;
  }
}
